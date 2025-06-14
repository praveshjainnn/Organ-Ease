"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Clock, Plane, Car, BirdIcon as Helicopter, Phone, MapPin } from "lucide-react"
import {
  findHospitalsBySpecialty,
  formatTransportTime,
  formatCost,
  type OrganSpecialty,
  type HospitalMatch,
  type LocationData,
} from "@/lib/hospital-network"

interface HospitalFinderProps {
  userLocation: LocationData | null
  selectedOrgan: OrganSpecialty
  onHospitalSelect?: (hospital: HospitalMatch) => void
}

export function HospitalFinder({ userLocation, selectedOrgan, onHospitalSelect }: HospitalFinderProps) {
  const [hospitals, setHospitals] = useState<HospitalMatch[]>([])
  const [maxDistance, setMaxDistance] = useState("200")
  const [selectedHospital, setSelectedHospital] = useState<HospitalMatch | null>(null)

  useEffect(() => {
    if (userLocation && selectedOrgan) {
      const hospitalMatches = findHospitalsBySpecialty(
        selectedOrgan,
        userLocation.coordinates,
        Number.parseInt(maxDistance),
      )
      setHospitals(hospitalMatches)
    }
  }, [userLocation, selectedOrgan, maxDistance])

  const handleHospitalSelect = (hospital: HospitalMatch) => {
    setSelectedHospital(hospital)
    onHospitalSelect?.(hospital)
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "ground":
        return <Car className="h-4 w-4" />
      case "helicopter":
        return <Helicopter className="h-4 w-4" />
      case "fixed-wing":
        return <Plane className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  if (!userLocation) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Set Your Location</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please set your location to find nearby transplant hospitals
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Hospital Network
          </CardTitle>
          <CardDescription>Find transplant centers for {selectedOrgan} procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Maximum Distance</label>
              <Select value={maxDistance} onValueChange={setMaxDistance}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 miles</SelectItem>
                  <SelectItem value="100">100 miles</SelectItem>
                  <SelectItem value="200">200 miles</SelectItem>
                  <SelectItem value="500">500 miles</SelectItem>
                  <SelectItem value="1000">1000 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline">{hospitals.length} hospitals found</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Hospital List */}
      <div className="grid gap-6">
        {hospitals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Hospitals Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try increasing the search distance or check if the organ type is available
              </p>
            </CardContent>
          </Card>
        ) : (
          hospitals.map((hospitalMatch) => (
            <Card
              key={hospitalMatch.hospital.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedHospital?.hospital.id === hospitalMatch.hospital.id
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : ""
              }`}
              onClick={() => handleHospitalSelect(hospitalMatch)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{hospitalMatch.hospital.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {hospitalMatch.hospital.address}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={hospitalMatch.hospital.level === "Level I" ? "default" : "secondary"}>
                      {hospitalMatch.hospital.level}
                    </Badge>
                    <Badge variant="outline">{hospitalMatch.distance.toFixed(1)} mi</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Annual Capacity</label>
                        <p className="font-semibold">{hospitalMatch.capacity} procedures</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Avg Wait Time</label>
                        <p className="font-semibold">{hospitalMatch.waitTime} days</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Success Rate</label>
                        <p className="font-semibold text-green-600">{hospitalMatch.successRate}%</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Facilities</label>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {hospitalMatch.hospital.icuBeds} ICU beds
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {hospitalMatch.hospital.operatingRooms} ORs
                          </Badge>
                          {hospitalMatch.hospital.helipadAvailable && (
                            <Badge variant="outline" className="text-xs">
                              Helipad
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Specialties</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hospitalMatch.hospital.specialties.map((specialty) => (
                            <Badge
                              key={specialty}
                              variant={specialty === selectedOrgan ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="transport" className="space-y-4">
                    <div className="space-y-3">
                      {hospitalMatch.transportPlans.map((plan, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            plan.feasible
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTransportIcon(plan.option.type)}
                              <span className="font-medium capitalize">{plan.option.type}</span>
                              {!plan.feasible && <Badge variant="destructive">Not Feasible</Badge>}
                            </div>
                            <Badge variant="outline">{formatCost(plan.estimatedCost)}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <label className="text-gray-500">Time</label>
                              <p className="font-medium flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTransportTime(plan.estimatedTime)}
                              </p>
                            </div>
                            <div>
                              <label className="text-gray-500">Viability</label>
                              <p
                                className={`font-medium ${
                                  plan.viabilityWindow > 2 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {plan.viabilityWindow}h left
                              </p>
                            </div>
                            <div>
                              <label className="text-gray-500">Distance</label>
                              <p className="font-medium">{plan.route.distance.toFixed(1)} mi</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">General</label>
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {hospitalMatch.hospital.contactInfo.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Emergency</label>
                        <p className="font-medium flex items-center gap-2 text-red-600">
                          <Phone className="h-4 w-4" />
                          {hospitalMatch.hospital.contactInfo.emergencyPhone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Transplant Coordinator</label>
                      <p className="font-medium">{hospitalMatch.hospital.contactInfo.transplantCoordinator}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Contact Hospital
                      </Button>
                      <Button size="sm" variant="outline">
                        Get Directions
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
