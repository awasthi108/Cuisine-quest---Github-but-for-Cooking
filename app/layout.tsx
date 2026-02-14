import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { FirebaseAuthProvider } from "@/components/firebase-auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cuisine Quest - Collaborative Recipe Platform",
  description: "A collaborative recipe platform like GitHub but for cooking",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseAuthProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 overflow-hidden">{children}</main>
            </div>
            <Toaster />
          </SidebarProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}
