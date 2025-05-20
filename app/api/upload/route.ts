import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadsDir = join(process.cwd(), "public", "uploads")
  try {
    await mkdir(uploadsDir, { recursive: true })
  } catch (error) {
    console.error("Error creating uploads directory:", error)
  }
  return uploadsDir
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type (only allow PDF, JPG, PNG)
    const fileType = file.type
    if (!["application/pdf", "image/jpeg", "image/png"].includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, JPG, and PNG are allowed." }, { status: 400 })
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Generate a unique filename
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDir()

    // Create file path
    const filePath = join(uploadsDir, fileName)

    // Convert file to buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Generate URL for the file
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName,
      originalName: file.name,
      fileType,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
