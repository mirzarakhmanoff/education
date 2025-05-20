import mongoose, { Schema, type Document } from "mongoose"

export interface IApplication extends Document {
  applicantName: string
  birthDate: Date
  email: string
  phone: string
  institution: mongoose.Types.ObjectId
  documents: {
    name: string
    url: string
    type: string
  }[]
  status: "pending" | "approved" | "rejected"
  notes: string
  applicationId: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

// Generate unique application ID before saving
ApplicationSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate a unique application ID (e.g., APP-2023-00001)
    const count = await mongoose.models.Application.countDocuments()
    const year = new Date().getFullYear()
    this.applicationId = `APP-${year}-${(count + 1).toString().padStart(5, "0")}`
  }
  next()
})

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)
