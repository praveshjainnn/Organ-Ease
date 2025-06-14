"use client"

import { useAuth } from "@/components/auth-provider"
import DonorDashboard from "@/components/donor-dashboard"
import { RecipientDashboard } from "@/components/recipient-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return <div>Loading...</div>
  }

  switch (user.role) {
    case "donor":
      return <DonorDashboard />
    case "recipient":
      return <RecipientDashboard />
    case "admin":
      return <AdminDashboard />
    default:
      return <div>Invalid user role</div>
  }
}
