"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Plus, User, Activity, MapPin, Navigation, Building2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { OrganDonationForm } from "@/components/organ-donation-form"
import { ProfileForm } from "@/components/profile-form"
import { LocationPicker } from "@/components/location-picker"
import { calculateDistance, formatDistance, geocodeAddress, type LocationData } from "@/lib/geolocation"
import { findHospitalsBySpecialty, type HospitalMatch } from "@/lib/hospital-network"

export function EnhancedDonorDashboard() {
  const { user } = useAuth()
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [nearbyHospitals, setNearbyHospitals] = useState<HospitalMatch[]>([])

  // Initialize user location from profile
  useEffect(() => {
    if (user?.profile?.location) {
      geocodeAddress(user.profile.location).then((location) => {
        if (location) {
          setUserLocation(location)
          // Find nearby hospitals for kidney transplants (most common)
          const hospitals = findHospitalsBySpecialty("kidney", location.coordinates, 200)
          setNearbyHospitals(hospitals.slice(0, 3))
        }
      })
    }
  }, [user])

  // Mock data for donor's organs and matches with recipient locations
  const donorOrgans = [
    {
      id: "1",
      organ: "Kidney",
      status: "Available",
      listedDate: "2024-01-15",
      matches: 3,
      potentialRecipients: [
        {
          id: "R001",
          location: "Boston",
          coordinates: { latitude: 42.3601, longitude: -71.0589 },
          urgency: "High",
          compatibility: "95%",
        },
        {
          id: "R002",
          location: "Philadelphia",
          coordinates: { latitude: 39.9526, longitude: -75.1652 },
          urgency: "Medium",
          compatibility: "88%",
        },
      ],
    },
    {
      id: "2",
      organ: "Liver",
      status: "Matched",
      listedDate: "2024-01-10",
      matches: 1,
      matchedWith: "Patient #12345",
      matchedLocation: "Newark",
      matchedCoordinates: { latitude: 40.7357, longitude: -74.1724 },
    },
  ]

  // Calculate distances to recipients
  const organsWithDistances = donorOrgans.map((organ) => {
    if (organ.potentialRecipients && userLocation) {
      const recipientsWithDistance = organ.potentialRecipients.map((recipient) => ({
        ...recipient,
        distance: calculateDistance(userLocation.coordinates, recipient.coordinates),
      }))
      return { ...organ, potentialRecipients: recipientsWithDistance }
    }

    if (organ.matchedCoordinates && userLocation) {
      const matchedDistance = calculateDistance(userLocation.coordinates, organ.matchedCoordinates)
      return { ...organ, matchedDistance }
    }

    return organ
  })

  const recentActivity = [
    {
      id: "1",
      type: "match",
      message: "New match found for your kidney donation",
      date: "2024-01-20",
      urgent: true,
      location: "Boston, MA",
      distance: userLocation
        ? calculateDistance(userLocation.coordinates, { latitude: 42.3601, longitude: -71.0589 })
        : null,
    },
    {
      id: "2",
      type: "update",
      message: 'Your liver donation status updated to "Matched"',
      date: "2024-01-18",
      urgent: false,
      location: "Newark, NJ",
      distance: userLocation
        ? calculateDistance(userLocation.coordinates, { latitude: 40.7357, longitude: -74.1724 })
        : null,
    },
  ]

  const handleLocationSelect = (location: LocationData) => {
    setUserLocation(location)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Thank you for being a life-saving donor</p>
        </div>

        {/* Location Setup */}
        {!userLocation && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <MapPin className="h-5 w-5" />
                Set Your Location
              </CardTitle>
              <CardDescription className="text-blue-800 dark:text-blue-200">
                Set your location to see distances to potential recipients and improve matching accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationPicker onLocationSelect={handleLocationSelect} initialLocation={user?.profile?.location} />
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organs Listed</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Potential recipients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lives Saved</CardTitle>
              <Heart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Successful donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Distance</CardTitle>
              <Navigation className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userLocation ? "24" : "--"}</div>
              <p className="text-xs text-muted-foreground">Miles to recipients</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="organs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="organs">My Organs</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="hospitals">Hospital Network</TabsTrigger>
            <TabsTrigger value="location">Location & Matching</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="organs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Organ Donations</h2>
              <Button onClick={() => setShowDonationForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Organ
              </Button>
            </div>

            <div className="grid gap-6">
              {organsWithDistances.map((organ) => (
                <Card key={organ.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{organ.organ}</CardTitle>
                        <CardDescription>Listed on {new Date(organ.listedDate).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge variant={organ.status === "Available" ? "default" : "secondary"}>{organ.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{organ.matches} potential matches</p>
                          {organ.matchedWith && (
                            <p className="text-sm font-medium text-green-600">Matched with: {organ.matchedWith}</p>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>

                      {/* Show potential recipients with distances */}
                      {organ.potentialRecipients && organ.potentialRecipients.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Potential Recipients</h4>
                          {organ.potentialRecipients.map((recipient) => (
                            <div
                              key={recipient.id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{recipient.id}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {recipient.location} • {recipient.urgency} Priority
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800 mb-1">{recipient.compatibility}</Badge>
                                {userLocation && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Navigation className="h-3 w-3" />
                                    {formatDistance(recipient.distance)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show matched recipient distance */}
                      {organ.matchedWith && organ.matchedDistance && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-200">Matched Recipient</p>
                              <p className="text-sm text-green-700 dark:text-green-300">{organ.matchedLocation}</p>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Navigation className="h-3 w-3" />
                              {formatDistance(organ.matchedDistance)}
                            </Badge>
                          </div>
                        </div>
                      )}
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
                        {activity.type === "match" ? <Heart className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.message}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                          {activity.location && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {activity.location}
                            </p>
                          )}
                          {activity.distance && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Navigation className="h-3 w-3" />
                              {formatDistance(activity.distance)}
                            </p>
                          )}
                        </div>
                      </div>
                      {activity.urgent && <Badge variant="destructive">Urgent</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-6">
            <h2 className="text-2xl font-bold">Nearby Transplant Centers</h2>

            {nearbyHospitals.length > 0 ? (
              <div className="grid gap-4">
                {nearbyHospitals.map((hospitalMatch) => (
                  <Card key={hospitalMatch.hospital.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{hospitalMatch.hospital.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {hospitalMatch.hospital.city}, {hospitalMatch.hospital.state}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{hospitalMatch.distance.toFixed(1)} mi</Badge>
                          <Badge variant={hospitalMatch.hospital.level === "Level I" ? "default" : "secondary"}>
                            {hospitalMatch.hospital.level}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Specialties</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {hospitalMatch.hospital.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Success Rate</label>
                          <p className="font-semibold text-green-600">{hospitalMatch.successRate}%</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contact</label>
                          <p className="text-sm">{hospitalMatch.hospital.contactInfo.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Hospitals Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Set your location to find nearby transplant centers
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <h2 className="text-2xl font-bold">Location & Matching</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={userLocation?.address || user?.profile?.location}
              />

              {userLocation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Matching Radius</CardTitle>
                    <CardDescription>Recipients within different distance ranges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <p className="font-medium">Within 25 miles</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Highest priority matches</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">2 recipients</Badge>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div>
                          <p className="font-medium">25-50 miles</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Good matches</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">1 recipient</Badge>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <p className="font-medium">50+ miles</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Extended matches</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">1 recipient</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user?.profile?.location}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-gray-600 dark:text-gray-400">{user?.profile?.phone}</p>
                  </div>
                  {userLocation && (
                    <div>
                      <label className="text-sm font-medium">Coordinates</label>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {userLocation.coordinates.latitude.toFixed(4)}, {userLocation.coordinates.longitude.toFixed(4)}
                      </p>
                    </div>
                  )}
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

      {showDonationForm && <OrganDonationForm onClose={() => setShowDonationForm(false)} />}

      {showProfileForm && <ProfileForm onClose={() => setShowProfileForm(false)} />}
    </div>
  )
}
