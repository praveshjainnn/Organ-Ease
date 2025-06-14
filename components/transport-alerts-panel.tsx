"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Clock,
  MapPin,
  Thermometer,
  Car,
  CloudRain,
  Wrench,
  Phone,
  CheckCircle,
  Bell,
  Activity,
} from "lucide-react"
import { GPSTrackingService, type TransportMission } from "@/lib/gps-tracking"

export function TransportAlertsPanel() {
  const [missions, setMissions] = useState<TransportMission[]>([])
  const [trackingService] = useState(() => GPSTrackingService.getInstance())
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")

  useEffect(() => {
    // Load initial missions
    setMissions(trackingService.getActiveMissions())

    // Subscribe to updates for all missions
    const unsubscribers: (() => void)[] = []

    trackingService.getActiveMissions().forEach((mission) => {
      const unsubscribe = trackingService.subscribe(mission.id, (updatedMission) => {
        setMissions((prev) => prev.map((m) => (m.id === updatedMission.id ? updatedMission : m)))
      })
      unsubscribers.push(unsubscribe)
    })

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [trackingService])

  const allAlerts = missions.flatMap((mission) =>
    mission.alerts.map((alert) => ({ ...alert, missionId: mission.id, mission })),
  )

  const activeAlerts = allAlerts.filter((alert) => !alert.resolved)
  const resolvedAlerts = allAlerts.filter((alert) => alert.resolved)

  const filteredActiveAlerts =
    selectedSeverity === "all" ? activeAlerts : activeAlerts.filter((alert) => alert.severity === selectedSeverity)

  const criticalAlerts = activeAlerts.filter((alert) => alert.severity === "critical")
  const highAlerts = activeAlerts.filter((alert) => alert.severity === "high")
  const mediumAlerts = activeAlerts.filter((alert) => alert.severity === "medium")

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <Clock className="h-4 w-4" />
      case "route-deviation":
        return <MapPin className="h-4 w-4" />
      case "temperature":
        return <Thermometer className="h-4 w-4" />
      case "traffic":
        return <Car className="h-4 w-4" />
      case "weather":
        return <CloudRain className="h-4 w-4" />
      case "mechanical":
        return <Wrench className="h-4 w-4" />
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const handleResolveAlert = (missionId: string, alertId: string) => {
    trackingService.resolveAlert(missionId, alertId)
  }

  const handleContactDriver = (mission: TransportMission) => {
    const vehicle = trackingService.getVehicle(mission.vehicleId)
    if (vehicle) {
      // Simulate contacting driver
      trackingService.addCommunication(mission.id, {
        timestamp: Date.now(),
        from: "Dispatch",
        to: vehicle.driver.name,
        type: "voice",
        message: "Dispatch calling regarding active alert",
        priority: "high",
        acknowledged: false,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Immediate attention required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Urgent response needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mediumAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Across all missions</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Transport Alerts
          </CardTitle>
          <CardDescription>Monitor and manage transport alerts in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Alerts ({activeAlerts.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {/* Severity Filter */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedSeverity === "all" ? "default" : "outline"}
                  onClick={() => setSelectedSeverity("all")}
                >
                  All ({activeAlerts.length})
                </Button>
                <Button
                  size="sm"
                  variant={selectedSeverity === "critical" ? "destructive" : "outline"}
                  onClick={() => setSelectedSeverity("critical")}
                >
                  Critical ({criticalAlerts.length})
                </Button>
                <Button
                  size="sm"
                  variant={selectedSeverity === "high" ? "default" : "outline"}
                  onClick={() => setSelectedSeverity("high")}
                  className={selectedSeverity === "high" ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  High ({highAlerts.length})
                </Button>
                <Button
                  size="sm"
                  variant={selectedSeverity === "medium" ? "default" : "outline"}
                  onClick={() => setSelectedSeverity("medium")}
                  className={selectedSeverity === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                >
                  Medium ({mediumAlerts.length})
                </Button>
              </div>

              {/* Active Alerts List */}
              {filteredActiveAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {selectedSeverity === "all" ? "No Active Alerts" : `No ${selectedSeverity} Alerts`}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">All missions are proceeding normally</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActiveAlerts
                    .sort((a, b) => {
                      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
                      return (
                        severityOrder[b.severity as keyof typeof severityOrder] -
                        severityOrder[a.severity as keyof typeof severityOrder]
                      )
                    })
                    .map((alert) => {
                      const vehicle = trackingService.getVehicle(alert.mission.vehicleId)

                      return (
                        <Alert
                          key={alert.id}
                          className={`border-l-4 ${
                            alert.severity === "critical"
                              ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                              : alert.severity === "high"
                                ? "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                : alert.severity === "medium"
                                  ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                  : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div
                                className={`p-2 rounded-full ${
                                  alert.severity === "critical"
                                    ? "bg-red-100 text-red-600"
                                    : alert.severity === "high"
                                      ? "bg-orange-100 text-orange-600"
                                      : alert.severity === "medium"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {getAlertIcon(alert.type)}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{vehicle?.callSign}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {alert.mission.organType}
                                  </Badge>
                                  <Badge
                                    variant={alert.severity === "critical" ? "destructive" : "outline"}
                                    className="text-xs"
                                  >
                                    {alert.severity}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {alert.type.replace("-", " ")}
                                  </Badge>
                                </div>

                                <AlertDescription className="mb-2">{alert.message}</AlertDescription>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                  <span>Mission: {alert.missionId}</span>
                                </div>

                                {alert.actions.length > 0 && (
                                  <div className="mb-2">
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
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="outline" onClick={() => handleContactDriver(alert.mission)}>
                                <Phone className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleResolveAlert(alert.missionId, alert.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                            </div>
                          </div>
                        </Alert>
                      )
                    })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              {resolvedAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Resolved Alerts</h3>
                  <p className="text-gray-600 dark:text-gray-400">Resolved alerts will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resolvedAlerts
                    .sort((a, b) => (b.resolvedAt || 0) - (a.resolvedAt || 0))
                    .slice(0, 10)
                    .map((alert) => {
                      const vehicle = trackingService.getVehicle(alert.mission.vehicleId)

                      return (
                        <div key={alert.id} className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 rounded-full bg-green-100 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{vehicle?.callSign}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {alert.type.replace("-", " ")}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                    Resolved
                                  </Badge>
                                </div>

                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>Occurred: {new Date(alert.timestamp).toLocaleString()}</span>
                                  <span>Resolved: {new Date(alert.resolvedAt || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
