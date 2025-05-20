import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Application from "@/models/application"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { z } from "zod"

// Schema for application update validation (admin only)
const applicationUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  notes: z.string().optional(),
})

// GET application by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    await connectToDatabase()

    const application = await Application.findById(params.id).populate("institution", "name type address city")

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if user is authorized to view this application
    if (!session || (session.user.role !== "admin" && application.email !== session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

// PUT update application status (admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = applicationUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    await connectToDatabase()

    const updatedApplication = await Application.findByIdAndUpdate(params.id, validationResult.data, {
      new: true,
      runValidators: true,
    })

    if (!updatedApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Here you would typically send an email notification to the applicant
    // about their application status change

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
