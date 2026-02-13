import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { userId, followingId } = await req.json()

    if (!userId || !followingId) {
      return NextResponse.json(
        { error: 'Missing userId or followingId' },
        { status: 400 }
      )
    }

    if (userId === followingId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    const followsRef = collection(db, 'follows')
    const existingFollow = await getDocs(
      query(followsRef, where('userId', '==', userId), where('followingId', '==', followingId))
    )

    if (!existingFollow.empty) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      )
    }

    const docRef = await addDoc(followsRef, {
      userId,
      followingId,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { id: docRef.id, message: 'Following user successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Follow error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const followingId = searchParams.get('followingId')

    if (!userId || !followingId) {
      return NextResponse.json(
        { error: 'Missing userId or followingId' },
        { status: 400 }
      )
    }

    const followsRef = collection(db, 'follows')
    const followQuery = query(
      followsRef,
      where('userId', '==', userId),
      where('followingId', '==', followingId)
    )

    const snapshot = await getDocs(followQuery)
    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Not following this user' },
        { status: 404 }
      )
    }

    await deleteDoc(snapshot.docs[0].ref)

    return NextResponse.json({ message: 'Unfollowed successfully' })
  } catch (error: any) {
    console.error('[v0] Unfollow error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const followsRef = collection(db, 'follows')
    const followQuery = query(followsRef, where('userId', '==', userId))
    const snapshot = await getDocs(followQuery)

    const followingIds = snapshot.docs.map(doc => doc.data().followingId)

    return NextResponse.json({ followingIds })
  } catch (error: any) {
    console.error('[v0] Get follows error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
