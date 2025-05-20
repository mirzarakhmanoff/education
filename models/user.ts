import mongoose, { Schema, type Document } from "mongoose"
import { hash, compare } from "bcryptjs"

export interface IUser extends Document {
  email: string
  password: string
  name: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
  comparePassword: (password: string) => Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    this.password = await hash(this.password, 12)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return compare(password, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
