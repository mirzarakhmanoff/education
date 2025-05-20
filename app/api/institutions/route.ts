import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Institution from "@/models/institution"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { z } from "zod"

// Schema for institution validation
const institutionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["kindergarten", "school", "college"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  region: z.string().min(2, "Region must be at least 2 characters"),
  contactPhone: z.string().min(5, "Phone must be at least 5 characters"),
  contactEmail: z.string().email("Invalid email address"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  isActive: z.boolean().optional(),
})

// GET all institutions
export async function GET() {
  try {
    await connectToDatabase()
    const institutions = await Institution.find({ isActive: true }).sort({ name: 1 })
    return NextResponse.json(institutions)
  } catch (error) {
    console.error("Error fetching institutions:", error)
    return NextResponse.json({ error: "Failed to fetch institutions" }, { status: 500 })
  }
}

// POST new institution (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = institutionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    await connectToDatabase()

    const newInstitution = new Institution(validationResult.data)
    await newInstitution.save()

    return NextResponse.json(newInstitution, { status: 201 })
  } catch (error) {
    console.error("Error creating institution:", error)
    return NextResponse.json({ error: "Failed to create institution" }, { status: 500 })
  }
}
