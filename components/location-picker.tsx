"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2, CheckCircle } from "lucide-react"
import { geocodeAddress, getCurrentLocation, type LocationData } from "@/lib/geolocation"
import { useToast } from "@/hooks/use-toast"

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void
  initialLocation?: string
  className?: string
}

export function LocationPicker({ onLocationSelect, initialLocation = "", className }: LocationPickerProps) {
  const [address, setAddress] = useState(initialLocation)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const { toast } = useToast()

  const handleGeocodeAddress = async () => {
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address",
        variant: "destructive",
      })
      return
    }

    setIsGeocoding(true)
    try {
      const location = await geocodeAddress(address)
      if (location) {
        setSelectedLocation(location)
        onLocationSelect(location)
        toast({
          title: "Location found",
          description: `Address: ${location.address}`,
        })
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different address or city name",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find location",
        variant: "destructive",
      })
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true)
    try {
      const coordinates = await getCurrentLocation()
      if (coordinates) {
        // Mock reverse geocoding - in real app, use Google Maps API
        const mockLocation: LocationData = {
          coordinates,
          address: "Current Location",
          city: "Your City",
          state: "Your State",
          country: "USA",
        }
        setSelectedLocation(mockLocation)
        onLocationSelect(mockLocation)
        setAddress("Current Location")
        toast({
          title: "Location detected",
          description: "Using your current location",
        })
      } else {
        toast({
          title: "Location access denied",
          description: "Please enter your address manually",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get current location",
        variant: "destructive",
      })
    } finally {
      setIsGettingLocation(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
        <CardDescription>Enter your location to find nearby donors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address or City</Label>
          <div className="flex gap-2">
            <Input
              id="address"
              placeholder="Enter city or address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGeocodeAddress()}
            />
            <Button onClick={handleGeocodeAddress} disabled={isGeocoding} variant="outline">
              {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <Button onClick={handleGetCurrentLocation} disabled={isGettingLocation} variant="outline" className="w-full">
          {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
          Use Current Location
        </Button>

        {selectedLocation && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Location Selected</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">{selectedLocation.address}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              Lat: {selectedLocation.coordinates.latitude.toFixed(4)}, Lng:{" "}
              {selectedLocation.coordinates.longitude.toFixed(4)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
