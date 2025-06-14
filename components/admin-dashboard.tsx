"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Heart, Activity, AlertTriangle, CheckCircle, XCircle, Eye, Download, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

export function AdminDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: "1",
      type: "Donor Registration",
      user: "John Smith",
      organ: "Kidney",
      date: "2024-01-20",
      priority: "Normal",
      status: "pending",
      details: {
        email: "john.smith@email.com",
        phone: "+1-555-0123",
        bloodGroup: "O+",
        medicalHistory: "No significant medical history",
        location: "New York, NY",
      },
    },
    {
      id: "2",
      type: "Organ Listing",
      user: "Sarah Johnson",
      organ: "Liver",
      date: "2024-01-19",
      priority: "High",
      status: "pending",
      details: {
        email: "sarah.johnson@email.com",
        phone: "+1-555-0124",
        bloodGroup: "A+",
        medicalHistory: "Excellent health condition",
        location: "Los Angeles, CA",
      },
    },
    {
      id: "3",
      type: "Recipient Request",
      user: "Mike Davis",
      organ: "Heart",
      date: "2024-01-18",
      priority: "Critical",
      status: "pending",
      details: {
        email: "mike.davis@email.com",
        phone: "+1-555-0125",
        bloodGroup: "B+",
        medicalHistory: "Heart failure, urgent transplant needed",
        location: "Chicago, IL",
      },
    },
  ])

  const [recentMatches, setRecentMatches] = useState([
    {
      id: "1",
      donor: "D001",
      recipient: "R001",
      organ: "Kidney",
      compatibility: "95%",
      status: "Approved",
      date: "2024-01-20",
      details: {
        donorName: "Anonymous Donor",
        recipientName: "Patient R001",
        hospital: "City General Hospital",
        surgeryDate: "2024-01-25",
        notes: "Excellent compatibility match",
      },
    },
    {
      id: "2",
      donor: "D002",
      recipient: "R002",
      organ: "Liver",
      compatibility: "88%",
      status: "Pending",
      date: "2024-01-19",
      details: {
        donorName: "Anonymous Donor",
        recipientName: "Patient R002",
        hospital: "Metro Medical Center",
        surgeryDate: "TBD",
        notes: "Awaiting final medical clearance",
      },
    },
  ])

  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: "1",
      type: "Critical",
      message: "Heart recipient with critical urgency needs immediate attention",
      date: "2024-01-20",
      resolved: false,
    },
    {
      id: "2",
      type: "Warning",
      message: "System maintenance scheduled for tonight",
      date: "2024-01-20",
      resolved: false,
    },
  ])

  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1250,
    activeDonors: 450,
    activeRecipients: 320,
    pendingApprovals: pendingApprovals.filter((a) => a.status === "pending").length,
    successfulMatches: 89,
    totalOrgans: 234,
  }

  const handleApprove = (id: string) => {
    setPendingApprovals((prev) => prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item)))
    toast({
      title: "Approval Successful",
      description: "The request has been approved and the user has been notified.",
    })
  }

  const handleReject = (id: string) => {
    setPendingApprovals((prev) => prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item)))
    toast({
      title: "Request Rejected",
      description: "The request has been rejected and the user has been notified.",
      variant: "destructive",
    })
  }

  const handleReview = (item: any) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleViewDetails = (item: any) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleResolveAlert = (id: string) => {
    setSystemAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, resolved: true } : alert)))
    toast({
      title: "Alert Resolved",
      description: "The system alert has been marked as resolved.",
    })
  }

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated with the latest information.",
    })
  }

  const handleExportData = () => {
    // Create CSV data
    const csvData = [
      ["Type", "User", "Organ", "Date", "Priority", "Status"],
      ...pendingApprovals.map((item) => [item.type, item.user, item.organ, item.date, item.priority, item.status]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "admin-dashboard-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Dashboard data has been exported to CSV file.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor and manage the OrganEase platform</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDonors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRecipients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Matches</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successfulMatches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organs</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrgans}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="matches">Recent Matches</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pending Approvals</h2>
              <Badge variant="outline">{pendingApprovals.filter((a) => a.status === "pending").length} items</Badge>
            </div>

            <div className="grid gap-6">
              {pendingApprovals
                .filter((a) => a.status === "pending")
                .map((approval) => (
                  <Card key={approval.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{approval.type}</CardTitle>
                          <CardDescription>
                            User: {approval.user} • {approval.organ}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              approval.priority === "Critical"
                                ? "destructive"
                                : approval.priority === "High"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {approval.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Submitted: {new Date(approval.date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(approval.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(approval.id)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReview(approval)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Matches</h2>

            <div className="grid gap-6">
              {recentMatches.map((match) => (
                <Card key={match.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{match.organ} Match</CardTitle>
                        <CardDescription>
                          Donor {match.donor} ↔ Recipient {match.recipient}
                        </CardDescription>
                      </div>
                      <Badge variant={match.status === "Approved" ? "default" : "secondary"}>{match.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Compatibility: {match.compatibility} • {new Date(match.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(match)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <h2 className="text-2xl font-bold">System Alerts</h2>

            <div className="space-y-4">
              {systemAlerts
                .filter((alert) => !alert.resolved)
                .map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            alert.type === "Critical" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-500">{new Date(alert.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={alert.type === "Critical" ? "destructive" : "default"}>{alert.type}</Badge>
                          <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {systemAlerts.filter((alert) => !alert.resolved).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No active alerts. All systems are running normally.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                    <div className="text-4xl font-bold text-blue-600 mb-2">+15%</div>
                    <div className="text-sm">Growth this month</div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organ Distribution</CardTitle>
                  <CardDescription>Available organs by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex flex-col justify-center space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kidney</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Liver</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Heart</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Match Success Rate</CardTitle>
                  <CardDescription>Successful matches over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                    <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
                    <div className="text-sm">Success rate this quarter</div>
                    <div className="mt-4 text-xs text-gray-400">89 successful matches out of 97 attempts</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Users by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex flex-col justify-center space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New York</span>
                      <span className="font-medium">285 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">California</span>
                      <span className="font-medium">234 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Texas</span>
                      <span className="font-medium">198 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Florida</span>
                      <span className="font-medium">156 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other States</span>
                      <span className="font-medium">377 users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.type || selectedItem?.organ} Details</DialogTitle>
            <DialogDescription>Detailed information and actions</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.details && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {selectedItem.user || selectedItem.donorName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedItem.details.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedItem.details.phone}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedItem.details.location}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Medical Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Blood Group:</strong> {selectedItem.details.bloodGroup}
                      </p>
                      <p>
                        <strong>Medical History:</strong> {selectedItem.details.medicalHistory}
                      </p>
                      {selectedItem.details.hospital && (
                        <p>
                          <strong>Hospital:</strong> {selectedItem.details.hospital}
                        </p>
                      )}
                      {selectedItem.details.surgeryDate && (
                        <p>
                          <strong>Surgery Date:</strong> {selectedItem.details.surgeryDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {selectedItem.details?.notes && (
                <div>
                  <h4 className="font-medium mb-2">Additional Notes</h4>
                  <p className="text-sm text-gray-600">{selectedItem.details.notes}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {selectedItem.status === "pending" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApprove(selectedItem.id)
                        setDialogOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedItem.id)
                        setDialogOpen(false)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
