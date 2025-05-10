import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}
