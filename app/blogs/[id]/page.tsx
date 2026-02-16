'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useFirebaseAuth } from '@/components/firebase-auth-provider'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface BlogPost {
  id: string
  userId: string
  title: string
  description: string
  recipe: string
  imageUrl: string
  authorName: string
  createdAt: string
  likes: number
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const { user } = useFirebaseAuth()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, 'foodBlogs', params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() } as BlogPost)

          // Check if user is following the author
          if (user) {
            const followRes = await fetch(`/api/follows?userId=${user.uid}`)
            if (followRes.ok) {
              const { followingIds } = await followRes.json()
              setIsFollowing(followingIds.includes(docSnap.data().userId))
            }
          }
        }
      } catch (error) {
        console.error('[v0] Error fetching blog:', error)
        toast({
          title: 'Error',
          description: 'Failed to load blog',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id, user, toast])

  const handleFollow = async () => {
    if (!user || !blog) return

    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          followingId: blog.userId,
        }),
      })

      if (response.ok) {
        setIsFollowing(true)
        toast({
          title: 'Success',
          description: 'Following author successfully',
        })
      }
    } catch (error) {
      console.error('[v0] Follow error:', error)
      toast({
        title: 'Error',
        description: 'Failed to follow',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!blog) {
    return <div className="text-center py-12">Blog not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <p className="text-gray-600">By <span className="font-semibold">{blog.authorName}</span></p>
              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>

            {user?.uid !== blog.userId && !isFollowing && (
              <Button
                onClick={handleFollow}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Follow Author
              </Button>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 text-lg">{blog.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {blog.recipe}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
