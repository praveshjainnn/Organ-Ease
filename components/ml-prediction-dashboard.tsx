"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  BarChart3,
  Lightbulb,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  MLPredictionService,
  type DelayPrediction,
  type PerformanceMetrics,
  type OptimizationInsight,
  formatPredictionConfidence,
  formatDelayPrediction,
  getRiskColor,
  getOptimizationPriorityColor,
} from "@/lib/ml-prediction-service"
import { GPSTrackingService } from "@/lib/gps-tracking"

export function MLPredictionDashboard() {
  const [predictions, setPredictions] = useState<DelayPrediction[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [optimizationInsights, setOptimizationInsights] = useState<OptimizationInsight[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "quarter" | "year">("month")
  const [mlService] = useState(() => MLPredictionService.getInstance())
  const [gpsService] = useState(() => GPSTrackingService.getInstance())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [selectedTimeframe])

  const loadDashboardData = async () => {
    setIsLoading(true)

    try {
      // Load active missions and generate predictions
      const activeMissions = gpsService.getActiveMissions()
      const newPredictions: DelayPrediction[] = []

      for (const mission of activeMissions) {
        // Simulate current conditions
        const currentConditions = {
          weather: {
            temperature: 68,
            humidity: 55,
            windSpeed: 12,
            precipitation: 0,
            visibility: 10,
            condition: "clear" as const,
            severity: 2,
          },
          traffic: {
            congestionLevel: 4,
            accidents: 0,
            construction: false,
            events: false,
            averageSpeed: 45,
            severity: "moderate" as const,
          },
          timeOfDay: "afternoon",
        }

        const prediction = await mlService.predictDelay(mission, currentConditions)
        newPredictions.push(prediction)
      }

      setPredictions(newPredictions)
      setPerformanceMetrics(mlService.getPerformanceMetrics(selectedTimeframe))
      setOptimizationInsights(mlService.getOptimizationInsights())
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptimizeSchedule = () => {
    const activeMissions = gpsService.getActiveMissions()
    const optimization = mlService.optimizeTransportSchedule(activeMissions)

    // In a real implementation, this would update the actual schedule
    console.log("Schedule optimization:", optimization)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading ML predictions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ML Prediction Dashboard</h1>
          <p className="text-gray-600">AI-powered transport optimization and delay prediction</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOptimizeSchedule} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Optimize Schedule
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      {performanceMetrics && (
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(performanceMetrics.successRate * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {performanceMetrics.trends.successTrend}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delay</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{Math.round(performanceMetrics.averageDelay)}m</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {performanceMetrics.trends.delayTrend}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(performanceMetrics.onTimeDelivery * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Within 5 minutes of schedule</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Missed</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{performanceMetrics.criticalMissed}</div>
              <p className="text-xs text-muted-foreground">Critical transports failed</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Delay Predictions</TabsTrigger>
          <TabsTrigger value="insights">Optimization Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="models">ML Models</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Active Transport Predictions
              </CardTitle>
              <CardDescription>AI-powered delay predictions for current missions</CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Predictions</h3>
                  <p className="text-gray-600 dark:text-gray-400">No active missions to predict</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((prediction) => (
                    <PredictionCard key={prediction.missionId} prediction={prediction} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Optimization Insights
              </CardTitle>
              <CardDescription>AI-generated recommendations for improving transport efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationInsights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Timeframe:</label>
            <div className="flex gap-2">
              {(["week", "month", "quarter", "year"] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {performanceMetrics && <PerformanceAnalytics metrics={performanceMetrics} />}
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <ModelStatus />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PredictionCardProps {
  prediction: DelayPrediction
}

function PredictionCard({ prediction }: PredictionCardProps) {
  const highRiskFactors = prediction.riskFactors.filter((rf) => rf.severity === "high" || rf.severity === "critical")

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium">Mission {prediction.missionId}</h4>
          <p className="text-sm text-gray-600">
            Predicted delay: <span className="font-medium">{formatDelayPrediction(prediction.predictedDelay)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Confidence: {formatPredictionConfidence(prediction.confidence)}</Badge>
          {highRiskFactors.length > 0 && <Badge variant="destructive">{highRiskFactors.length} High Risk</Badge>}
        </div>
      </div>

      <div className="space-y-3">
        {/* Risk Factors */}
        {prediction.riskFactors.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-2">Risk Factors</h5>
            <div className="space-y-2">
              {prediction.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${getRiskColor(risk.severity)}`} />
                    <span>{risk.factor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">+{risk.impact}min</span>
                    <Badge variant="outline" className={getRiskColor(risk.severity)}>
                      {risk.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {prediction.recommendations.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-2">Recommendations</h5>
            <ul className="text-sm space-y-1">
              {prediction.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Optimal Scheduling */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h5 className="text-sm font-medium mb-2">Optimal Scheduling</h5>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Recommended departure:</span>
              <p className="font-medium">
                {new Date(prediction.optimalScheduling.optimalDepartureTime).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Buffer time:</span>
              <p className="font-medium">{prediction.optimalScheduling.bufferTime} minutes</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-600">Expected success rate:</span>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={prediction.optimalScheduling.expectedSuccess * 100} className="flex-1 h-2" />
              <span className="text-sm font-medium">
                {Math.round(prediction.optimalScheduling.expectedSuccess * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface InsightCardProps {
  insight: OptimizationInsight
}

function InsightCard({ insight }: InsightCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{insight.title}</h4>
            <Badge className={getOptimizationPriorityColor(insight.priority)}>{insight.priority}</Badge>
          </div>
          <p className="text-sm text-gray-600">{insight.description}</p>
        </div>
        <Badge variant="outline" className="capitalize">
          {insight.category}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className="text-sm font-medium mb-1">Expected Impact</h5>
          <p className="text-sm">{insight.impact}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-green-600 font-medium">+{insight.expectedImprovement}% improvement</span>
            <span className="text-gray-600">Cost: {insight.cost}</span>
            <span className="text-gray-600">Timeline: {insight.timeframe}</span>
          </div>
        </div>

        <div>
          <h5 className="text-sm font-medium mb-2">Implementation Steps</h5>
          <ul className="text-sm space-y-1">
            {insight.implementation.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 font-medium">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

interface PerformanceAnalyticsProps {
  metrics: PerformanceMetrics
}

function PerformanceAnalytics({ metrics }: PerformanceAnalyticsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transport Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Success Rate</span>
                <span>{Math.round(metrics.successRate * 100)}%</span>
              </div>
              <Progress value={metrics.successRate * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>On-Time Delivery</span>
                <span>{Math.round(metrics.onTimeDelivery * 100)}%</span>
              </div>
              <Progress value={metrics.onTimeDelivery * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Resource Utilization</span>
                <span>{Math.round(metrics.resourceUtilization * 100)}%</span>
              </div>
              <Progress value={metrics.resourceUtilization * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Cost Efficiency</span>
                <span>{metrics.costEfficiency.toFixed(2)}x</span>
              </div>
              <Progress value={Math.min(100, metrics.costEfficiency * 50)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Delay Trend</span>
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`h-4 w-4 ${
                    metrics.trends.delayTrend === "improving"
                      ? "text-green-500"
                      : metrics.trends.delayTrend === "worsening"
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                />
                <span className="text-sm capitalize">{metrics.trends.delayTrend}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Success Trend</span>
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`h-4 w-4 ${
                    metrics.trends.successTrend === "improving"
                      ? "text-green-500"
                      : metrics.trends.successTrend === "worsening"
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                />
                <span className="text-sm capitalize">{metrics.trends.successTrend}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Efficiency Trend</span>
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`h-4 w-4 ${
                    metrics.trends.efficiencyTrend === "improving"
                      ? "text-green-500"
                      : metrics.trends.efficiencyTrend === "worsening"
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                />
                <span className="text-sm capitalize">{metrics.trends.efficiencyTrend}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Key Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Transports</span>
                <p className="font-medium">{metrics.totalTransports}</p>
              </div>
              <div>
                <span className="text-gray-600">Average Delay</span>
                <p className="font-medium">{Math.round(metrics.averageDelay)} min</p>
              </div>
              <div>
                <span className="text-gray-600">Critical Missed</span>
                <p className="font-medium text-red-600">{metrics.criticalMissed}</p>
              </div>
              <div>
                <span className="text-gray-600">Cost Efficiency</span>
                <p className="font-medium">{metrics.costEfficiency.toFixed(2)}x</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ModelStatus() {
  const [mlService] = useState(() => MLPredictionService.getInstance())

  // In a real implementation, this would fetch actual model status
  const models = [
    {
      name: "Transport Delay Predictor",
      type: "delay",
      accuracy: 0.87,
      lastTrained: "7 days ago",
      status: "active",
      version: "2.1.0",
    },
    {
      name: "Mission Success Predictor",
      type: "success",
      accuracy: 0.92,
      lastTrained: "5 days ago",
      status: "active",
      version: "1.8.0",
    },
    {
      name: "Transport Risk Assessor",
      type: "risk",
      accuracy: 0.84,
      lastTrained: "3 days ago",
      status: "active",
      version: "1.5.0",
    },
    {
      name: "Route Optimization Engine",
      type: "optimization",
      accuracy: 0.89,
      lastTrained: "2 days ago",
      status: "active",
      version: "3.0.0",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            ML Model Status
          </CardTitle>
          <CardDescription>Current status and performance of machine learning models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map((model, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{model.type} prediction model</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">v{model.version}</Badge>
                    <Badge className="bg-green-100 text-green-800">{model.status}</Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Accuracy</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={model.accuracy * 100} className="flex-1 h-2" />
                      <span className="font-medium">{Math.round(model.accuracy * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Trained</span>
                    <p className="font-medium">{model.lastTrained}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status</span>
                    <p className="font-medium text-green-600 capitalize">{model.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Training Schedule</CardTitle>
          <CardDescription>Automated retraining schedule for continuous improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <h4 className="font-medium">Daily Model Updates</h4>
                <p className="text-sm text-gray-600">Incremental learning from new transport data</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Automated</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <h4 className="font-medium">Weekly Full Retraining</h4>
                <p className="text-sm text-gray-600">Complete model retraining with historical data</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <h4 className="font-medium">Performance Monitoring</h4>
                <p className="text-sm text-gray-600">Continuous accuracy and drift detection</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
