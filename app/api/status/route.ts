import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Application from "@/models/application"
import { z } from "zod"

// Schema for status check validation
const statusCheckSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    applicationId: z.string().optional(),
  })
  .refine((data) => data.email || data.applicationId, {
    message: "Either email or applicationId must be provided",
  })

// POST to check application status
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = statusCheckSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    await connectToDatabase()

    const { email, applicationId } = validationResult.data

    const query: any = {}
    if (email) query.email = email
    if (applicationId) query.applicationId = applicationId

    const applications = await Application.find(query).populate("institution", "name type").sort({ createdAt: -1 })

    if (applications.length === 0) {
      return NextResponse.json({ error: "No applications found" }, { status: 404 })
    }

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error checking application status:", error)
    return NextResponse.json({ error: "Failed to check application status" }, { status: 500 })
  }
}
