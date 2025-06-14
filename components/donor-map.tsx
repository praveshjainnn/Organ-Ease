"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Heart, Navigation } from "lucide-react"
import { calculateDistance, formatDistance, type Coordinates, type LocationData } from "@/lib/geolocation"

interface Donor {
  id: string
  donorId: string
  organ: string
  bloodGroup: string
  location: string
  coordinates: Coordinates
  availability: string
  compatibility: string
  age: number
  medicalStatus: string
}

interface DonorMapProps {
  donors: Donor[]
  userLocation: LocationData | null
  onDonorSelect: (donor: Donor) => void
  selectedDonor?: Donor | null
}

export function DonorMap({ donors, userLocation, onDonorSelect, selectedDonor }: DonorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  // Calculate distances and sort donors
  const donorsWithDistance = donors
    .map((donor) => ({
      ...donor,
      distance: userLocation ? calculateDistance(userLocation.coordinates, donor.coordinates) : 0,
    }))
    .sort((a, b) => a.distance - b.distance)

  // Simple map visualization using CSS and positioning
  const renderSimpleMap = () => {
    if (!userLocation) {
      return (
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Set your location to view map</p>
          </div>
        </div>
      )
    }

    return (
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg overflow-hidden">
        {/* User location marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
            <Navigation className="h-4 w-4" />
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
            You
          </div>
        </div>

        {/* Donor markers */}
        {donorsWithDistance.slice(0, 8).map((donor, index) => {
          // Simple positioning based on distance and angle
          const angle = index * 45 * (Math.PI / 180) // Distribute around circle
          const radius = Math.min(donor.distance * 2, 80) // Scale distance to pixels
          const x = 50 + radius * Math.cos(angle) // Center + offset
          const y = 50 + radius * Math.sin(angle)

          return (
            <div
              key={donor.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                selectedDonor?.id === donor.id ? "z-20 scale-110" : "z-10"
              }`}
              style={{
                left: `${Math.max(10, Math.min(90, x))}%`,
                top: `${Math.max(10, Math.min(90, y))}%`,
              }}
              onClick={() => onDonorSelect(donor)}
            >
              <div
                className={`p-2 rounded-full shadow-lg ${
                  selectedDonor?.id === donor.id
                    ? "bg-red-600 text-white ring-4 ring-red-200"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                <Heart className="h-3 w-3" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white dark:bg-gray-800 px-2 py-1 rounded shadow whitespace-nowrap">
                {donor.donorId}
                <br />
                <span className="text-gray-500">{formatDistance(donor.distance)}</span>
              </div>
            </div>
          )
        })}

        {/* Distance circles */}
        <div className="absolute inset-0 pointer-events-none">
          {[25, 50, 100].map((distance) => (
            <div
              key={distance}
              className="absolute border border-gray-300 dark:border-gray-600 rounded-full opacity-30"
              style={{
                width: `${Math.min(distance * 2, 160)}px`,
                height: `${Math.min(distance * 2, 160)}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Donor Locations
        </CardTitle>
        <CardDescription>
          {userLocation
            ? `Showing ${donorsWithDistance.length} donors near ${userLocation.city}`
            : "Set your location to view nearby donors"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderSimpleMap()}

        {/* Donor list with distances */}
        {userLocation && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-sm">Nearby Donors</h4>
            {donorsWithDistance.slice(0, 5).map((donor) => (
              <div
                key={donor.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDonor?.id === donor.id
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => onDonorSelect(donor)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{donor.donorId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {donor.organ} • {donor.bloodGroup}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {formatDistance(donor.distance)}
                  </Badge>
                  <p className="text-xs text-gray-500">{donor.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!userLocation && (
          <div className="text-center py-4">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">
              Enable location access to see donors on the map and get distance information
            </p>
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Set Location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
