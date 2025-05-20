import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Application from "@/models/application"
import Institution from "@/models/institution"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

// GET admin statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get total counts
    const totalApplications = await Application.countDocuments()
    const pendingApplications = await Application.countDocuments({ status: "pending" })
    const approvedApplications = await Application.countDocuments({ status: "approved" })
    const rejectedApplications = await Application.countDocuments({ status: "rejected" })
    const totalInstitutions = await Institution.countDocuments({ isActive: true })

    // Get applications by institution type
    const applicationsByType = await Application.aggregate([
      {
        $lookup: {
          from: "institutions",
          localField: "institution",
          foreignField: "_id",
          as: "institutionData",
        },
      },
      {
        $unwind: "$institutionData",
      },
      {
        $group: {
          _id: "$institutionData.type",
          count: { $sum: 1 },
        },
      },
    ])

    // Get applications by status over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const applicationsByDate = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ])

    return NextResponse.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalInstitutions,
      applicationsByType,
      applicationsByDate,
    })
  } catch (error) {
    console.error("Error fetching admin statistics:", error)
    return NextResponse.json({ error: "Failed to fetch admin statistics" }, { status: 500 })
  }
}
