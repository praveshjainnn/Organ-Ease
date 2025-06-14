"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, MapPin, Clock, Shield, Zap, Activity, Search, Package, BarChart3 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleNavigation = (path: string, message?: string) => {
    if (message) {
      toast({
        title: "Navigating...",
        description: message,
      })
    }
    router.push(path)
  }

  const handleQuickAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} feature activated`,
    })

    switch (action) {
      case "Emergency Alert":
        // Simulate emergency alert
        setTimeout(() => {
          toast({
            title: "Emergency Alert Sent",
            description: "All relevant medical facilities have been notified",
            variant: "destructive",
          })
        }, 1000)
        break
      case "Find Match":
        router.push("/search")
        break
      case "Add Organ":
        router.push("/inventory")
        break
      case "Track Transport":
        router.push("/dashboard")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Save Lives with <span className="text-blue-600">OrganEase</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Advanced organ donation management platform connecting donors, recipients, and medical facilities with
            AI-powered matching and real-time logistics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleNavigation("/dashboard", "Opening your personalized dashboard")}
            >
              <Activity className="mr-2 h-5 w-5" />
              Access Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleNavigation("/search", "Opening donor search and matching system")}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Donors
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleNavigation("/inventory", "Opening inventory management system")}
            >
              <Package className="mr-2 h-5 w-5" />
              Manage Inventory
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1,250+</div>
              <div className="text-gray-600 dark:text-gray-300">Lives Saved</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Users</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MapPin className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Partner Hospitals</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">Support Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleQuickAction("Emergency Alert")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Emergency Alert</CardTitle>
                <CardDescription>Send urgent organ request to all facilities</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleQuickAction("Find Match")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Find Match</CardTitle>
                <CardDescription>AI-powered donor-recipient matching</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleQuickAction("Add Organ")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Add Organ</CardTitle>
                <CardDescription>Register new organ for donation</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleQuickAction("Track Transport")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Track Transport</CardTitle>
                <CardDescription>Real-time GPS tracking of organ transport</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-500 mb-4" />
                <CardTitle>AI-Powered Matching</CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms for optimal donor-recipient matching with 95% accuracy rate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigation("/search", "Opening AI matching system")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-blue-500 mb-4" />
                <CardTitle>Real-Time GPS Tracking</CardTitle>
                <CardDescription>
                  Live tracking of organ transport vehicles with predictive delay alerts and route optimization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigation("/dashboard", "Opening GPS tracking dashboard")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Track Vehicles
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-green-500 mb-4" />
                <CardTitle>Hospital Network</CardTitle>
                <CardDescription>
                  Integrated network of 50+ partner hospitals with capacity monitoring and logistics coordination.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigation("/search?tab=hospitals", "Opening hospital network")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Find Hospitals
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-10 w-10 text-purple-500 mb-4" />
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Complete organ inventory tracking with temperature monitoring and expiry alerts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigation("/inventory", "Opening inventory management")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Manage Inventory
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-orange-500 mb-4" />
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>
                  ML-powered delay prediction and transport optimization for improved success rates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigation("/dashboard", "Opening predictive analytics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Predictions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-red-500 mb-4" />
                <CardTitle>Emergency Protocols</CardTitle>
                <CardDescription>
                  Automated emergency response system for critical organ transport situations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => handleQuickAction("Emergency Alert")}>
                  <Heart className="mr-2 h-4 w-4" />
                  Emergency Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
                <div className="text-lg font-medium mb-2">Success Rate</div>
                <div className="text-gray-600 dark:text-gray-300">
                  Successful organ matches with our AI-powered system
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-green-600 mb-2">15min</div>
                <div className="text-lg font-medium mb-2">Average Response</div>
                <div className="text-gray-600 dark:text-gray-300">
                  Time to find compatible donors in emergency situations
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-lg font-medium mb-2">Monitoring</div>
                <div className="text-gray-600 dark:text-gray-300">
                  Continuous tracking and support for all transport missions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
