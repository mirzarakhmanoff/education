import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/user"
import { z } from "zod"

// Schema for user registration validation
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validationResult.data.email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = new User({
      name: validationResult.data.name,
      email: validationResult.data.email,
      password: validationResult.data.password,
      role: "user", // Default role
    })

    await newUser.save()

    return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
