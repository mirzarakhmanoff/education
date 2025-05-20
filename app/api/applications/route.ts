import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Application from "@/models/application";
import Institution from "@/models/institution";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Extend the Session type to include the role property
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Add the role property
    };
  }
}

// -----------------------------
// ZOD SCHEMA for Application
// -----------------------------
// Updated document schema with more flexible URL validation
const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  // Make URL more flexible - either a valid URL or any string
  url: z.string(),
  type: z.string(),
});

// Updated application schema with optional documents
const applicationSchema = z.object({
  applicantName: z.string().min(3, "Name must be at least 3 characters"),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  institution: z.string().min(1, "Institution is required"),
  // Make documents optional or allow empty array
  documents: z.array(documentSchema).optional().default([]),
});

// -----------------------------
// TypeScript Types
// -----------------------------
type ApplicationInput = z.infer<typeof applicationSchema>;

// Helper function to generate a unique application ID
function generateApplicationId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `APP-${timestamp}-${random}`;
}

// -----------------------------
// GET /api/applications
// -----------------------------
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const applicationId = searchParams.get("applicationId");
    const status = searchParams.get("status");
    const institutionId = searchParams.get("institution");

    const query: Record<string, any> = {};

    if (session.user?.role === "admin") {
      if (email) query.email = email;
      if (applicationId) query.applicationId = applicationId;
      if (status) query.status = status;
      if (institutionId) query.institution = institutionId;
    } else {
      query.email = session.user?.email || "";
    }

    const applications = await Application.find(query)
      .populate("institution", "name type")
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error: any) {
    console.error("❌ Error fetching applications:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// -----------------------------
// POST /api/applications
// -----------------------------
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    // Log the received data for debugging
    console.log("Received application data:", JSON.stringify(body, null, 2));

    // Validate the input data with more detailed error handling
    const validation = applicationSchema.safeParse(body);

    if (!validation.success) {
      console.error(
        "Validation error:",
        JSON.stringify(validation.error.format(), null, 2)
      );
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the institution exists
    const institution = await Institution.findById(validation.data.institution);
    if (!institution) {
      return NextResponse.json(
        { error: "Institution not found" },
        { status: 404 }
      );
    }

    // Ensure documents is an array (even if empty)
    const documents = Array.isArray(validation.data.documents)
      ? validation.data.documents
      : [];

    // Create a new application with the validated data
    const newApplication = new Application({
      applicantName: validation.data.applicantName,
      birthDate: new Date(validation.data.birthDate),
      email: validation.data.email,
      phone: validation.data.phone,
      institution: validation.data.institution,
      documents: documents,
      status: "pending",
      applicationId: generateApplicationId(),
    });

    // Save the application to the database
    await newApplication.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        applicationId: newApplication.applicationId,
        message: "Application submitted successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Log the detailed error for debugging
    console.error("❌ Error creating application:", error);

    // Return a more specific error message if possible
    return NextResponse.json(
      {
        error: "Failed to create application",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
