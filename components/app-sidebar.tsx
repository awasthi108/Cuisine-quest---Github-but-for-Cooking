"use client"

import { Home, ChefHat, Sparkles, Heart, BookOpen, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
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
import { useToast } from "@/hooks/use-toast"

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
    title: "Food Blogs",
    url: "/blogs",
    icon: BookOpen,
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
    icon: Heart,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useFirebaseAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogoClick = () => {
    router.push("/")
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
      router.push("/auth/signin")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Don't render sidebar if user is not authenticated or on auth pages
  if (!user || pathname.startsWith("/auth")) {
    return null
  }

  const userDisplayName = user.displayName || user.email || "User"
  const userInitial = userDisplayName.charAt(0).toUpperCase()

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-4 lg:p-6 border-b border-slate-200">
        <div
          className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:opacity-75"
          onClick={handleLogoClick}
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 transition-colors duration-300">
            <ChefHat className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg lg:text-xl font-bold text-slate-900">
              Cuisine Quest
            </h1>
            <p className="text-xs lg:text-sm text-slate-500">
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
                    className="w-full justify-start gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-slate-100 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border data-[active=true]:border-emerald-200"
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

      <SidebarFooter className="p-2 lg:p-4 border-t border-slate-200">
        <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-slate-50">
          <Avatar className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-slate-200 flex-shrink-0">
            <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={userDisplayName} />
            <AvatarFallback className="bg-slate-100 text-slate-700 text-xs lg:text-sm">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 hidden lg:block">
            <p className="text-sm font-medium text-slate-900 truncate">{userDisplayName}</p>
            <p className="text-xs text-slate-600 truncate">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-6 h-6 lg:w-8 lg:h-8 text-slate-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
          >
            <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
