import { calculateDistance, type Coordinates } from "./geolocation"

export interface Hospital {
  id: string
  name: string
  address: string
  coordinates: Coordinates
  city: string
  state: string
  level: "Level I" | "Level II" | "Level III" | "Level IV"
  specialties: OrganSpecialty[]
  transplantCapacity: {
    kidney: number
    liver: number
    heart: number
    lung: number
    pancreas: number
  }
  emergencyCapable: boolean
  helipadAvailable: boolean
  icuBeds: number
  operatingRooms: number
  contactInfo: {
    phone: string
    emergencyPhone: string
    transplantCoordinator: string
  }
}

export type OrganSpecialty = "kidney" | "liver" | "heart" | "lung" | "pancreas" | "cornea" | "bone" | "skin"

export interface TransportOption {
  type: "ground" | "helicopter" | "fixed-wing"
  maxDistance: number // in miles
  avgSpeed: number // mph
  setupTime: number // minutes
  costPerMile: number
  organViabilityHours: Record<OrganSpecialty, number>
}

// Mock hospital network data
export const hospitalNetwork: Hospital[] = [
  {
    id: "H001",
    name: "NewYork-Presbyterian Hospital",
    address: "525 E 68th St, New York, NY 10065",
    coordinates: { latitude: 40.7648, longitude: -73.9536 },
    city: "New York",
    state: "NY",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 200, liver: 150, heart: 100, lung: 80, pancreas: 50 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 150,
    operatingRooms: 25,
    contactInfo: {
      phone: "(212) 746-5454",
      emergencyPhone: "(212) 746-0911",
      transplantCoordinator: "Dr. Sarah Johnson",
    },
  },
  {
    id: "H002",
    name: "UCLA Medical Center",
    address: "757 Westwood Plaza, Los Angeles, CA 90095",
    coordinates: { latitude: 34.0669, longitude: -118.4456 },
    city: "Los Angeles",
    state: "CA",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 180, liver: 120, heart: 90, lung: 70, pancreas: 40 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 120,
    operatingRooms: 20,
    contactInfo: {
      phone: "(310) 825-9111",
      emergencyPhone: "(310) 825-2111",
      transplantCoordinator: "Dr. Michael Chen",
    },
  },
  {
    id: "H003",
    name: "Northwestern Memorial Hospital",
    address: "251 E Huron St, Chicago, IL 60611",
    coordinates: { latitude: 41.8955, longitude: -87.6214 },
    city: "Chicago",
    state: "IL",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 160, liver: 100, heart: 80, lung: 60, pancreas: 35 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 100,
    operatingRooms: 18,
    contactInfo: {
      phone: "(312) 926-2000",
      emergencyPhone: "(312) 926-5188",
      transplantCoordinator: "Dr. Emily Rodriguez",
    },
  },
  {
    id: "H004",
    name: "Houston Methodist Hospital",
    address: "6565 Fannin St, Houston, TX 77030",
    coordinates: { latitude: 29.7099, longitude: -95.3962 },
    city: "Houston",
    state: "TX",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 140, liver: 90, heart: 70, lung: 50, pancreas: 30 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 90,
    operatingRooms: 16,
    contactInfo: {
      phone: "(713) 790-3311",
      emergencyPhone: "(713) 790-2323",
      transplantCoordinator: "Dr. James Wilson",
    },
  },
  {
    id: "H005",
    name: "Mayo One Hospital",
    address: "5777 E Mayo Blvd, Phoenix, AZ 85054",
    coordinates: { latitude: 33.6119, longitude: -111.8906 },
    city: "Phoenix",
    state: "AZ",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 120, liver: 80, heart: 60, lung: 40, pancreas: 25 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 80,
    operatingRooms: 14,
    contactInfo: {
      phone: "(480) 515-6296",
      emergencyPhone: "(480) 515-8888",
      transplantCoordinator: "Dr. Lisa Martinez",
    },
  },
  {
    id: "H006",
    name: "Hospital of the University of Pennsylvania",
    address: "3400 Spruce St, Philadelphia, PA 19104",
    coordinates: { latitude: 39.9496, longitude: -75.1956 },
    city: "Philadelphia",
    state: "PA",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 130, liver: 85, heart: 65, lung: 45, pancreas: 28 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 85,
    operatingRooms: 15,
    contactInfo: {
      phone: "(215) 662-4000",
      emergencyPhone: "(215) 662-3333",
      transplantCoordinator: "Dr. Robert Kim",
    },
  },
  {
    id: "H007",
    name: "UT Southwestern Medical Center",
    address: "5323 Harry Hines Blvd, Dallas, TX 75390",
    coordinates: { latitude: 32.8129, longitude: -96.8364 },
    city: "Dallas",
    state: "TX",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 110, liver: 75, heart: 55, lung: 35, pancreas: 22 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 75,
    operatingRooms: 13,
    contactInfo: {
      phone: "(214) 645-3300",
      emergencyPhone: "(214) 645-2222",
      transplantCoordinator: "Dr. Amanda Davis",
    },
  },
  {
    id: "H008",
    name: "UCSD Medical Center",
    address: "200 W Arbor Dr, San Diego, CA 92103",
    coordinates: { latitude: 32.7503, longitude: -117.1637 },
    city: "San Diego",
    state: "CA",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 100, liver: 70, heart: 50, lung: 30, pancreas: 20 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 70,
    operatingRooms: 12,
    contactInfo: {
      phone: "(619) 543-6222",
      emergencyPhone: "(619) 543-7777",
      transplantCoordinator: "Dr. Kevin Lee",
    },
  },
  {
    id: "H009",
    name: "Massachusetts General Hospital",
    address: "55 Fruit St, Boston, MA 02114",
    coordinates: { latitude: 42.3631, longitude: -71.0686 },
    city: "Boston",
    state: "MA",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 170, liver: 110, heart: 85, lung: 65, pancreas: 38 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 110,
    operatingRooms: 19,
    contactInfo: {
      phone: "(617) 726-2000",
      emergencyPhone: "(617) 726-7777",
      transplantCoordinator: "Dr. Patricia Brown",
    },
  },
  {
    id: "H010",
    name: "University of Miami Hospital",
    address: "1400 NW 12th Ave, Miami, FL 33136",
    coordinates: { latitude: 25.7907, longitude: -80.2133 },
    city: "Miami",
    state: "FL",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 90, liver: 60, heart: 45, lung: 25, pancreas: 18 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 65,
    operatingRooms: 11,
    contactInfo: {
      phone: "(305) 325-5511",
      emergencyPhone: "(305) 325-1111",
      transplantCoordinator: "Dr. Carlos Mendez",
    },
  },
  {
    id: "H011",
    name: "Seattle Children's Hospital",
    address: "4800 Sand Point Way NE, Seattle, WA 98105",
    coordinates: { latitude: 47.6553, longitude: -122.2973 },
    city: "Seattle",
    state: "WA",
    level: "Level II",
    specialties: ["kidney", "liver", "heart"],
    transplantCapacity: { kidney: 80, liver: 50, heart: 35, lung: 20, pancreas: 15 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 60,
    operatingRooms: 10,
    contactInfo: {
      phone: "(206) 987-2000",
      emergencyPhone: "(206) 987-4444",
      transplantCoordinator: "Dr. Jennifer Taylor",
    },
  },
  {
    id: "H012",
    name: "University of Colorado Hospital",
    address: "12605 E 16th Ave, Aurora, CO 80045",
    coordinates: { latitude: 39.7447, longitude: -104.8378 },
    city: "Denver",
    state: "CO",
    level: "Level I",
    specialties: ["kidney", "liver", "heart", "lung", "pancreas"],
    transplantCapacity: { kidney: 85, liver: 55, heart: 40, lung: 22, pancreas: 16 },
    emergencyCapable: true,
    helipadAvailable: true,
    icuBeds: 55,
    operatingRooms: 9,
    contactInfo: {
      phone: "(720) 848-0000",
      emergencyPhone: "(720) 848-4444",
      transplantCoordinator: "Dr. Mark Anderson",
    },
  },
]

// Transport options with organ viability windows
export const transportOptions: TransportOption[] = [
  {
    type: "ground",
    maxDistance: 200,
    avgSpeed: 65,
    setupTime: 15,
    costPerMile: 2.5,
    organViabilityHours: {
      kidney: 24,
      liver: 12,
      heart: 4,
      lung: 6,
      pancreas: 12,
      cornea: 72,
      bone: 120,
      skin: 120,
    },
  },
  {
    type: "helicopter",
    maxDistance: 300,
    avgSpeed: 150,
    setupTime: 30,
    costPerMile: 15,
    organViabilityHours: {
      kidney: 24,
      liver: 12,
      heart: 4,
      lung: 6,
      pancreas: 12,
      cornea: 72,
      bone: 120,
      skin: 120,
    },
  },
  {
    type: "fixed-wing",
    maxDistance: 1500,
    avgSpeed: 400,
    setupTime: 60,
    costPerMile: 8,
    organViabilityHours: {
      kidney: 24,
      liver: 12,
      heart: 4,
      lung: 6,
      pancreas: 12,
      cornea: 72,
      bone: 120,
      skin: 120,
    },
  },
]

export interface TransportPlan {
  option: TransportOption
  estimatedTime: number // minutes
  estimatedCost: number
  viabilityWindow: number // hours remaining
  feasible: boolean
  route: {
    from: string
    to: string
    distance: number
  }
}

export interface HospitalMatch {
  hospital: Hospital
  distance: number
  transportPlans: TransportPlan[]
  capacity: number
  waitTime: number // estimated days
  successRate: number // percentage
}

// Find hospitals by specialty and location
export function findHospitalsBySpecialty(
  specialty: OrganSpecialty,
  location: Coordinates,
  maxDistance = 500,
): HospitalMatch[] {
  return hospitalNetwork
    .filter((hospital) => hospital.specialties.includes(specialty))
    .map((hospital) => {
      const distance = calculateDistance(location, hospital.coordinates)
      const transportPlans = calculateTransportPlans(location, hospital.coordinates, specialty, distance)

      return {
        hospital,
        distance,
        transportPlans,
        capacity: hospital.transplantCapacity[specialty],
        waitTime: Math.max(1, Math.floor(Math.random() * 30)), // Mock wait time
        successRate: Math.floor(85 + Math.random() * 15), // Mock success rate 85-100%
      }
    })
    .filter((match) => match.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

// Calculate transport plans for organ delivery
export function calculateTransportPlans(
  from: Coordinates,
  to: Coordinates,
  organ: OrganSpecialty,
  distance: number,
): TransportPlan[] {
  return transportOptions
    .filter((option) => distance <= option.maxDistance)
    .map((option) => {
      const travelTime = (distance / option.avgSpeed) * 60 // minutes
      const totalTime = option.setupTime + travelTime
      const cost = distance * option.costPerMile
      const viabilityWindow = option.organViabilityHours[organ]
      const timeUsedHours = totalTime / 60
      const remainingViability = viabilityWindow - timeUsedHours

      return {
        option,
        estimatedTime: Math.round(totalTime),
        estimatedCost: Math.round(cost),
        viabilityWindow: Math.round(remainingViability * 10) / 10,
        feasible: remainingViability > 1, // At least 1 hour buffer
        route: {
          from: "Donor Location",
          to: "Hospital",
          distance,
        },
      }
    })
    .sort((a, b) => a.estimatedTime - b.estimatedTime)
}

// Enhanced matching algorithm considering hospitals
export function calculateMatchScore(
  donorLocation: Coordinates,
  recipientLocation: Coordinates,
  organ: OrganSpecialty,
  urgency: "routine" | "urgent" | "high" | "critical",
  bloodCompatibility: number, // 0-100
): {
  score: number
  hospitalOptions: HospitalMatch[]
  recommendedTransport: TransportPlan | null
  feasible: boolean
} {
  // Find hospitals near recipient
  const recipientHospitals = findHospitalsBySpecialty(organ, recipientLocation, 200)

  if (recipientHospitals.length === 0) {
    return {
      score: 0,
      hospitalOptions: [],
      recommendedTransport: null,
      feasible: false,
    }
  }

  // Calculate best transport option
  const bestHospital = recipientHospitals[0]
  const donorToHospitalPlans = calculateTransportPlans(
    donorLocation,
    bestHospital.hospital.coordinates,
    organ,
    calculateDistance(donorLocation, bestHospital.hospital.coordinates),
  )

  const feasiblePlans = donorToHospitalPlans.filter((plan) => plan.feasible)
  const recommendedTransport = feasiblePlans.length > 0 ? feasiblePlans[0] : null

  // Calculate composite score
  let score = bloodCompatibility * 0.4 // 40% blood compatibility

  // Distance factor (closer is better)
  const distance = bestHospital.distance
  const distanceScore = Math.max(0, 100 - distance * 2) // Penalty for distance
  score += distanceScore * 0.2 // 20% distance

  // Hospital quality factor
  const hospitalScore = bestHospital.successRate
  score += hospitalScore * 0.2 // 20% hospital quality

  // Transport feasibility
  const transportScore = recommendedTransport ? 100 : 0
  score += transportScore * 0.1 // 10% transport feasibility

  // Urgency factor
  const urgencyMultiplier = {
    routine: 1.0,
    urgent: 1.1,
    high: 1.2,
    critical: 1.3,
  }
  score *= urgencyMultiplier[urgency]

  // Time factor (faster transport is better)
  if (recommendedTransport) {
    const timeScore = Math.max(0, 100 - recommendedTransport.estimatedTime / 10)
    score += timeScore * 0.1 // 10% time efficiency
  }

  return {
    score: Math.min(100, Math.round(score)),
    hospitalOptions: recipientHospitals.slice(0, 3), // Top 3 hospitals
    recommendedTransport,
    feasible: recommendedTransport !== null,
  }
}

// Get nearest emergency-capable hospitals
export function getNearestEmergencyHospitals(location: Coordinates, count = 3): HospitalMatch[] {
  return hospitalNetwork
    .filter((hospital) => hospital.emergencyCapable)
    .map((hospital) => ({
      hospital,
      distance: calculateDistance(location, hospital.coordinates),
      transportPlans: [],
      capacity: 0,
      waitTime: 0,
      successRate: 0,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
}

// Format transport time for display
export function formatTransportTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

// Format cost for display
export function formatCost(cost: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cost)
}
