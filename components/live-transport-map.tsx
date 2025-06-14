"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Truck, Plane, AlertTriangle, Route, Zap, Target } from "lucide-react"
import {
  GPSTrackingService,
  type TransportMission,
  formatSpeed,
  formatHeading,
  formatETA,
  getStatusColor,
} from "@/lib/gps-tracking"

interface LiveTransportMapProps {
  missions: TransportMission[]
  selectedMission?: TransportMission | null
  onMissionSelect: (mission: TransportMission) => void
}

export function LiveTransportMap({ missions, selectedMission, onMissionSelect }: LiveTransportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [trackingService] = useState(() => GPSTrackingService.getInstance())
  const [mapCenter, setMapCenter] = useState({ latitude: 39.8283, longitude: -98.5795 }) // Center of US

  const getVehicleIcon = (type: string, isSelected = false) => {
    const iconClass = `h-4 w-4 ${isSelected ? "text-white" : "text-current"}`
    switch (type) {
      case "helicopter":
      case "aircraft":
        return <Plane className={iconClass} />
      default:
        return <Truck className={iconClass} />
    }
  }

  const getVehicleColor = (mission: TransportMission, isSelected = false) => {
    if (isSelected) return "bg-blue-600 text-white ring-4 ring-blue-200"

    switch (mission.priority) {
      case "critical":
        return "bg-red-500 text-white hover:bg-red-600"
      case "high":
        return "bg-orange-500 text-white hover:bg-orange-600"
      case "urgent":
        return "bg-yellow-500 text-white hover:bg-yellow-600"
      default:
        return "bg-blue-500 text-white hover:bg-blue-600"
    }
  }

  const renderSimpleMap = () => {
    return (
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 rounded-lg overflow-hidden border">
        {/* Map Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Mission Markers */}
        {missions.map((mission, index) => {
          if (!mission.currentLocation) return null

          const vehicle = trackingService.getVehicle(mission.vehicleId)
          const isSelected = selectedMission?.id === mission.id

          // Simple positioning based on mission index and some randomization
          const x = 20 + ((index * 15) % 60)
          const y = 20 + ((index * 12) % 60)

          return (
            <div key={mission.id} className="absolute">
              {/* Vehicle Marker */}
              <div
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                  isSelected ? "z-20 scale-110" : "z-10"
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                onClick={() => onMissionSelect(mission)}
              >
                <div className={`p-3 rounded-full shadow-lg ${getVehicleColor(mission, isSelected)}`}>
                  {getVehicleIcon(vehicle?.type || "ambulance", isSelected)}
                </div>

                {/* Vehicle Info Popup */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border whitespace-nowrap">
                  <div className="text-xs font-medium">{vehicle?.callSign}</div>
                  <div className="text-xs text-gray-500 capitalize">{mission.organType}</div>
                  {mission.currentLocation && (
                    <div className="text-xs text-gray-500">
                      {formatSpeed(mission.currentLocation.speed)} • {formatHeading(mission.currentLocation.heading)}
                    </div>
                  )}
                </div>
              </div>

              {/* Route Line (simplified) */}
              {isSelected && (
                <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
                  <path
                    d={`M ${x}% ${y}% Q ${x + 10}% ${y - 10}% ${Math.min(x + 20, 80)}% ${Math.max(y - 5, 20)}%`}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                </svg>
              )}

              {/* Alerts Indicator */}
              {mission.alerts.filter((a) => !a.resolved).length > 0 && (
                <div
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  !
                </div>
              )}
            </div>
          )
        })}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <h4 className="text-sm font-medium mb-2">Priority Levels</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>High</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Urgent</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Routine</span>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="outline" className="bg-white/90">
            <Target className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white/90">
            <Route className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white/90">
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Transport Map
            </CardTitle>
            <CardDescription>Real-time vehicle tracking • {missions.length} active missions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{missions.filter((m) => m.priority === "critical").length} Critical</Badge>
            <Badge variant="outline">{missions.filter((m) => m.alerts.some((a) => !a.resolved)).length} Alerts</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderSimpleMap()}

        {/* Selected Mission Details */}
        {selectedMission && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{trackingService.getVehicle(selectedMission.vehicleId)?.callSign}</span>
                <Badge className="capitalize">{selectedMission.priority}</Badge>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Status</label>
                <p className={`text-sm font-medium ${getStatusColor(selectedMission.status)}`}>
                  {selectedMission.status.replace("-", " ")}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Progress</label>
                <p className="text-sm font-medium">{Math.round(selectedMission.routeProgress)}%</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">ETA</label>
                <p className="text-sm font-medium">{formatETA(selectedMission.estimatedDelivery)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Organ</label>
                <p className="text-sm font-medium capitalize">{selectedMission.organType}</p>
              </div>
            </div>

            {selectedMission.currentLocation && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Speed: </span>
                    <span className="font-medium">{formatSpeed(selectedMission.currentLocation.speed)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Heading: </span>
                    <span className="font-medium">{formatHeading(selectedMission.currentLocation.heading)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Update: </span>
                    <span className="font-medium">
                      {new Date(selectedMission.currentLocation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Alerts */}
            {selectedMission.alerts.filter((a) => !a.resolved).length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Active Alerts</span>
                </div>
                <div className="space-y-1">
                  {selectedMission.alerts
                    .filter((a) => !a.resolved)
                    .slice(0, 2)
                    .map((alert) => (
                      <div key={alert.id} className="text-xs text-gray-600">
                        • {alert.message}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {missions.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Missions</h3>
            <p className="text-gray-600 dark:text-gray-400">All transport missions completed</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
