"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, UserPlus, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample chef data with follow status
const chefs = [
  {
    id: 1,
    name: "Gordon Ramsay",
    specialty: "British Cuisine",
    rating: 4.9,
    followers: "2.1M",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=GordonRamsay",
    isFollowing: false,
  },
  {
    id: 2,
    name: "Vikas Khanna",
    specialty: "Indian Cuisine",
    rating: 4.8,
    followers: "890K",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=VikasKhanna",
    isFollowing: true,
  },
  {
    id: 3,
    name: "Julia Child",
    specialty: "French Cuisine",
    rating: 4.9,
    followers: "1.5M",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=JuliaChild",
    isFollowing: false,
  },
  {
    id: 4,
    name: "Massimo Bottura",
    specialty: "Italian Cuisine",
    rating: 4.9,
    followers: "750K",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MassimoBottura",
    isFollowing: false,
  },
  {
    id: 5,
    name: "Dominique Crenn",
    specialty: "French Cuisine",
    rating: 4.8,
    followers: "650K",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=DominiqueCrenn",
    isFollowing: true,
  },
  {
    id: 6,
    name: "Sanjeev Kapoor",
    specialty: "Indian Cuisine",
    rating: 4.7,
    followers: "1.2M",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=SanjeevKapoor",
    isFollowing: false,
  },
]

export function ChefCarousel() {
  const { toast } = useToast()
  const [followStatus, setFollowStatus] = useState(
    chefs.reduce((acc, chef) => ({ ...acc, [chef.id]: chef.isFollowing }), {} as Record<number, boolean>),
  )
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleFollow = (chefId: number, chefName: string) => {
    const isCurrentlyFollowing = followStatus[chefId]

    setFollowStatus((prev) => ({
      ...prev,
      [chefId]: !isCurrentlyFollowing,
    }))

    toast({
      title: isCurrentlyFollowing ? "Unfollowed! 👋" : "Following! 🎉",
      description: isCurrentlyFollowing ? `You unfollowed ${chefName}` : `You are now following ${chefName}`,
    })
  }

  const scrollLeft = () => {
    const container = document.getElementById("chef-carousel")
    if (container) {
      const newPosition = Math.max(scrollPosition - 300, 0)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("chef-carousel")
    if (container) {
      const newPosition = Math.min(scrollPosition + 300, container.scrollWidth - container.clientWidth)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-orange-50 shadow-md"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-5 w-5 text-orange-700" />
        </Button>
      </div>

      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-orange-50 shadow-md"
          onClick={scrollRight}
        >
          <ChevronRight className="h-5 w-5 text-orange-700" />
        </Button>
      </div>

      {/* Carousel Container */}
      <div
        id="chef-carousel"
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {chefs.map((chef) => (
          <Card
            key={chef.id}
            className="min-w-[200px] bg-white/90 backdrop-blur-sm border-orange-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <CardContent className="p-4 text-center space-y-3">
              <Avatar className="w-16 h-16 mx-auto border-2 border-orange-200">
                <AvatarImage src={chef.image || "/placeholder.svg"} alt={chef.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  {chef.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold text-orange-800 text-sm">{chef.name}</h3>
                <p className="text-xs text-orange-600">{chef.specialty}</p>
              </div>

              <div className="flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-orange-700">{chef.rating}</span>
              </div>

              <p className="text-xs text-gray-500">{chef.followers} followers</p>

              <Button
                size="sm"
                variant={followStatus[chef.id] ? "default" : "outline"}
                onClick={() => handleFollow(chef.id, chef.name)}
                className={`w-full text-xs ${
                  followStatus[chef.id]
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border-orange-200 hover:bg-orange-50 text-orange-700"
                }`}
              >
                {followStatus[chef.id] ? (
                  <>
                    <UserCheck className="w-3 h-3 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        #chef-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
