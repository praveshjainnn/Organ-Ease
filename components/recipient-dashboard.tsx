"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Plus, User, Bell, Search, Clock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { OrganRequestForm } from "@/components/organ-request-form"
import { ProfileForm } from "@/components/profile-form"

export function RecipientDashboard() {
  const { user } = useAuth()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)

  // Mock data for recipient's requests and matches
  const organRequests = [
    {
      id: "1",
      organ: "Kidney",
      urgency: "High",
      requestDate: "2024-01-10",
      status: "Active",
      matches: 2,
    },
    {
      id: "2",
      organ: "Heart",
      urgency: "Critical",
      requestDate: "2024-01-05",
      status: "Waiting",
      matches: 0,
    },
  ]

  const potentialMatches = [
    {
      id: "1",
      organ: "Kidney",
      donorId: "D001",
      bloodGroup: "O+",
      location: "New York",
      compatibility: "95%",
      distance: "5 miles",
    },
    {
      id: "2",
      organ: "Kidney",
      donorId: "D002",
      bloodGroup: "O+",
      location: "Brooklyn",
      compatibility: "88%",
      distance: "12 miles",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "match",
      message: "New potential kidney donor found in your area",
      date: "2024-01-20",
      urgent: true,
    },
    {
      id: "2",
      type: "update",
      message: "Your kidney request status updated",
      date: "2024-01-18",
      urgent: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">We're working to find the perfect match for you</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Organ requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Matches</CardTitle>
              <Search className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Compatible donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Days waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">New alerts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="matches">Potential Matches</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Organ Requests</h2>
              <Button onClick={() => setShowRequestForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            <div className="grid gap-6">
              {organRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{request.organ}</CardTitle>
                        <CardDescription>
                          Requested on {new Date(request.requestDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            request.urgency === "Critical"
                              ? "destructive"
                              : request.urgency === "High"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {request.urgency} Priority
                        </Badge>
                        <Badge variant="outline">{request.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {request.matches} potential matches found
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <h2 className="text-2xl font-bold">Potential Matches</h2>

            <div className="grid gap-6">
              {potentialMatches.map((match) => (
                <Card key={match.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{match.organ} Donor</CardTitle>
                        <CardDescription>Donor ID: {match.donorId}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{match.compatibility} Compatible</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium">Blood Group</label>
                        <p className="text-gray-600 dark:text-gray-400">{match.bloodGroup}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <p className="text-gray-600 dark:text-gray-400">{match.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Distance</label>
                        <p className="text-gray-600 dark:text-gray-400">{match.distance}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Contact Donor</Button>
                      <Button variant="outline" size="sm">
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          activity.urgent ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {activity.type === "match" ? <Heart className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.message}</p>
                        <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                      {activity.urgent && <Badge variant="destructive">Urgent</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              <Button onClick={() => setShowProfileForm(true)}>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-gray-600 dark:text-gray-400">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Blood Group</label>
                    <p className="text-gray-600 dark:text-gray-400">{user?.profile?.bloodGroup}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-gray-600 dark:text-gray-400">{user?.profile?.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-gray-600 dark:text-gray-400">{user?.profile?.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Medical History</label>
                  <p className="text-gray-600 dark:text-gray-400">{user?.profile?.medicalHistory}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showRequestForm && <OrganRequestForm onClose={() => setShowRequestForm(false)} />}

      {showProfileForm && <ProfileForm onClose={() => setShowProfileForm(false)} />}
    </div>
  )
}
