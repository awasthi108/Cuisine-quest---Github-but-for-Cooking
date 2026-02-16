import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const foodBlogsRef = collection(db, 'foodBlogs')
    let q

    if (userId) {
      q = query(
        foodBlogsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    } else {
      q = query(foodBlogsRef, orderBy('createdAt', 'desc'))
    }

    const snapshot = await getDocs(q)
    const blogs = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
      }
    })

    return NextResponse.json(blogs)
  } catch (error: any) {
    console.error('[v0] Food blogs fetch error:', error)
    
    // Check if it's a permission error
    if (error.code === 'permission-denied') {
      return NextResponse.json(
        { 
          error: 'Firestore rules not deployed. Please see FIRESTORE_SETUP.md for instructions.',
          code: 'permission-denied'
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch food blogs' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[v0] Creating blog with data:', { ...body, recipe: body.recipe?.substring(0, 50) })
    
    const { userId, title, description, recipe, imageUrl, authorName } = body

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    if (!title || !description || !recipe) {
      return NextResponse.json(
        { error: 'Title, description, and recipe are required' },
        { status: 400 }
      )
    }

    const foodBlogsRef = collection(db, 'foodBlogs')
    const blogData = {
      userId,
      title,
      description,
      recipe,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop',
      authorName: authorName || 'Anonymous Chef',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      views: 0,
    }

    console.log('[v0] Blog data prepared for Firestore')
    const docRef = await addDoc(foodBlogsRef, blogData)
    console.log('[v0] Blog created successfully with ID:', docRef.id)

    return NextResponse.json(
      { 
        id: docRef.id, 
        message: 'Food blog created successfully',
        blog: { ...blogData, id: docRef.id }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Food blog creation error:', error)
    console.error('[v0] Error stack:', error.stack)
    
    // Check if it's a permission error
    if (error.code === 'permission-denied') {
      return NextResponse.json(
        { 
          error: 'Firestore rules not deployed. Please see FIRESTORE_SETUP.md for instructions.',
          code: 'permission-denied'
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create food blog' },
      { status: 500 }
    )
  }
}
