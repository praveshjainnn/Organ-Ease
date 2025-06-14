import { calculateDistance, type Coordinates } from "./geolocation"

export interface Vehicle {
  id: string
  type: "ambulance" | "helicopter" | "aircraft"
  callSign: string
  driver: {
    name: string
    id: string
    phone: string
    certification: string[]
  }
  equipment: {
    gpsEnabled: boolean
    temperatureMonitoring: boolean
    oxygenSupport: boolean
    defibrillator: boolean
    emergencyKit: boolean
  }
  capacity: {
    patients: number
    organs: number
    medicalTeam: number
  }
  status: "available" | "en-route" | "at-pickup" | "transporting" | "at-destination" | "returning" | "maintenance"
  lastMaintenance: string
  nextMaintenance: string
}

export interface GPSLocation {
  coordinates: Coordinates
  timestamp: number
  accuracy: number // meters
  speed: number // mph
  heading: number // degrees
  altitude?: number // feet
}

export interface TransportMission {
  id: string
  vehicleId: string
  organId: string
  organType: string
  priority: "routine" | "urgent" | "high" | "critical"
  status:
    | "assigned"
    | "en-route-pickup"
    | "at-pickup"
    | "organ-loaded"
    | "en-route-delivery"
    | "delivered"
    | "completed"

  // Route information
  route: {
    pickup: {
      location: Coordinates
      address: string
      hospitalName: string
      contactPerson: string
      phone: string
    }
    delivery: {
      location: Coordinates
      address: string
      hospitalName: string
      contactPerson: string
      phone: string
    }
    waypoints: Coordinates[]
    totalDistance: number
    estimatedDuration: number // minutes
  }

  // Timing
  scheduledPickup: number
  actualPickup?: number
  estimatedDelivery: number
  actualDelivery?: number

  // Organ details
  organ: {
    type: string
    viabilityWindow: number // hours
    temperatureRange: { min: number; max: number }
    specialRequirements: string[]
  }

  // Team
  medicalTeam: {
    lead: string
    members: string[]
    specializations: string[]
  }

  // Tracking
  currentLocation?: GPSLocation
  routeProgress: number // 0-100%
  alerts: TransportAlert[]
  communications: Communication[]
}

export interface TransportAlert {
  id: string
  type: "delay" | "route-deviation" | "temperature" | "emergency" | "traffic" | "weather" | "mechanical"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: number
  resolved: boolean
  resolvedAt?: number
  actions: string[]
}

export interface Communication {
  id: string
  timestamp: number
  from: string
  to: string
  type: "voice" | "text" | "emergency" | "status-update"
  message: string
  priority: "normal" | "high" | "emergency"
  acknowledged: boolean
}

export interface TrafficCondition {
  severity: "light" | "moderate" | "heavy" | "severe"
  description: string
  estimatedDelay: number // minutes
  alternativeRoutes: number
}

export interface WeatherCondition {
  condition: "clear" | "rain" | "snow" | "fog" | "storm" | "wind"
  visibility: number // miles
  temperature: number // fahrenheit
  windSpeed: number // mph
  impact: "none" | "minor" | "moderate" | "severe"
  flightRestrictions: boolean
}

// Mock vehicle fleet
export const vehicleFleet: Vehicle[] = [
  {
    id: "V001",
    type: "ambulance",
    callSign: "ORGAN-1",
    driver: {
      name: "John Martinez",
      id: "D001",
      phone: "(555) 0101",
      certification: ["EMT-P", "Organ Transport", "HAZMAT"],
    },
    equipment: {
      gpsEnabled: true,
      temperatureMonitoring: true,
      oxygenSupport: true,
      defibrillator: true,
      emergencyKit: true,
    },
    capacity: { patients: 1, organs: 3, medicalTeam: 2 },
    status: "transporting",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
  },
  {
    id: "V002",
    type: "helicopter",
    callSign: "LIFE-FLIGHT-2",
    driver: {
      name: "Sarah Chen",
      id: "P001",
      phone: "(555) 0102",
      certification: ["Commercial Pilot", "Medical Transport", "Night Vision"],
    },
    equipment: {
      gpsEnabled: true,
      temperatureMonitoring: true,
      oxygenSupport: true,
      defibrillator: true,
      emergencyKit: true,
    },
    capacity: { patients: 2, organs: 2, medicalTeam: 3 },
    status: "en-route",
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-02-20",
  },
  {
    id: "V003",
    type: "ambulance",
    callSign: "ORGAN-3",
    driver: {
      name: "Michael Johnson",
      id: "D003",
      phone: "(555) 0103",
      certification: ["EMT-B", "Organ Transport"],
    },
    equipment: {
      gpsEnabled: true,
      temperatureMonitoring: true,
      oxygenSupport: false,
      defibrillator: true,
      emergencyKit: true,
    },
    capacity: { patients: 1, organs: 2, medicalTeam: 2 },
    status: "available",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
  },
  {
    id: "V004",
    type: "aircraft",
    callSign: "MED-JET-4",
    driver: {
      name: "Lisa Rodriguez",
      id: "P002",
      phone: "(555) 0104",
      certification: ["ATP", "Medical Transport", "International"],
    },
    equipment: {
      gpsEnabled: true,
      temperatureMonitoring: true,
      oxygenSupport: true,
      defibrillator: true,
      emergencyKit: true,
    },
    capacity: { patients: 4, organs: 5, medicalTeam: 4 },
    status: "returning",
    lastMaintenance: "2024-01-18",
    nextMaintenance: "2024-02-18",
  },
]

// Mock active missions
export const activeMissions: TransportMission[] = [
  {
    id: "M001",
    vehicleId: "V001",
    organId: "ORG001",
    organType: "kidney",
    priority: "urgent",
    status: "en-route-delivery",
    route: {
      pickup: {
        location: { latitude: 40.7589, longitude: -73.9851 },
        address: "525 E 68th St, New York, NY 10065",
        hospitalName: "NewYork-Presbyterian Hospital",
        contactPerson: "Dr. Sarah Johnson",
        phone: "(212) 746-5454",
      },
      delivery: {
        location: { latitude: 40.6892, longitude: -74.0445 },
        address: "660 1st Ave, New York, NY 10016",
        hospitalName: "NYU Langone Health",
        contactPerson: "Dr. Michael Chen",
        phone: "(212) 263-7300",
      },
      waypoints: [
        { latitude: 40.7505, longitude: -73.9934 },
        { latitude: 40.7282, longitude: -74.0776 },
      ],
      totalDistance: 12.5,
      estimatedDuration: 35,
    },
    scheduledPickup: Date.now() - 1800000, // 30 minutes ago
    actualPickup: Date.now() - 1500000, // 25 minutes ago
    estimatedDelivery: Date.now() + 600000, // 10 minutes from now
    organ: {
      type: "kidney",
      viabilityWindow: 24,
      temperatureRange: { min: 32, max: 39 },
      specialRequirements: ["Cold storage", "Continuous monitoring"],
    },
    medicalTeam: {
      lead: "Dr. Emily Rodriguez",
      members: ["Nurse Patricia Brown", "Tech Kevin Lee"],
      specializations: ["Nephrology", "Critical Care"],
    },
    currentLocation: {
      coordinates: { latitude: 40.7282, longitude: -74.0776 },
      timestamp: Date.now(),
      accuracy: 5,
      speed: 45,
      heading: 180,
      altitude: 50,
    },
    routeProgress: 75,
    alerts: [
      {
        id: "A001",
        type: "traffic",
        severity: "medium",
        message: "Heavy traffic on FDR Drive, estimated 5-minute delay",
        timestamp: Date.now() - 300000,
        resolved: false,
        actions: ["Alternative route suggested", "Dispatch notified"],
      },
    ],
    communications: [
      {
        id: "C001",
        timestamp: Date.now() - 600000,
        from: "Driver John Martinez",
        to: "Dispatch",
        type: "status-update",
        message: "Organ secured, departing pickup location",
        priority: "normal",
        acknowledged: true,
      },
    ],
  },
  {
    id: "M002",
    vehicleId: "V002",
    organId: "ORG002",
    organType: "heart",
    priority: "critical",
    status: "en-route-pickup",
    route: {
      pickup: {
        location: { latitude: 34.0522, longitude: -118.2437 },
        address: "757 Westwood Plaza, Los Angeles, CA 90095",
        hospitalName: "UCLA Medical Center",
        contactPerson: "Dr. James Wilson",
        phone: "(310) 825-9111",
      },
      delivery: {
        location: { latitude: 37.7749, longitude: -122.4194 },
        address: "505 Parnassus Ave, San Francisco, CA 94143",
        hospitalName: "UCSF Medical Center",
        contactPerson: "Dr. Amanda Davis",
        phone: "(415) 476-1000",
      },
      waypoints: [
        { latitude: 35.3733, longitude: -119.0187 },
        { latitude: 36.7783, longitude: -119.4179 },
      ],
      totalDistance: 380,
      estimatedDuration: 90,
    },
    scheduledPickup: Date.now() + 900000, // 15 minutes from now
    estimatedDelivery: Date.now() + 6300000, // 105 minutes from now
    organ: {
      type: "heart",
      viabilityWindow: 4,
      temperatureRange: { min: 32, max: 39 },
      specialRequirements: ["Immediate transport", "Cardiac monitoring", "Emergency protocols"],
    },
    medicalTeam: {
      lead: "Dr. Robert Kim",
      members: ["Nurse Jennifer Taylor", "Perfusionist Mark Anderson"],
      specializations: ["Cardiothoracic Surgery", "Perfusion"],
    },
    currentLocation: {
      coordinates: { latitude: 34.1478, longitude: -118.1445 },
      timestamp: Date.now(),
      accuracy: 3,
      speed: 120,
      heading: 315,
      altitude: 1200,
    },
    routeProgress: 25,
    alerts: [
      {
        id: "A002",
        type: "weather",
        severity: "high",
        message: "Fog conditions at destination, visibility 2 miles",
        timestamp: Date.now() - 180000,
        resolved: false,
        actions: ["Weather monitoring", "Backup landing site identified"],
      },
    ],
    communications: [
      {
        id: "C002",
        timestamp: Date.now() - 300000,
        from: "Pilot Sarah Chen",
        to: "Air Traffic Control",
        type: "emergency",
        message: "Priority medical transport, requesting direct routing",
        priority: "emergency",
        acknowledged: true,
      },
    ],
  },
]

// GPS Tracking Service
export class GPSTrackingService {
  private static instance: GPSTrackingService
  private missions: Map<string, TransportMission> = new Map()
  private vehicles: Map<string, Vehicle> = new Map()
  private subscribers: Map<string, (mission: TransportMission) => void> = new Map()

  constructor() {
    // Initialize with mock data
    activeMissions.forEach((mission) => this.missions.set(mission.id, mission))
    vehicleFleet.forEach((vehicle) => this.vehicles.set(vehicle.id, vehicle))

    // Start simulation
    this.startLocationSimulation()
  }

  static getInstance(): GPSTrackingService {
    if (!GPSTrackingService.instance) {
      GPSTrackingService.instance = new GPSTrackingService()
    }
    return GPSTrackingService.instance
  }

  // Subscribe to mission updates
  subscribe(missionId: string, callback: (mission: TransportMission) => void): () => void {
    this.subscribers.set(missionId, callback)
    return () => this.subscribers.delete(missionId)
  }

  // Get all active missions
  getActiveMissions(): TransportMission[] {
    return Array.from(this.missions.values())
  }

  // Get specific mission
  getMission(missionId: string): TransportMission | undefined {
    return this.missions.get(missionId)
  }

  // Get vehicle information
  getVehicle(vehicleId: string): Vehicle | undefined {
    return this.vehicles.get(vehicleId)
  }

  // Update mission location
  updateLocation(missionId: string, location: GPSLocation): void {
    const mission = this.missions.get(missionId)
    if (!mission) return

    mission.currentLocation = location

    // Calculate route progress
    if (mission.status === "en-route-delivery" || mission.status === "en-route-pickup") {
      const targetLocation =
        mission.status === "en-route-pickup" ? mission.route.pickup.location : mission.route.delivery.location

      const totalDistance = mission.route.totalDistance
      const remainingDistance = calculateDistance(location.coordinates, targetLocation)
      mission.routeProgress = Math.max(0, Math.min(100, ((totalDistance - remainingDistance) / totalDistance) * 100))

      // Update ETA
      if (location.speed > 0) {
        const etaMinutes = (remainingDistance / location.speed) * 60
        if (mission.status === "en-route-delivery") {
          mission.estimatedDelivery = Date.now() + etaMinutes * 60000
        }
      }
    }

    // Check for alerts
    this.checkForAlerts(mission)

    // Notify subscribers
    const callback = this.subscribers.get(missionId)
    if (callback) {
      callback(mission)
    }
  }

  // Add communication
  addCommunication(missionId: string, communication: Omit<Communication, "id">): void {
    const mission = this.missions.get(missionId)
    if (!mission) return

    const newComm: Communication = {
      ...communication,
      id: `C${Date.now()}`,
    }

    mission.communications.unshift(newComm)

    // Notify subscribers
    const callback = this.subscribers.get(missionId)
    if (callback) {
      callback(mission)
    }
  }

  // Add alert
  addAlert(missionId: string, alert: Omit<TransportAlert, "id">): void {
    const mission = this.missions.get(missionId)
    if (!mission) return

    const newAlert: TransportAlert = {
      ...alert,
      id: `A${Date.now()}`,
    }

    mission.alerts.unshift(newAlert)

    // Notify subscribers
    const callback = this.subscribers.get(missionId)
    if (callback) {
      callback(mission)
    }
  }

  // Resolve alert
  resolveAlert(missionId: string, alertId: string): void {
    const mission = this.missions.get(missionId)
    if (!mission) return

    const alert = mission.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.resolved = true
      alert.resolvedAt = Date.now()
    }

    // Notify subscribers
    const callback = this.subscribers.get(missionId)
    if (callback) {
      callback(mission)
    }
  }

  // Check for various alerts
  private checkForAlerts(mission: TransportMission): void {
    if (!mission.currentLocation) return

    // Check for route deviation
    const expectedRoute = mission.route.waypoints
    if (expectedRoute.length > 0) {
      const nearestWaypoint = expectedRoute.reduce((nearest, waypoint) => {
        const distance = calculateDistance(mission.currentLocation!.coordinates, waypoint)
        return distance < calculateDistance(mission.currentLocation!.coordinates, nearest) ? waypoint : nearest
      })

      const deviationDistance = calculateDistance(mission.currentLocation.coordinates, nearestWaypoint)
      if (deviationDistance > 2) {
        // 2 miles deviation
        this.addAlert(mission.id, {
          type: "route-deviation",
          severity: "medium",
          message: `Vehicle has deviated ${deviationDistance.toFixed(1)} miles from planned route`,
          timestamp: Date.now(),
          resolved: false,
          actions: ["Route recalculation", "Driver notification"],
        })
      }
    }

    // Check for speed issues
    if (mission.currentLocation.speed < 10 && mission.status.includes("en-route")) {
      this.addAlert(mission.id, {
        type: "delay",
        severity: "medium",
        message: "Vehicle speed below normal, possible traffic or mechanical issue",
        timestamp: Date.now(),
        resolved: false,
        actions: ["Status check", "Alternative route"],
      })
    }

    // Check organ viability
    const timeElapsed = (Date.now() - (mission.actualPickup || mission.scheduledPickup)) / 3600000 // hours
    const viabilityUsed = (timeElapsed / mission.organ.viabilityWindow) * 100

    if (viabilityUsed > 75) {
      this.addAlert(mission.id, {
        type: "emergency",
        severity: "critical",
        message: `Organ viability at ${(100 - viabilityUsed).toFixed(1)}%, immediate delivery required`,
        timestamp: Date.now(),
        resolved: false,
        actions: ["Emergency protocols", "Priority routing", "Hospital notification"],
      })
    }
  }

  // Simulate GPS location updates
  private startLocationSimulation(): void {
    setInterval(() => {
      this.missions.forEach((mission) => {
        if (mission.status.includes("en-route") && mission.currentLocation) {
          // Simulate movement along route
          const targetLocation =
            mission.status === "en-route-pickup" ? mission.route.pickup.location : mission.route.delivery.location

          const currentLat = mission.currentLocation.coordinates.latitude
          const currentLng = mission.currentLocation.coordinates.longitude
          const targetLat = targetLocation.latitude
          const targetLng = targetLocation.longitude

          // Move towards target (simplified simulation)
          const latDiff = (targetLat - currentLat) * 0.01
          const lngDiff = (targetLng - currentLng) * 0.01

          const newLocation: GPSLocation = {
            coordinates: {
              latitude: currentLat + latDiff,
              longitude: currentLng + lngDiff,
            },
            timestamp: Date.now(),
            accuracy: Math.random() * 10 + 3,
            speed: 35 + Math.random() * 30,
            heading: Math.atan2(lngDiff, latDiff) * (180 / Math.PI),
            altitude: mission.currentLocation.altitude,
          }

          this.updateLocation(mission.id, newLocation)
        }
      })
    }, 5000) // Update every 5 seconds
  }
}

// Utility functions
export function formatSpeed(speed: number): string {
  return `${Math.round(speed)} mph`
}

export function formatHeading(heading: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(heading / 45) % 8
  return directions[index]
}

export function formatETA(timestamp: number): string {
  const now = Date.now()
  const diff = timestamp - now

  if (diff < 0) return "Overdue"

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

export function getAlertColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-red-600"
    case "high":
      return "text-orange-600"
    case "medium":
      return "text-yellow-600"
    default:
      return "text-blue-600"
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "delivered":
      return "text-green-600"
    case "transporting":
      return "text-blue-600"
    case "en-route-delivery":
      return "text-blue-600"
    case "at-pickup":
      return "text-yellow-600"
    case "en-route-pickup":
      return "text-orange-600"
    default:
      return "text-gray-600"
  }
}
