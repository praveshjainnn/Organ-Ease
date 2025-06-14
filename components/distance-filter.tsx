"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface DistanceFilterProps {
  maxDistance: number
  onDistanceChange: (distance: number) => void
  distanceCategory: string
  onDistanceCategoryChange: (category: string) => void
}

export function DistanceFilter({
  maxDistance,
  onDistanceChange,
  distanceCategory,
  onDistanceCategoryChange,
}: DistanceFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Distance Filter
        </CardTitle>
        <CardDescription>Filter donors by distance from your location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Maximum Distance: {maxDistance} miles</Label>
          <Slider
            value={[maxDistance]}
            onValueChange={(value) => onDistanceChange(value[0])}
            max={500}
            min={5}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 mi</span>
            <span>100 mi</span>
            <span>500 mi</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Quick Distance Filters</Label>
          <Select value={distanceCategory} onValueChange={onDistanceCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select distance range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Distances</SelectItem>
              <SelectItem value="within-10">Within 10 miles</SelectItem>
              <SelectItem value="within-25">Within 25 miles</SelectItem>
              <SelectItem value="within-50">Within 50 miles</SelectItem>
              <SelectItem value="within-100">Within 100 miles</SelectItem>
              <SelectItem value="over-100">Over 100 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Closer donors may be prioritized for organ compatibility and transport logistics.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
