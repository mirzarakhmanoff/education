import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Institution from "@/models/institution"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { z } from "zod"

// Schema for institution update validation
const institutionUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  type: z.enum(["kindergarten", "school", "college"]).optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  region: z.string().min(2, "Region must be at least 2 characters").optional(),
  contactPhone: z.string().min(5, "Phone must be at least 5 characters").optional(),
  contactEmail: z.string().email("Invalid email address").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  isActive: z.boolean().optional(),
})

// GET institution by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const institution = await Institution.findById(params.id)

    if (!institution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 })
    }

    return NextResponse.json(institution)
  } catch (error) {
    console.error("Error fetching institution:", error)
    return NextResponse.json({ error: "Failed to fetch institution" }, { status: 500 })
  }
}

// PUT update institution (admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = institutionUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    await connectToDatabase()

    const updatedInstitution = await Institution.findByIdAndUpdate(params.id, validationResult.data, {
      new: true,
      runValidators: true,
    })

    if (!updatedInstitution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 })
    }

    return NextResponse.json(updatedInstitution)
  } catch (error) {
    console.error("Error updating institution:", error)
    return NextResponse.json({ error: "Failed to update institution" }, { status: 500 })
  }
}

// DELETE institution (admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Instead of actually deleting, we'll set isActive to false
    const deactivatedInstitution = await Institution.findByIdAndUpdate(params.id, { isActive: false }, { new: true })

    if (!deactivatedInstitution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deactivating institution:", error)
    return NextResponse.json({ error: "Failed to deactivate institution" }, { status: 500 })
  }
}
