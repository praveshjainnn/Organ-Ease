"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  DollarSign,
  Car,
  BirdIcon as Helicopter,
  Plane,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Timer,
} from "lucide-react"
import {
  formatTransportTime,
  formatCost,
  type TransportPlan,
  type HospitalMatch,
  type OrganSpecialty,
} from "@/lib/hospital-network"

interface TransportLogisticsProps {
  organ: OrganSpecialty
  donorLocation: string
  recipientHospital: HospitalMatch | null
  transportPlans: TransportPlan[]
  urgency: "routine" | "urgent" | "high" | "critical"
}

export function TransportLogistics({
  organ,
  donorLocation,
  recipientHospital,
  transportPlans,
  urgency,
}: TransportLogisticsProps) {
  const getTransportIcon = (type: string) => {
    switch (type) {
      case "ground":
        return <Car className="h-5 w-5" />
      case "helicopter":
        return <Helicopter className="h-5 w-5" />
      case "fixed-wing":
        return <Plane className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "urgent":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  const getViabilityColor = (hours: number) => {
    if (hours > 8) return "text-green-600"
    if (hours > 4) return "text-yellow-600"
    if (hours > 2) return "text-orange-600"
    return "text-red-600"
  }

  const getViabilityProgress = (hours: number, maxHours: number) => {
    return Math.max(0, (hours / maxHours) * 100)
  }

  const organViabilityHours = {
    kidney: 24,
    liver: 12,
    heart: 4,
    lung: 6,
    pancreas: 12,
    cornea: 72,
    bone: 120,
    skin: 120,
  }

  const maxViability = organViabilityHours[organ] || 24

  if (!recipientHospital) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Hospital</h3>
          <p className="text-gray-600 dark:text-gray-400">Choose a hospital to view transport logistics</p>
        </CardContent>
      </Card>
    )
  }

  const feasiblePlans = transportPlans.filter((plan) => plan.feasible)
  const recommendedPlan = feasiblePlans[0]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Transport Logistics
          </CardTitle>
          <CardDescription>
            {organ.charAt(0).toUpperCase() + organ.slice(1)} transport from {donorLocation} to{" "}
            {recipientHospital.hospital.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Distance</label>
              <p className="font-semibold">{recipientHospital.distance.toFixed(1)} miles</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Urgency</label>
              <p className={`font-semibold capitalize ${getUrgencyColor(urgency)}`}>{urgency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Organ Viability</label>
              <p className="font-semibold">{maxViability} hours max</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Transport Options</label>
              <p className="font-semibold">{feasiblePlans.length} available</p>
            </div>
          </div>

          {recommendedPlan && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Recommended Transport</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  {getTransportIcon(recommendedPlan.option.type)}
                  <span className="font-medium capitalize">{recommendedPlan.option.type}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Time: </span>
                  <span className="font-medium">{formatTransportTime(recommendedPlan.estimatedTime)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Cost: </span>
                  <span className="font-medium">{formatCost(recommendedPlan.estimatedCost)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transport Options */}
      <Card>
        <CardHeader>
          <CardTitle>Transport Options</CardTitle>
          <CardDescription>Available transport methods with timing and cost analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Options</TabsTrigger>
              <TabsTrigger value="feasible">Feasible Only</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {transportPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    plan.feasible
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTransportIcon(plan.option.type)}
                      <div>
                        <h4 className="font-medium capitalize">{plan.option.type} Transport</h4>
                        <p className="text-sm text-gray-600">
                          Max range: {plan.option.maxDistance} mi • Avg speed: {plan.option.avgSpeed} mph
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {plan.feasible ? (
                        <Badge className="bg-green-100 text-green-800">Feasible</Badge>
                      ) : (
                        <Badge variant="destructive">Not Feasible</Badge>
                      )}
                      {index === 0 && plan.feasible && <Badge>Recommended</Badge>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Time</label>
                      <p className="font-semibold flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTransportTime(plan.estimatedTime)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Setup: {plan.option.setupTime}m + Travel:{" "}
                        {formatTransportTime(plan.estimatedTime - plan.option.setupTime)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cost</label>
                      <p className="font-semibold flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatCost(plan.estimatedCost)}
                      </p>
                      <p className="text-xs text-gray-500">${plan.option.costPerMile}/mile</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Viability Remaining</label>
                      <p className={`font-semibold ${getViabilityColor(plan.viabilityWindow)}`}>
                        {plan.viabilityWindow}h
                      </p>
                      <Progress value={getViabilityProgress(plan.viabilityWindow, maxViability)} className="h-2 mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Safety Buffer</label>
                      <p className={`font-semibold ${plan.viabilityWindow > 2 ? "text-green-600" : "text-red-600"}`}>
                        {plan.viabilityWindow > 2 ? "Good" : "Critical"}
                      </p>
                    </div>
                  </div>

                  {!plan.feasible && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        Insufficient viability window. Organ would expire {Math.abs(plan.viabilityWindow).toFixed(1)}{" "}
                        hours before arrival.
                      </span>
                    </div>
                  )}

                  {plan.feasible && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">
                        Select This Option
                      </Button>
                      <Button size="sm" variant="outline">
                        Get Quote
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="feasible" className="space-y-4">
              {feasiblePlans.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Feasible Options</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The distance is too great for the organ's viability window. Consider closer hospitals or emergency
                    transport.
                  </p>
                </div>
              ) : (
                feasiblePlans.map((plan, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTransportIcon(plan.option.type)}
                        <div>
                          <h4 className="font-medium capitalize">{plan.option.type} Transport</h4>
                          <p className="text-sm text-gray-600">
                            {formatTransportTime(plan.estimatedTime)} • {formatCost(plan.estimatedCost)}
                          </p>
                        </div>
                      </div>
                      {index === 0 && <Badge>Fastest</Badge>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Viability Status</label>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={getViabilityProgress(plan.viabilityWindow, maxViability)}
                            className="flex-1 h-2"
                          />
                          <span className={`text-sm font-medium ${getViabilityColor(plan.viabilityWindow)}`}>
                            {plan.viabilityWindow}h
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Select & Coordinate
                        </Button>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Emergency Protocols */}
      {urgency === "critical" && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
              <AlertTriangle className="h-5 w-5" />
              Critical Urgency Protocol
            </CardTitle>
            <CardDescription className="text-red-800 dark:text-red-200">
              Special procedures for critical organ transport
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Emergency transport coordination activated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Hospital OR and surgical team on standby</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Priority air traffic clearance requested</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Real-time tracking and monitoring enabled</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">Activate Emergency Transport</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
