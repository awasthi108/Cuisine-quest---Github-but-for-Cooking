import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ForgotPasswordLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative z-10 border-orange-200/50 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
              <div className="w-8 h-8 bg-white/30 rounded animate-pulse" />
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-56 mx-auto mb-2" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-12 w-full" />
            </div>

            <Skeleton className="h-12 w-full" />
          </div>

          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
