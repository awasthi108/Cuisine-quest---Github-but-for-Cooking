import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    throw new Error("No token provided")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
  return decoded.userId
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const { username, email } = await request.json()

    const client = await clientPromise
    const db = client.db("cuisine-quest")
    const users = db.collection("users")

    const updateData: any = {}
    if (username) updateData.username = username
    if (email) updateData.email = email

    await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData })

    const updatedUser = await users.findOne({ _id: new ObjectId(userId) })

    const userResponse = {
      id: updatedUser?._id.toString(),
      username: updatedUser?.username,
      email: updatedUser?.email,
      avatar: updatedUser?.avatar,
    }

    return NextResponse.json({ user: userResponse })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
