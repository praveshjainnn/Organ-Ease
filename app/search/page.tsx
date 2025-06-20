"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Heart, Filter, Navigation } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { LocationPicker } from "@/components/location-picker"
import { DistanceFilter } from "@/components/distance-filter"
import { DonorMap } from "@/components/donor-map"
import { calculateDistance, formatDistance, type LocationData } from "@/lib/geolocation"
import { HospitalFinder } from "@/components/hospital-finder"
import { TransportLogistics } from "@/components/transport-logistics"
import type { OrganSpecialty, HospitalMatch } from "@/lib/hospital-network"

export default function SearchPage() {
  const [filters, setFilters] = useState({
    organ: "all",
    bloodGroup: "all",
    location: "",
    availability: "all",
    maxDistance: 50,
    distanceCategory: "all",
  })

  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [selectedDonor, setSelectedDonor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<HospitalMatch | null>(null)
  const [showTransportLogistics, setShowTransportLogistics] = useState(false)

  // Enhanced mock data with coordinates
  const donors = [
    {
      id: "1",
      donorId: "D001",
      organ: "Kidney",
      bloodGroup: "O+",
      location: "New York",
      coordinates: { latitude: 40.7128, longitude: -74.006 },
      availability: "Immediate",
      compatibility: "95%",
      distance: 0,
      age: 28,
      medicalStatus: "Excellent",
    },
    {
      id: "2",
      donorId: "D002",
      organ: "Liver",
      bloodGroup: "A+",
      location: "Los Angeles",
      coordinates: { latitude: 34.0522, longitude: -118.2437 },
      availability: "Within 1 Month",
      compatibility: "88%",
      distance: 0,
      age: 35,
      medicalStatus: "Good",
    },
    {
      id: "3",
      donorId: "D003",
      organ: "Kidney",
      bloodGroup: "B+",
      location: "Chicago",
      coordinates: { latitude: 41.8781, longitude: -87.6298 },
      availability: "Within 3 Months",
      compatibility: "92%",
      distance: 0,
      age: 31,
      medicalStatus: "Excellent",
    },
    {
      id: "4",
      donorId: "D004",
      organ: "Heart",
      bloodGroup: "AB+",
      location: "Houston",
      coordinates: { latitude: 29.7604, longitude: -95.3698 },
      availability: "Immediate",
      compatibility: "85%",
      distance: 0,
      age: 29,
      medicalStatus: "Good",
    },
    {
      id: "5",
      donorId: "D005",
      organ: "Kidney",
      bloodGroup: "O-",
      location: "Phoenix",
      coordinates: { latitude: 33.4484, longitude: -112.074 },
      availability: "Within 1 Month",
      compatibility: "90%",
      distance: 0,
      age: 33,
      medicalStatus: "Excellent",
    },
    {
      id: "6",
      donorId: "D006",
      organ: "Liver",
      bloodGroup: "A-",
      location: "Philadelphia",
      coordinates: { latitude: 39.9526, longitude: -75.1652 },
      availability: "Immediate",
      compatibility: "87%",
      distance: 0,
      age: 27,
      medicalStatus: "Good",
    },
    {
      id: "7",
      donorId: "D007",
      organ: "Heart",
      bloodGroup: "B-",
      location: "San Antonio",
      coordinates: { latitude: 29.4241, longitude: -98.4936 },
      availability: "Within 3 Months",
      compatibility: "91%",
      distance: 0,
      age: 30,
      medicalStatus: "Excellent",
    },
    {
      id: "8",
      donorId: "D008",
      organ: "Kidney",
      bloodGroup: "AB-",
      location: "San Diego",
      coordinates: { latitude: 32.7157, longitude: -117.1611 },
      availability: "Within 1 Month",
      compatibility: "89%",
      distance: 0,
      age: 26,
      medicalStatus: "Good",
    },
  ]

  const [filteredDonors, setFilteredDonors] = useState(donors)

  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation) {
      const donorsWithDistance = donors.map((donor) => ({
        ...donor,
        distance: calculateDistance(userLocation.coordinates, donor.coordinates),
      }))
      applyFilters(donorsWithDistance)
    } else {
      applyFilters(donors)
    }
  }, [userLocation, filters])

  const applyFilters = (donorList: any[]) => {
    let filtered = donorList

    // Apply basic filters
    if (filters.organ !== "all") {
      filtered = filtered.filter((donor) => donor.organ.toLowerCase().includes(filters.organ.toLowerCase()))
    }

    if (filters.bloodGroup !== "all") {
      filtered = filtered.filter((donor) => donor.bloodGroup === filters.bloodGroup)
    }

    if (filters.location) {
      filtered = filtered.filter((donor) => donor.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.availability !== "all") {
      filtered = filtered.filter((donor) => donor.availability === filters.availability)
    }

    // Apply distance filters
    if (userLocation) {
      filtered = filtered.filter((donor) => donor.distance <= filters.maxDistance)

      if (filters.distanceCategory !== "all") {
        switch (filters.distanceCategory) {
          case "within-10":
            filtered = filtered.filter((donor) => donor.distance <= 10)
            break
          case "within-25":
            filtered = filtered.filter((donor) => donor.distance <= 25)
            break
          case "within-50":
            filtered = filtered.filter((donor) => donor.distance <= 50)
            break
          case "within-100":
            filtered = filtered.filter((donor) => donor.distance <= 100)
            break
          case "over-100":
            filtered = filtered.filter((donor) => donor.distance > 100)
            break
        }
      }

      // Sort by distance
      filtered.sort((a, b) => a.distance - b.distance)
    }

    setFilteredDonors(filtered)
  }

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      organ: "all",
      bloodGroup: "all",
      location: "",
      availability: "all",
      maxDistance: 50,
      distanceCategory: "all",
    })
  }

  const handleLocationSelect = async (location: LocationData) => {
    setUserLocation(location)
  }

  const handleDonorSelect = (donor: any) => {
    setSelectedDonor(donor)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Organ Donors</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for compatible organ donors with distance-based matching
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Picker */}
            <LocationPicker onLocationSelect={handleLocationSelect} />

            {/* Distance Filter */}
            {userLocation && (
              <DistanceFilter
                maxDistance={filters.maxDistance}
                onDistanceChange={(distance) => handleFilterChange("maxDistance", distance)}
                distanceCategory={filters.distanceCategory}
                onDistanceCategoryChange={(category) => handleFilterChange("distanceCategory", category)}
              />
            )}

            {/* Basic Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organ">Organ Type</Label>
                  <Select value={filters.organ} onValueChange={(value) => handleFilterChange("organ", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Organs</SelectItem>
                      <SelectItem value="kidney">Kidney</SelectItem>
                      <SelectItem value="liver">Liver</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="lungs">Lungs</SelectItem>
                      <SelectItem value="pancreas">Pancreas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={filters.bloodGroup} onValueChange={(value) => handleFilterChange("bloodGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blood Groups</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={filters.availability}
                    onValueChange={(value) => handleFilterChange("availability", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Availability</SelectItem>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="Within 1 Month">Within 1 Month</SelectItem>
                      <SelectItem value="Within 3 Months">Within 3 Months</SelectItem>
                      <SelectItem value="Within 6 Months">Within 6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={clearFilters} variant="outline" size="sm" className="flex-1">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="list" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                  <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                  <TabsTrigger value="logistics">Transport</TabsTrigger>
                </TabsList>
                <Badge variant="secondary">{filteredDonors.length} donors found</Badge>
              </div>

              <TabsContent value="list" className="space-y-6">
                {/* Search Results */}
                <div className="grid gap-6">
                  {filteredDonors.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No donors found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Try adjusting your search filters or increasing the distance range
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredDonors.map((donor) => (
                      <Card key={donor.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                {donor.organ} Donor
                              </CardTitle>
                              <CardDescription>Donor ID: {donor.donorId}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge className="bg-green-100 text-green-800">{donor.compatibility} Compatible</Badge>
                              <Badge variant={donor.availability === "Immediate" ? "default" : "secondary"}>
                                {donor.availability}
                              </Badge>
                              {userLocation && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Navigation className="h-3 w-3" />
                                  {formatDistance(donor.distance)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Blood Group</label>
                              <p className="font-semibold">{donor.bloodGroup}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Location</label>
                              <p className="font-semibold flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {donor.location}
                              </p>
                            </div>
                            {userLocation && (
                              <div>
                                <label className="text-sm font-medium text-gray-500">Distance</label>
                                <p className="font-semibold">{formatDistance(donor.distance)}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium text-gray-500">Age</label>
                              <p className="font-semibold">{donor.age} years</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-500">Medical Status</label>
                            <p className="font-semibold text-green-600">{donor.medicalStatus}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1">Contact Donor</Button>
                            <Button variant="outline">View Full Profile</Button>
                            <Button variant="outline">Save</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="map" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Map */}
                  <DonorMap
                    donors={filteredDonors}
                    userLocation={userLocation}
                    onDonorSelect={handleDonorSelect}
                    selectedDonor={selectedDonor}
                  />

                  {/* Selected Donor Details */}
                  {selectedDonor ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          Selected Donor
                        </CardTitle>
                        <CardDescription>Donor ID: {selectedDonor.donorId}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Organ</label>
                              <p className="font-semibold">{selectedDonor.organ}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Blood Group</label>
                              <p className="font-semibold">{selectedDonor.bloodGroup}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Location</label>
                              <p className="font-semibold">{selectedDonor.location}</p>
                            </div>
                            {userLocation && (
                              <div>
                                <label className="text-sm font-medium text-gray-500">Distance</label>
                                <p className="font-semibold">{formatDistance(selectedDonor.distance)}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Badge className="bg-green-100 text-green-800">
                              {selectedDonor.compatibility} Compatible
                            </Badge>
                            <Badge variant={selectedDonor.availability === "Immediate" ? "default" : "secondary"}>
                              {selectedDonor.availability}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <Button className="w-full">Contact Donor</Button>
                            <Button variant="outline" className="w-full">
                              View Full Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Donor</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Click on a donor marker on the map to view their details
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="hospitals" className="space-y-6">
                <HospitalFinder
                  userLocation={userLocation}
                  selectedOrgan={(filters.organ as OrganSpecialty) || "kidney"}
                  onHospitalSelect={setSelectedHospital}
                />
              </TabsContent>

              <TabsContent value="logistics" className="space-y-6">
                <TransportLogistics
                  organ={(filters.organ as OrganSpecialty) || "kidney"}
                  donorLocation={userLocation?.city || "Unknown"}
                  recipientHospital={selectedHospital}
                  transportPlans={selectedHospital?.transportPlans || []}
                  urgency="urgent"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
