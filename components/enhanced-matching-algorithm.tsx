"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MapPin, Clock, AlertTriangle, CheckCircle, Star, Zap } from "lucide-react"
import {
  calculateMatchScore,
  formatTransportTime,
  formatCost,
  type OrganSpecialty,
  type LocationData,
  type HospitalMatch,
} from "@/lib/hospital-network"
import { calculateDistance, formatDistance } from "@/lib/geolocation"

interface EnhancedMatch {
  id: string
  donorId: string
  recipientId: string
  organ: OrganSpecialty
  bloodCompatibility: number
  donorLocation: LocationData
  recipientLocation: LocationData
  urgency: "routine" | "urgent" | "high" | "critical"
  matchScore: number
  hospitalOptions: HospitalMatch[]
  recommendedTransport: any
  feasible: boolean
  estimatedTime: number
  estimatedCost: number
  riskFactors: string[]
  advantages: string[]
}

interface EnhancedMatchingAlgorithmProps {
  userLocation: LocationData | null
  userRole: "donor" | "recipient"
  selectedOrgan: OrganSpecialty
}

export function EnhancedMatchingAlgorithm({ userLocation, userRole, selectedOrgan }: EnhancedMatchingAlgorithmProps) {
  const [matches, setMatches] = useState<EnhancedMatch[]>([])
  const [selectedMatch, setSelectedMatch] = useState<EnhancedMatch | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Mock enhanced matching data
  useEffect(() => {
    if (userLocation) {
      setIsCalculating(true)

      // Simulate API call delay
      setTimeout(() => {
        const mockMatches: EnhancedMatch[] = [
          {
            id: "M001",
            donorId: "D001",
            recipientId: "R001",
            organ: selectedOrgan,
            bloodCompatibility: 95,
            donorLocation: {
              coordinates: { latitude: 40.7128, longitude: -74.006 },
              address: "New York, NY",
              city: "New York",
              state: "NY",
              country: "USA",
            },
            recipientLocation: {
              coordinates: { latitude: 42.3601, longitude: -71.0589 },
              address: "Boston, MA",
              city: "Boston",
              state: "MA",
              country: "USA",
            },
            urgency: "high",
            matchScore: 0,
            hospitalOptions: [],
            recommendedTransport: null,
            feasible: true,
            estimatedTime: 240,
            estimatedCost: 15000,
            riskFactors: ["Distance over 200 miles", "Weather conditions"],
            advantages: ["Excellent blood compatibility", "High-volume transplant center"],
          },
          {
            id: "M002",
            donorId: "D002",
            recipientId: "R002",
            organ: selectedOrgan,
            bloodCompatibility: 88,
            donorLocation: {
              coordinates: { latitude: 40.7128, longitude: -74.006 },
              address: "New York, NY",
              city: "New York",
              state: "NY",
              country: "USA",
            },
            recipientLocation: {
              coordinates: { latitude: 39.9526, longitude: -75.1652 },
              address: "Philadelphia, PA",
              city: "Philadelphia",
              state: "PA",
              country: "USA",
            },
            urgency: "critical",
            matchScore: 0,
            hospitalOptions: [],
            recommendedTransport: null,
            feasible: true,
            estimatedTime: 120,
            estimatedCost: 8000,
            riskFactors: ["Critical urgency timeline"],
            advantages: ["Close proximity", "Level I trauma center", "Immediate availability"],
          },
          {
            id: "M003",
            donorId: "D003",
            recipientId: "R003",
            organ: selectedOrgan,
            bloodCompatibility: 92,
            donorLocation: {
              coordinates: { latitude: 40.7128, longitude: -74.006 },
              address: "New York, NY",
              city: "New York",
              state: "NY",
              country: "USA",
            },
            recipientLocation: {
              coordinates: { latitude: 41.8781, longitude: -87.6298 },
              address: "Chicago, IL",
              city: "Chicago",
              state: "IL",
              country: "USA",
            },
            urgency: "urgent",
            matchScore: 0,
            hospitalOptions: [],
            recommendedTransport: null,
            feasible: false,
            estimatedTime: 480,
            estimatedCost: 25000,
            riskFactors: ["Long distance transport", "Organ viability window", "Weather delays"],
            advantages: ["Good blood compatibility", "Experienced surgical team"],
          },
        ]

        // Calculate enhanced match scores for each match
        const enhancedMatches = mockMatches.map((match) => {
          const matchResult = calculateMatchScore(
            match.donorLocation.coordinates,
            match.recipientLocation.coordinates,
            match.organ,
            match.urgency,
            match.bloodCompatibility,
          )

          return {
            ...match,
            matchScore: matchResult.score,
            hospitalOptions: matchResult.hospitalOptions,
            recommendedTransport: matchResult.recommendedTransport,
            feasible: matchResult.feasible,
          }
        })

        // Sort by match score
        enhancedMatches.sort((a, b) => b.matchScore - a.matchScore)
        setMatches(enhancedMatches)
        setIsCalculating(false)
      }, 1500)
    }
  }, [userLocation, selectedOrgan])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  if (!userLocation) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Set Your Location</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please set your location to calculate enhanced matching scores
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Algorithm Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Enhanced Matching Algorithm
          </CardTitle>
          <CardDescription>
            AI-powered matching considering medical compatibility, distance, hospital capacity, and transport logistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCalculating ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Calculating optimal matches...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Matches</label>
                <p className="font-semibold">{matches.length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Feasible</label>
                <p className="font-semibold text-green-600">{matches.filter((m) => m.feasible).length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Critical Cases</label>
                <p className="font-semibold text-red-600">{matches.filter((m) => m.urgency === "critical").length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Avg Score</label>
                <p className="font-semibold">
                  {matches.length > 0
                    ? Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)
                    : 0}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Results */}
      {!isCalculating && (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Matches Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No compatible matches found for the selected criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            matches.map((match) => (
              <Card
                key={match.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedMatch?.id === match.id ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                } ${!match.feasible ? "opacity-75" : ""}`}
                onClick={() => setSelectedMatch(match)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        {userRole === "donor" ? `Recipient ${match.recipientId}` : `Donor ${match.donorId}`}
                      </CardTitle>
                      <CardDescription>
                        {match.organ.charAt(0).toUpperCase() + match.organ.slice(1)} transplant •{" "}
                        {formatDistance(
                          calculateDistance(match.donorLocation.coordinates, match.recipientLocation.coordinates),
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getScoreColor(match.matchScore)}>
                        <Star className="h-3 w-3 mr-1" />
                        {match.matchScore}% Match
                      </Badge>
                      <Badge className={getUrgencyColor(match.urgency)}>{match.urgency}</Badge>
                      {!match.feasible && <Badge variant="destructive">Not Feasible</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="logistics">Logistics</TabsTrigger>
                      <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Blood Compatibility</label>
                          <div className="flex items-center gap-2">
                            <Progress value={match.bloodCompatibility} className="flex-1" />
                            <span className="font-semibold">{match.bloodCompatibility}%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Transport Time</label>
                          <p className="font-semibold flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTransportTime(match.estimatedTime)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Estimated Cost</label>
                          <p className="font-semibold">{formatCost(match.estimatedCost)}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Route</label>
                          <p className="text-sm flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {match.donorLocation.city} → {match.recipientLocation.city}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Hospitals Available</label>
                          <p className="font-semibold">{match.hospitalOptions.length} options</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="logistics" className="space-y-4">
                      {match.recommendedTransport ? (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Recommended Transport</span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Method: </span>
                              <span className="font-medium capitalize">{match.recommendedTransport.option.type}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Time: </span>
                              <span className="font-medium">
                                {formatTransportTime(match.recommendedTransport.estimatedTime)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Viability: </span>
                              <span className="font-medium">
                                {match.recommendedTransport.viabilityWindow}h remaining
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-800 dark:text-red-200">No Feasible Transport</span>
                          </div>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            Distance exceeds organ viability window for available transport methods
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="hospitals" className="space-y-4">
                      {match.hospitalOptions.slice(0, 2).map((hospital, index) => (
                        <div key={hospital.hospital.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{hospital.hospital.name}</h4>
                              <p className="text-sm text-gray-600">
                                {hospital.hospital.city}, {hospital.hospital.state}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{hospital.distance.toFixed(1)} mi</Badge>
                              {index === 0 && <Badge>Primary</Badge>}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Success Rate: </span>
                              <span className="font-medium text-green-600">{hospital.successRate}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Capacity: </span>
                              <span className="font-medium">{hospital.capacity}/year</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Wait Time: </span>
                              <span className="font-medium">{hospital.waitTime} days</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-green-600 mb-2 block">Advantages</label>
                          <div className="space-y-1">
                            {match.advantages.map((advantage, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>{advantage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-orange-600 mb-2 block">Risk Factors</label>
                          <div className="space-y-1">
                            {match.riskFactors.map((risk, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-3 w-3 text-orange-600" />
                                <span>{risk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <label className="text-sm font-medium text-gray-500 mb-2 block">Match Score Breakdown</label>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Blood Compatibility (40%)</span>
                            <span className="font-medium">{Math.round(match.bloodCompatibility * 0.4)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Distance Factor (20%)</span>
                            <span className="font-medium">
                              {Math.round(
                                (100 -
                                  calculateDistance(
                                    match.donorLocation.coordinates,
                                    match.recipientLocation.coordinates,
                                  ) *
                                    2) *
                                  0.2,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Hospital Quality (20%)</span>
                            <span className="font-medium">
                              {match.hospitalOptions.length > 0
                                ? Math.round(match.hospitalOptions[0].successRate * 0.2)
                                : 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Transport Feasibility (10%)</span>
                            <span className="font-medium">{match.feasible ? 10 : 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Urgency Multiplier</span>
                            <span className="font-medium">
                              ×
                              {match.urgency === "critical"
                                ? "1.3"
                                : match.urgency === "high"
                                  ? "1.2"
                                  : match.urgency === "urgent"
                                    ? "1.1"
                                    : "1.0"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t font-semibold">
                            <span>Total Score</span>
                            <span className={getScoreColor(match.matchScore)}>{match.matchScore}%</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {match.feasible && (
                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1">{userRole === "donor" ? "Contact Recipient" : "Contact Donor"}</Button>
                      <Button variant="outline">View Details</Button>
                      <Button variant="outline">Coordinate Transport</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
