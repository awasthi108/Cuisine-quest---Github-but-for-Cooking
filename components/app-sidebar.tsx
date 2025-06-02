"use client"

import { Home, ChefHat, Sparkles, Heart, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Recipes",
    url: "/recipes",
    icon: ChefHat,
  },
  {
    title: "Generator",
    url: "/generator",
    icon: Sparkles,
  },
  {
    title: "Health Mode",
    url: "/health",
    icon: Heart,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: User,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogoClick = () => {
    router.push("/")
  }

  // Don't render sidebar if user is not authenticated or on auth pages
  if (!user || pathname.startsWith("/auth")) {
    return null
  }

  return (
    <Sidebar className="border-r border-orange-200/50 bg-white/95 backdrop-blur-sm">
      <SidebarHeader className="p-4 lg:p-6">
        <div
          className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
          onClick={handleLogoClick}
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-300/50 transition-all duration-300">
            <ChefHat className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-orange-700 transition-all duration-300">
              Cuisine Quest
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 group-hover:text-orange-600 transition-colors duration-300">
              Recipe Platform
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 lg:px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="w-full justify-start gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl hover:bg-orange-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-orange-100 data-[active=true]:to-orange-50 data-[active=true]:text-orange-700 data-[active=true]:border data-[active=true]:border-orange-200"
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      <span className="font-medium text-sm lg:text-base hidden lg:block">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 lg:p-4 border-t border-orange-200/50">
        <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-orange-50/50">
          <Avatar className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-orange-200 flex-shrink-0">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs lg:text-sm">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 hidden lg:block">
            <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="w-6 h-6 lg:w-8 lg:h-8 text-gray-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
          >
            <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
