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

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)

    const client = await clientPromise
    const db = client.db("cuisine-quest")
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ favorites: user.favorites || [] })
  } catch (error) {
    console.error("Get favorites error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const { mealId, mealData } = await request.json()

    const client = await clientPromise
    const db = client.db("cuisine-quest")
    const users = db.collection("users")

    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: {
          favorites: {
            mealId,
            ...mealData,
            addedAt: new Date(),
          },
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Add favorite error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const { searchParams } = new URL(request.url)
    const mealId = searchParams.get("mealId")

    const client = await clientPromise
    const db = client.db("cuisine-quest")
    const users = db.collection("users")

    await users.updateOne({ _id: new ObjectId(userId) }, { $pull: { favorites: { mealId } } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Remove favorite error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
