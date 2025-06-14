"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Phone,
  MessageSquare,
  Truck,
  Plane,
  Activity,
  Signal,
  Timer,
} from "lucide-react"
import {
  GPSTrackingService,
  type TransportMission,
  formatSpeed,
  formatHeading,
  formatETA,
  getAlertColor,
  getStatusColor,
} from "@/lib/gps-tracking"

export function GPSTrackingDashboard() {
  const [missions, setMissions] = useState<TransportMission[]>([])
  const [selectedMission, setSelectedMission] = useState<TransportMission | null>(null)
  const [trackingService] = useState(() => GPSTrackingService.getInstance())

  useEffect(() => {
    // Load initial missions
    setMissions(trackingService.getActiveMissions())

    // Subscribe to updates for all missions
    const unsubscribers: (() => void)[] = []

    trackingService.getActiveMissions().forEach((mission) => {
      const unsubscribe = trackingService.subscribe(mission.id, (updatedMission) => {
        setMissions((prev) => prev.map((m) => (m.id === updatedMission.id ? updatedMission : m)))

        if (selectedMission?.id === updatedMission.id) {
          setSelectedMission(updatedMission)
        }
      })
      unsubscribers.push(unsubscribe)
    })

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [trackingService, selectedMission?.id])

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "helicopter":
        return <Plane className="h-5 w-5" />
      case "aircraft":
        return <Plane className="h-5 w-5" />
      default:
        return <Truck className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "urgent":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const activeAlerts = missions.reduce(
    (total, mission) => total + mission.alerts.filter((alert) => !alert.resolved).length,
    0,
  )

  const criticalMissions = missions.filter((mission) => mission.priority === "critical").length

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Transports</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missions.length}</div>
            <p className="text-xs text-muted-foreground">
              {missions.filter((m) => m.status.includes("en-route")).length} en route
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Missions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalMissions}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Signal className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Unresolved issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ETA</CardTitle>
            <Timer className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {missions.length > 0
                ? Math.round(
                    missions.reduce((sum, m) => sum + (m.estimatedDelivery - Date.now()) / 60000, 0) / missions.length,
                  )
                : 0}
              m
            </div>
            <p className="text-xs text-muted-foreground">To delivery</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mission List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Active Missions
              </CardTitle>
              <CardDescription>Real-time transport tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missions.map((mission) => {
                const vehicle = trackingService.getVehicle(mission.vehicleId)
                const unresolvedAlerts = mission.alerts.filter((alert) => !alert.resolved).length

                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedMission?.id === mission.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedMission(mission)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(vehicle?.type || "ambulance")}
                        <span className="font-medium">{vehicle?.callSign}</span>
                      </div>
                      <div className="flex gap-1">
                        <Badge className={getPriorityColor(mission.priority)}>{mission.priority}</Badge>
                        {unresolvedAlerts > 0 && <Badge variant="destructive">{unresolvedAlerts}</Badge>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="capitalize">{mission.organType}</span>
                        <span className="text-gray-500">•</span>
                        <span className={getStatusColor(mission.status)}>{mission.status.replace("-", " ")}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(mission.routeProgress)}%</span>
                      </div>
                      <Progress value={mission.routeProgress} className="h-2" />

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">ETA</span>
                        <span className="font-medium">{formatETA(mission.estimatedDelivery)}</span>
                      </div>

                      {mission.currentLocation && (
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Speed: {formatSpeed(mission.currentLocation.speed)}</span>
                          <span>Heading: {formatHeading(mission.currentLocation.heading)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {missions.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Missions</h3>
                  <p className="text-gray-600 dark:text-gray-400">All transport missions completed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mission Details */}
        <div className="lg:col-span-2">
          {selectedMission ? (
            <MissionDetails mission={selectedMission} trackingService={trackingService} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Mission</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a mission to view detailed tracking information
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

interface MissionDetailsProps {
  mission: TransportMission
  trackingService: GPSTrackingService
}

function MissionDetails({ mission, trackingService }: MissionDetailsProps) {
  const vehicle = trackingService.getVehicle(mission.vehicleId)
  const unresolvedAlerts = mission.alerts.filter((alert) => !alert.resolved)
  const recentCommunications = mission.communications.slice(0, 5)

  const handleResolveAlert = (alertId: string) => {
    trackingService.resolveAlert(mission.id, alertId)
  }

  const handleSendMessage = (message: string) => {
    trackingService.addCommunication(mission.id, {
      timestamp: Date.now(),
      from: "Dispatch",
      to: vehicle?.driver.name || "Driver",
      type: "text",
      message,
      priority: "normal",
      acknowledged: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Mission {mission.id}
            </CardTitle>
            <CardDescription>
              {mission.organType.charAt(0).toUpperCase() + mission.organType.slice(1)} transport • {vehicle?.callSign}
            </CardDescription>
          </div>
          <Badge className={getPriorityColor(mission.priority)}>{mission.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="route">Route Details</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts {unresolvedAlerts.length > 0 && `(${unresolvedAlerts.length})`}
            </TabsTrigger>
            <TabsTrigger value="communications">Comms</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-6">
            {/* Current Status */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Current Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium capitalize ${getStatusColor(mission.status)}`}>
                      {mission.status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{Math.round(mission.routeProgress)}%</span>
                  </div>
                  <Progress value={mission.routeProgress} className="h-3" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">ETA</span>
                    <span className="font-medium">{formatETA(mission.estimatedDelivery)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Vehicle Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Call Sign</span>
                    <span className="font-medium">{vehicle?.callSign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver</span>
                    <span className="font-medium">{vehicle?.driver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium capitalize">{vehicle?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact</span>
                    <Button variant="outline" size="sm" className="h-6">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live GPS Data */}
            {mission.currentLocation && (
              <div className="space-y-4">
                <h4 className="font-medium">Live GPS Data</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatSpeed(mission.currentLocation.speed)}</div>
                    <div className="text-sm text-gray-600">Speed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatHeading(mission.currentLocation.heading)}
                    </div>
                    <div className="text-sm text-gray-600">Heading</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {mission.currentLocation.accuracy.toFixed(1)}m
                    </div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {mission.currentLocation.altitude?.toFixed(0) || "N/A"}ft
                    </div>
                    <div className="text-sm text-gray-600">Altitude</div>
                  </div>
                </div>
              </div>
            )}

            {/* Organ Status */}
            <div className="space-y-4">
              <h4 className="font-medium">Organ Status</h4>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Organ Type</label>
                    <p className="font-medium capitalize">{mission.organ.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Viability Window</label>
                    <p className="font-medium">{mission.organ.viabilityWindow} hours</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Temperature Range</label>
                    <p className="font-medium">
                      {mission.organ.temperatureRange.min}°F - {mission.organ.temperatureRange.max}°F
                    </p>
                  </div>
                </div>
                {mission.organ.specialRequirements.length > 0 && (
                  <div className="mt-3">
                    <label className="text-sm font-medium text-gray-600">Special Requirements</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mission.organ.specialRequirements.map((req, index) => (
                        <Badge key={index} variant="outline">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="route" className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Route Information</h4>

              {/* Pickup Location */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Pickup Location</span>
                </div>
                <div className="ml-5 space-y-1">
                  <p className="font-medium">{mission.route.pickup.hospitalName}</p>
                  <p className="text-sm text-gray-600">{mission.route.pickup.address}</p>
                  <p className="text-sm">Contact: {mission.route.pickup.contactPerson}</p>
                  <p className="text-sm">Phone: {mission.route.pickup.phone}</p>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Delivery Location</span>
                </div>
                <div className="ml-5 space-y-1">
                  <p className="font-medium">{mission.route.delivery.hospitalName}</p>
                  <p className="text-sm text-gray-600">{mission.route.delivery.address}</p>
                  <p className="text-sm">Contact: {mission.route.delivery.contactPerson}</p>
                  <p className="text-sm">Phone: {mission.route.delivery.phone}</p>
                </div>
              </div>

              {/* Route Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">{mission.route.totalDistance}</div>
                  <div className="text-sm text-gray-600">Miles</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">{mission.route.estimatedDuration}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">{mission.route.waypoints.length}</div>
                  <div className="text-sm text-gray-600">Waypoints</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Active Alerts</h4>
              <Badge variant="outline">{unresolvedAlerts.length} unresolved</Badge>
            </div>

            {unresolvedAlerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Alerts</h3>
                <p className="text-gray-600 dark:text-gray-400">Mission is proceeding normally</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unresolvedAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${getAlertColor(alert.severity)}`} />
                        <span className="font-medium capitalize">{alert.type.replace("-", " ")}</span>
                        <Badge variant={alert.severity === "critical" ? "destructive" : "outline"}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert.id)}>
                        Resolve
                      </Button>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                    {alert.actions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Actions Taken:</p>
                        <div className="flex flex-wrap gap-1">
                          {alert.actions.map((action, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="communications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Communications</h4>
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentCommunications.map((comm) => (
                <div key={comm.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comm.from}</span>
                      <span className="text-xs text-gray-500">→ {comm.to}</span>
                      <Badge variant="outline" className="text-xs">
                        {comm.type.replace("-", " ")}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(comm.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm">{comm.message}</p>
                  {!comm.acknowledged && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Pending acknowledgment
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "urgent":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-blue-100 text-blue-800 border-blue-200"
  }
}
