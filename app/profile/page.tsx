"use client"

import { useState } from "react"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Bell, Shield, HelpCircle, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user } = useFirebaseAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      })

      if (response.ok) {
        setIsEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setUsername(user?.username || "")
    setEmail(user?.email || "")
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-orange-200/50 p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {/* Profile Information */}
          <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  My Account
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-orange-200 hover:bg-orange-50"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} className="border-gray-200 hover:bg-gray-50">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-4 border-orange-200">
                  <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.displayName || "User"} />
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-xl">
                    {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{user?.displayName || user?.email || "User"}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Member since {new Date(user?.metadata?.creationTime || "").toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!isEditing}
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 disabled:bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">FREE Plan</p>
                  <p className="text-sm text-green-600">Access to basic features</p>
                </div>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={() => (window.location.href = "/subscription")}
                >
                  Subscribe Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-500">Receive email notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-orange-200 hover:bg-orange-50"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature will be available soon!",
                    })
                  }}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  About Us
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-orange-200 hover:bg-orange-50"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature will be available soon!",
                    })
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Terms and Conditions
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={async () => {
                    try {
                      await signOut(auth)
                      toast({
                        title: "Signed out",
                        description: "You have been successfully signed out.",
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to sign out.",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
