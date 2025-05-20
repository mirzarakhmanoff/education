import mongoose, { Schema, type Document } from "mongoose"

export interface IInstitution extends Document {
  name: string
  type: "kindergarten" | "school" | "college"
  address: string
  city: string
  region: string
  contactPhone: string
  contactEmail: string
  description: string
  capacity: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["kindergarten", "school", "college"],
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Institution || mongoose.model<IInstitution>("Institution", InstitutionSchema)
