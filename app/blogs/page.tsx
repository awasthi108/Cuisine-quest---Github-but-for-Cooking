'use client'

import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '@/components/firebase-auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface FoodBlog {
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

interface Follow {
  userId: string
  followingId: string
}

export default function FoodBlogsPage() {
  const { user } = useFirebaseAuth()
  const [blogs, setBlogs] = useState<FoodBlog[]>([])
  const [followingList, setFollowingList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'following'>('all')
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Fetch user's following list
        const followRes = await fetch(`/api/follows?userId=${user.uid}`)
        if (followRes.ok) {
          const { followingIds } = await followRes.json()
          setFollowingList(followingIds)
        }

        // Fetch all blogs
        const blogsRes = await fetch('/api/food-blogs')
        if (blogsRes.ok) {
          const data = await blogsRes.json()
          setBlogs(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load blogs',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  const filteredBlogs = filter === 'following' 
    ? blogs.filter(blog => followingList.includes(blog.userId))
    : blogs

  const handleFollow = async (authorId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          followingId: authorId,
        }),
      })

      if (response.ok) {
        setFollowingList([...followingList, authorId])
        toast({
          title: 'Success',
          description: 'Following user successfully',
        })
      }
    } catch (error) {
      console.error('[v0] Follow error:', error)
      toast({
        title: 'Error',
        description: 'Failed to follow user',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Food Blogs</h1>
          <Link href="/blogs/create">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              Create Blog Post
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            All Posts
          </Button>
          <Button
            variant={filter === 'following' ? 'default' : 'outline'}
            onClick={() => setFilter('following')}
            className={filter === 'following' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Following
          </Button>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">No blogs to display</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{blog.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{blog.authorName}</span>
                  {user?.uid !== blog.userId && !followingList.includes(blog.userId) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFollow(blog.userId)}
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      Follow
                    </Button>
                  )}
                </div>

                <Link href={`/blogs/${blog.id}`}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    Read More
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
