import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')

    let foodBlogsRef = collection(db, 'foodBlogs')
    let q = query(foodBlogsRef, orderBy('createdAt', 'desc'))

    if (userId) {
      q = query(foodBlogsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    }

    const snapshot = await getDocs(q)
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(blogs)
  } catch (error: any) {
    console.error('[v0] Food blogs fetch error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, title, description, recipe, imageUrl, authorName } = body

    if (!userId || !title || !description || !recipe) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const foodBlogsRef = collection(db, 'foodBlogs')
    const docRef = await addDoc(foodBlogsRef, {
      userId,
      title,
      description,
      recipe,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop',
      authorName,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    })

    return NextResponse.json(
      { id: docRef.id, message: 'Food blog created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Food blog creation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
