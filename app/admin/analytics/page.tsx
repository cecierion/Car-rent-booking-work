import { AnalyticsContent } from "@/components/admin/analytics/analytics-content"
import { AuthGuard } from "@/components/auth-guard"

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AnalyticsContent />
    </AuthGuard>
  )
}
