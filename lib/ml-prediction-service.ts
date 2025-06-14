import type { TransportMission } from "./gps-tracking"

export interface HistoricalTransport {
  id: string
  date: number
  organType: string
  priority: "routine" | "urgent" | "high" | "critical"
  vehicleType: "ambulance" | "helicopter" | "aircraft"
  distance: number
  scheduledDuration: number
  actualDuration: number
  delay: number // minutes
  weather: WeatherCondition
  traffic: TrafficCondition
  timeOfDay: "morning" | "afternoon" | "evening" | "night"
  dayOfWeek: string
  season: "spring" | "summer" | "fall" | "winter"
  driverExperience: number // years
  vehicleAge: number // years
  maintenanceStatus: "excellent" | "good" | "fair" | "poor"
  alerts: number
  success: boolean
  complications: string[]
}

export interface WeatherCondition {
  temperature: number
  humidity: number
  windSpeed: number
  precipitation: number
  visibility: number
  condition: "clear" | "rain" | "snow" | "fog" | "storm"
  severity: number // 0-10
}

export interface TrafficCondition {
  congestionLevel: number // 0-10
  accidents: number
  construction: boolean
  events: boolean
  averageSpeed: number
  severity: "light" | "moderate" | "heavy" | "severe"
}

export interface PredictionModel {
  name: string
  type: "delay" | "success" | "risk" | "optimization"
  accuracy: number
  lastTrained: number
  features: string[]
  version: string
}

export interface DelayPrediction {
  missionId: string
  predictedDelay: number // minutes
  confidence: number // 0-1
  riskFactors: RiskFactor[]
  recommendations: string[]
  alternativeRoutes: RouteOptimization[]
  optimalScheduling: SchedulingRecommendation
}

export interface RiskFactor {
  factor: string
  impact: number // minutes of potential delay
  probability: number // 0-1
  severity: "low" | "medium" | "high" | "critical"
  mitigation: string[]
}

export interface RouteOptimization {
  routeId: string
  description: string
  estimatedTime: number
  delayReduction: number
  riskScore: number
  advantages: string[]
  disadvantages: string[]
}

export interface SchedulingRecommendation {
  optimalDepartureTime: number
  bufferTime: number
  alternativeTimeSlots: number[]
  reasoning: string[]
  expectedSuccess: number
}

export interface PerformanceMetrics {
  totalTransports: number
  successRate: number
  averageDelay: number
  onTimeDelivery: number
  criticalMissed: number
  costEfficiency: number
  resourceUtilization: number
  trends: {
    delayTrend: "improving" | "stable" | "worsening"
    successTrend: "improving" | "stable" | "worsening"
    efficiencyTrend: "improving" | "stable" | "worsening"
  }
}

export interface OptimizationInsight {
  category: "scheduling" | "routing" | "resource" | "maintenance" | "training"
  priority: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  impact: string
  implementation: string[]
  expectedImprovement: number
  cost: "low" | "medium" | "high"
  timeframe: string
}

// Mock historical data for training
export const historicalTransports: HistoricalTransport[] = [
  {
    id: "H001",
    date: Date.now() - 86400000 * 30, // 30 days ago
    organType: "kidney",
    priority: "urgent",
    vehicleType: "ambulance",
    distance: 45.2,
    scheduledDuration: 65,
    actualDuration: 78,
    delay: 13,
    weather: {
      temperature: 72,
      humidity: 65,
      windSpeed: 8,
      precipitation: 0,
      visibility: 10,
      condition: "clear",
      severity: 1,
    },
    traffic: {
      congestionLevel: 6,
      accidents: 1,
      construction: false,
      events: false,
      averageSpeed: 35,
      severity: "moderate",
    },
    timeOfDay: "afternoon",
    dayOfWeek: "Tuesday",
    season: "fall",
    driverExperience: 8,
    vehicleAge: 3,
    maintenanceStatus: "good",
    alerts: 2,
    success: true,
    complications: ["Traffic delay"],
  },
  {
    id: "H002",
    date: Date.now() - 86400000 * 25,
    organType: "heart",
    priority: "critical",
    vehicleType: "helicopter",
    distance: 120.5,
    scheduledDuration: 45,
    actualDuration: 52,
    delay: 7,
    weather: {
      temperature: 58,
      humidity: 80,
      windSpeed: 15,
      precipitation: 0.2,
      visibility: 8,
      condition: "rain",
      severity: 4,
    },
    traffic: {
      congestionLevel: 2,
      accidents: 0,
      construction: false,
      events: false,
      averageSpeed: 85,
      severity: "light",
    },
    timeOfDay: "night",
    dayOfWeek: "Friday",
    season: "fall",
    driverExperience: 12,
    vehicleAge: 2,
    maintenanceStatus: "excellent",
    alerts: 1,
    success: true,
    complications: ["Weather conditions"],
  },
  // Add more historical data...
]

// Machine Learning Prediction Service
export class MLPredictionService {
  private static instance: MLPredictionService
  private models: Map<string, PredictionModel> = new Map()
  private historicalData: HistoricalTransport[] = []
  private performanceCache: Map<string, PerformanceMetrics> = new Map()

  constructor() {
    this.initializeModels()
    this.loadHistoricalData()
  }

  static getInstance(): MLPredictionService {
    if (!MLPredictionService.instance) {
      MLPredictionService.instance = new MLPredictionService()
    }
    return MLPredictionService.instance
  }

  private initializeModels(): void {
    // Initialize ML models
    this.models.set("delay-predictor", {
      name: "Transport Delay Predictor",
      type: "delay",
      accuracy: 0.87,
      lastTrained: Date.now() - 86400000 * 7, // 7 days ago
      features: ["distance", "weather", "traffic", "timeOfDay", "vehicleType", "priority"],
      version: "2.1.0",
    })

    this.models.set("success-predictor", {
      name: "Mission Success Predictor",
      type: "success",
      accuracy: 0.92,
      lastTrained: Date.now() - 86400000 * 5,
      features: ["organType", "priority", "distance", "weather", "driverExperience"],
      version: "1.8.0",
    })

    this.models.set("risk-assessor", {
      name: "Transport Risk Assessor",
      type: "risk",
      accuracy: 0.84,
      lastTrained: Date.now() - 86400000 * 3,
      features: ["weather", "traffic", "vehicleAge", "maintenanceStatus", "timeOfDay"],
      version: "1.5.0",
    })

    this.models.set("route-optimizer", {
      name: "Route Optimization Engine",
      type: "optimization",
      accuracy: 0.89,
      lastTrained: Date.now() - 86400000 * 2,
      features: ["distance", "traffic", "weather", "priority", "timeConstraints"],
      version: "3.0.0",
    })
  }

  private loadHistoricalData(): void {
    this.historicalData = [...historicalTransports]
    // In a real implementation, this would load from a database
  }

  // Predict transport delays
  async predictDelay(
    mission: TransportMission,
    currentConditions: {
      weather: WeatherCondition
      traffic: TrafficCondition
      timeOfDay: string
    },
  ): Promise<DelayPrediction> {
    const features = this.extractFeatures(mission, currentConditions)

    // Simulate ML prediction (in real implementation, this would call actual ML models)
    const baseDelay = this.calculateBaseDelay(features)
    const weatherImpact = this.calculateWeatherImpact(currentConditions.weather)
    const trafficImpact = this.calculateTrafficImpact(currentConditions.traffic)
    const timeImpact = this.calculateTimeOfDayImpact(currentConditions.timeOfDay)

    const predictedDelay = Math.max(0, baseDelay + weatherImpact + trafficImpact + timeImpact)
    const confidence = this.calculateConfidence(features)

    const riskFactors = this.identifyRiskFactors(mission, currentConditions)
    const recommendations = this.generateRecommendations(riskFactors, predictedDelay)
    const alternativeRoutes = this.generateAlternativeRoutes(mission, currentConditions)
    const optimalScheduling = this.optimizeScheduling(mission, predictedDelay, currentConditions)

    return {
      missionId: mission.id,
      predictedDelay,
      confidence,
      riskFactors,
      recommendations,
      alternativeRoutes,
      optimalScheduling,
    }
  }

  // Generate performance analytics
  getPerformanceMetrics(timeframe: "week" | "month" | "quarter" | "year"): PerformanceMetrics {
    const cacheKey = `metrics-${timeframe}`

    if (this.performanceCache.has(cacheKey)) {
      return this.performanceCache.get(cacheKey)!
    }

    const cutoffDate = this.getCutoffDate(timeframe)
    const relevantData = this.historicalData.filter((transport) => transport.date >= cutoffDate)

    const metrics: PerformanceMetrics = {
      totalTransports: relevantData.length,
      successRate: relevantData.filter((t) => t.success).length / relevantData.length,
      averageDelay: relevantData.reduce((sum, t) => sum + t.delay, 0) / relevantData.length,
      onTimeDelivery: relevantData.filter((t) => t.delay <= 5).length / relevantData.length,
      criticalMissed: relevantData.filter((t) => t.priority === "critical" && !t.success).length,
      costEfficiency: this.calculateCostEfficiency(relevantData),
      resourceUtilization: this.calculateResourceUtilization(relevantData),
      trends: this.calculateTrends(relevantData),
    }

    this.performanceCache.set(cacheKey, metrics)
    return metrics
  }

  // Generate optimization insights
  getOptimizationInsights(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = []

    // Analyze scheduling patterns
    const schedulingInsight = this.analyzeSchedulingPatterns()
    if (schedulingInsight) insights.push(schedulingInsight)

    // Analyze routing efficiency
    const routingInsight = this.analyzeRoutingEfficiency()
    if (routingInsight) insights.push(routingInsight)

    // Analyze resource utilization
    const resourceInsight = this.analyzeResourceUtilization()
    if (resourceInsight) insights.push(resourceInsight)

    // Analyze maintenance patterns
    const maintenanceInsight = this.analyzeMaintenancePatterns()
    if (maintenanceInsight) insights.push(maintenanceInsight)

    // Analyze training needs
    const trainingInsight = this.analyzeTrainingNeeds()
    if (trainingInsight) insights.push(trainingInsight)

    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // Optimize transport scheduling
  optimizeTransportSchedule(missions: TransportMission[]): {
    optimizedSchedule: OptimizedMission[]
    improvements: ScheduleImprovement[]
    riskMitigation: RiskMitigation[]
  } {
    const optimizedMissions = missions.map((mission) => this.optimizeSingleMission(mission))
    const improvements = this.calculateScheduleImprovements(missions, optimizedMissions)
    const riskMitigation = this.generateRiskMitigation(optimizedMissions)

    return {
      optimizedSchedule: optimizedMissions,
      improvements,
      riskMitigation,
    }
  }

  // Private helper methods
  private extractFeatures(mission: TransportMission, conditions: any): any {
    return {
      distance: mission.route.totalDistance,
      organType: mission.organType,
      priority: mission.priority,
      vehicleType: mission.vehicleId, // Would map to vehicle type
      weather: conditions.weather.severity,
      traffic: conditions.traffic.congestionLevel,
      timeOfDay: conditions.timeOfDay,
    }
  }

  private calculateBaseDelay(features: any): number {
    // Simulate ML model prediction
    let delay = 0

    // Distance factor
    delay += features.distance * 0.2

    // Priority factor (higher priority = better routing)
    const priorityMultiplier = {
      critical: 0.5,
      high: 0.7,
      urgent: 0.9,
      routine: 1.2,
    }
    delay *= priorityMultiplier[features.priority as keyof typeof priorityMultiplier] || 1

    return Math.max(0, delay)
  }

  private calculateWeatherImpact(weather: WeatherCondition): number {
    let impact = 0

    // Precipitation impact
    impact += weather.precipitation * 10

    // Wind impact
    if (weather.windSpeed > 20) {
      impact += (weather.windSpeed - 20) * 0.5
    }

    // Visibility impact
    if (weather.visibility < 5) {
      impact += (5 - weather.visibility) * 3
    }

    // Condition-specific impact
    const conditionImpact = {
      clear: 0,
      rain: 5,
      snow: 15,
      fog: 10,
      storm: 25,
    }

    impact += conditionImpact[weather.condition] || 0

    return impact
  }

  private calculateTrafficImpact(traffic: TrafficCondition): number {
    let impact = traffic.congestionLevel * 2

    if (traffic.accidents > 0) {
      impact += traffic.accidents * 8
    }

    if (traffic.construction) {
      impact += 12
    }

    if (traffic.events) {
      impact += 15
    }

    return impact
  }

  private calculateTimeOfDayImpact(timeOfDay: string): number {
    const timeImpact = {
      morning: 8, // Rush hour
      afternoon: 5,
      evening: 10, // Rush hour
      night: 2,
    }

    return timeImpact[timeOfDay as keyof typeof timeImpact] || 0
  }

  private calculateConfidence(features: any): number {
    // Simulate confidence calculation based on feature quality
    let confidence = 0.8

    // Adjust based on data quality and model accuracy
    const model = this.models.get("delay-predictor")
    if (model) {
      confidence = model.accuracy * 0.9 // Account for real-world variance
    }

    return Math.min(0.95, Math.max(0.6, confidence))
  }

  private identifyRiskFactors(mission: TransportMission, conditions: any): RiskFactor[] {
    const riskFactors: RiskFactor[] = []

    // Weather risks
    if (conditions.weather.severity > 5) {
      riskFactors.push({
        factor: "Severe Weather",
        impact: conditions.weather.severity * 3,
        probability: 0.8,
        severity: conditions.weather.severity > 7 ? "high" : "medium",
        mitigation: ["Monitor weather updates", "Consider alternative routes", "Prepare backup transport"],
      })
    }

    // Traffic risks
    if (conditions.traffic.congestionLevel > 6) {
      riskFactors.push({
        factor: "Heavy Traffic",
        impact: conditions.traffic.congestionLevel * 2,
        probability: 0.7,
        severity: conditions.traffic.congestionLevel > 8 ? "high" : "medium",
        mitigation: ["Use alternative routes", "Adjust departure time", "Monitor traffic updates"],
      })
    }

    // Critical organ risks
    if (mission.priority === "critical" && mission.organ.viabilityWindow < 6) {
      riskFactors.push({
        factor: "Limited Viability Window",
        impact: 0,
        probability: 0.9,
        severity: "critical",
        mitigation: ["Priority routing", "Emergency protocols", "Backup transport ready"],
      })
    }

    return riskFactors
  }

  private generateRecommendations(riskFactors: RiskFactor[], predictedDelay: number): string[] {
    const recommendations: string[] = []

    if (predictedDelay > 15) {
      recommendations.push("Consider departing 20 minutes earlier than scheduled")
      recommendations.push("Notify receiving hospital of potential delay")
    }

    if (riskFactors.some((rf) => rf.severity === "critical")) {
      recommendations.push("Activate emergency transport protocols")
      recommendations.push("Prepare backup transport vehicle")
    }

    if (riskFactors.some((rf) => rf.factor.includes("Weather"))) {
      recommendations.push("Monitor weather conditions continuously")
      recommendations.push("Consider ground transport if flight conditions deteriorate")
    }

    if (riskFactors.some((rf) => rf.factor.includes("Traffic"))) {
      recommendations.push("Use real-time traffic routing")
      recommendations.push("Consider alternative departure time")
    }

    return recommendations
  }

  private generateAlternativeRoutes(mission: TransportMission, conditions: any): RouteOptimization[] {
    // Simulate route optimization
    return [
      {
        routeId: "ALT-001",
        description: "Highway bypass route",
        estimatedTime: mission.route.estimatedDuration - 8,
        delayReduction: 12,
        riskScore: 3,
        advantages: ["Avoids city traffic", "More predictable timing"],
        disadvantages: ["Longer distance", "Higher fuel cost"],
      },
      {
        routeId: "ALT-002",
        description: "Express lane route",
        estimatedTime: mission.route.estimatedDuration - 5,
        delayReduction: 8,
        riskScore: 2,
        advantages: ["Faster average speed", "Less congestion"],
        disadvantages: ["Toll costs", "Limited access points"],
      },
    ]
  }

  private optimizeScheduling(
    mission: TransportMission,
    predictedDelay: number,
    conditions: any,
  ): SchedulingRecommendation {
    const bufferTime = Math.max(15, predictedDelay * 1.2)
    const optimalDepartureTime = mission.scheduledPickup - bufferTime * 60000

    return {
      optimalDepartureTime,
      bufferTime,
      alternativeTimeSlots: [
        optimalDepartureTime - 1800000, // 30 min earlier
        optimalDepartureTime + 1800000, // 30 min later
      ],
      reasoning: [
        `Buffer time of ${bufferTime} minutes recommended based on predicted delay`,
        "Optimal departure accounts for current traffic and weather conditions",
        "Alternative time slots provide flexibility for scheduling conflicts",
      ],
      expectedSuccess: Math.max(0.7, 0.95 - predictedDelay / 100),
    }
  }

  private getCutoffDate(timeframe: string): number {
    const now = Date.now()
    const msPerDay = 86400000

    switch (timeframe) {
      case "week":
        return now - msPerDay * 7
      case "month":
        return now - msPerDay * 30
      case "quarter":
        return now - msPerDay * 90
      case "year":
        return now - msPerDay * 365
      default:
        return now - msPerDay * 30
    }
  }

  private calculateCostEfficiency(data: HistoricalTransport[]): number {
    // Simulate cost efficiency calculation
    const successfulTransports = data.filter((t) => t.success)
    const totalCost = data.length * 1000 // Assume $1000 per transport
    const successValue = successfulTransports.length * 1500 // Value of successful transport

    return successValue / totalCost
  }

  private calculateResourceUtilization(data: HistoricalTransport[]): number {
    // Simulate resource utilization calculation
    const totalCapacity = data.length * 8 // 8 hours per day capacity
    const actualUsage = data.reduce((sum, t) => sum + t.actualDuration / 60, 0)

    return actualUsage / totalCapacity
  }

  private calculateTrends(data: HistoricalTransport[]): any {
    // Simulate trend calculation
    const recentData = data.slice(-Math.floor(data.length / 2))
    const olderData = data.slice(0, Math.floor(data.length / 2))

    const recentAvgDelay = recentData.reduce((sum, t) => sum + t.delay, 0) / recentData.length
    const olderAvgDelay = olderData.reduce((sum, t) => sum + t.delay, 0) / olderData.length

    const delayTrend =
      recentAvgDelay < olderAvgDelay ? "improving" : recentAvgDelay > olderAvgDelay ? "worsening" : "stable"

    return {
      delayTrend,
      successTrend: "improving", // Simplified
      efficiencyTrend: "stable", // Simplified
    }
  }

  private analyzeSchedulingPatterns(): OptimizationInsight | null {
    // Analyze historical data for scheduling patterns
    const morningTransports = this.historicalData.filter((t) => t.timeOfDay === "morning")
    const morningDelays = morningTransports.reduce((sum, t) => sum + t.delay, 0) / morningTransports.length

    if (morningDelays > 15) {
      return {
        category: "scheduling",
        priority: "high",
        title: "Morning Rush Hour Impact",
        description: "Morning transports experience 40% more delays than other times",
        impact: "Average 18-minute delay during morning hours",
        implementation: [
          "Schedule critical transports before 7 AM or after 10 AM",
          "Add 25-minute buffer for morning transports",
          "Consider overnight scheduling for non-urgent cases",
        ],
        expectedImprovement: 35,
        cost: "low",
        timeframe: "2 weeks",
      }
    }

    return null
  }

  private analyzeRoutingEfficiency(): OptimizationInsight | null {
    return {
      category: "routing",
      priority: "medium",
      title: "Route Optimization Opportunity",
      description: "Alternative routes could reduce average transport time by 12%",
      impact: "Save 8 minutes per transport on average",
      implementation: [
        "Implement dynamic routing based on real-time traffic",
        "Pre-calculate alternative routes for all major hospital pairs",
        "Train drivers on optimal route selection",
      ],
      expectedImprovement: 12,
      cost: "medium",
      timeframe: "1 month",
    }
  }

  private analyzeResourceUtilization(): OptimizationInsight | null {
    return {
      category: "resource",
      priority: "high",
      title: "Vehicle Utilization Imbalance",
      description: "Helicopter utilization is 23% below optimal while ambulances are overbooked",
      impact: "Reduce wait times and improve response capability",
      implementation: [
        "Rebalance transport assignments based on distance and urgency",
        "Cross-train pilots for different aircraft types",
        "Implement dynamic vehicle allocation system",
      ],
      expectedImprovement: 28,
      cost: "high",
      timeframe: "3 months",
    }
  }

  private analyzeMaintenancePatterns(): OptimizationInsight | null {
    return {
      category: "maintenance",
      priority: "medium",
      title: "Predictive Maintenance Opportunity",
      description: "Vehicles with 'fair' maintenance status have 60% more delays",
      impact: "Prevent unexpected breakdowns and delays",
      implementation: [
        "Implement predictive maintenance scheduling",
        "Increase maintenance frequency for high-usage vehicles",
        "Create maintenance buffer in scheduling",
      ],
      expectedImprovement: 20,
      cost: "medium",
      timeframe: "6 weeks",
    }
  }

  private analyzeTrainingNeeds(): OptimizationInsight | null {
    return {
      category: "training",
      priority: "low",
      title: "Driver Experience Impact",
      description: "Drivers with <5 years experience have 25% more delays",
      impact: "Improve overall transport reliability and efficiency",
      implementation: [
        "Pair experienced drivers with new drivers for critical transports",
        "Implement advanced route training program",
        "Create driver performance feedback system",
      ],
      expectedImprovement: 15,
      cost: "low",
      timeframe: "2 months",
    }
  }

  private optimizeSingleMission(mission: TransportMission): OptimizedMission {
    // Simulate mission optimization
    return {
      ...mission,
      optimizedDepartureTime: mission.scheduledPickup - 900000, // 15 min earlier
      recommendedRoute: "ALT-001",
      bufferTime: 20,
      riskScore: 3,
      optimizationReason: "Adjusted for predicted traffic delays",
    }
  }

  private calculateScheduleImprovements(
    original: TransportMission[],
    optimized: OptimizedMission[],
  ): ScheduleImprovement[] {
    return [
      {
        category: "timing",
        improvement: "15% reduction in average delays",
        impact: "Save 12 minutes per transport",
        confidence: 0.85,
      },
      {
        category: "success_rate",
        improvement: "8% increase in on-time deliveries",
        impact: "Improve patient outcomes",
        confidence: 0.78,
      },
    ]
  }

  private generateRiskMitigation(missions: OptimizedMission[]): RiskMitigation[] {
    return [
      {
        risk: "Weather delays",
        mitigation: "Alternative routing and timing adjustments",
        effectiveness: 0.7,
        cost: "low",
      },
      {
        risk: "Traffic congestion",
        mitigation: "Dynamic departure time optimization",
        effectiveness: 0.8,
        cost: "low",
      },
    ]
  }
}

// Additional interfaces
export interface OptimizedMission extends TransportMission {
  optimizedDepartureTime: number
  recommendedRoute: string
  bufferTime: number
  riskScore: number
  optimizationReason: string
}

export interface ScheduleImprovement {
  category: string
  improvement: string
  impact: string
  confidence: number
}

export interface RiskMitigation {
  risk: string
  mitigation: string
  effectiveness: number
  cost: string
}

// Utility functions
export function formatPredictionConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}

export function formatDelayPrediction(delay: number): string {
  if (delay < 1) return "On time"
  if (delay < 60) return `${Math.round(delay)} min delay`
  const hours = Math.floor(delay / 60)
  const minutes = Math.round(delay % 60)
  return `${hours}h ${minutes}m delay`
}

export function getRiskColor(severity: string): string {
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

export function getOptimizationPriorityColor(priority: string): string {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-blue-100 text-blue-800 border-blue-200"
  }
}
