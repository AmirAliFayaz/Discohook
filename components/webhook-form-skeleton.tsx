import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function WebhookFormSkeleton() {
  return (
    <Card className="backdrop-blur-sm bg-[#12121A]/80 border-[#1E1E2A] shadow-xl">
      <CardHeader className="pb-4 space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook URL field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Skeleton className="h-10 w-full" />

          {/* Message content */}
          <div className="space-y-4 pt-4 mt-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row mt-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </div>

        {/* Load from URL section */}
        <div className="pt-6 border-t border-[#1E1E2A] space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

