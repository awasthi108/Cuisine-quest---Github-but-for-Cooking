'use client'

import { useState } from 'react'
import { useFirebaseAuth } from '@/components/firebase-auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function CreateBlogPage() {
  const { user } = useFirebaseAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipe: '',
    imageUrl: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a blog',
        variant: 'destructive',
      })
      return
    }

    if (!formData.title || !formData.description || !formData.recipe) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      console.log('[v0] Submitting blog creation:', { ...formData, userId: user.uid })
      
      const response = await fetch('/api/food-blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          authorName: user.displayName || 'Anonymous Chef',
          title: formData.title,
          description: formData.description,
          recipe: formData.recipe,
          imageUrl: formData.imageUrl,
        }),
      })

      const data = await response.json()
      console.log('[v0] API Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create blog')
      }

      toast({
        title: 'Success',
        description: 'Blog post created successfully!',
      })

      router.push('/blogs')
    } catch (error: any) {
      console.error('[v0] Blog creation error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create blog. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Food Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Amazing Recipe..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your recipe..."
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Details
            </label>
            <textarea
              name="recipe"
              value={formData.recipe}
              onChange={handleChange}
              placeholder="Ingredients and instructions..."
              rows={8}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-4 max-w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
