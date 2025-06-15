"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Package, Calendar, MapPin, Thermometer, Clock, Trash2, Edit, Search } from "lucide-react"

interface InventoryItem {
  id: string
  organType: string
  bloodGroup: string
  donorId: string
  donorName: string
  location: string
  harvestDate: string
  expiryDate: string
  temperature: string
  status: "available" | "reserved" | "transported" | "expired"
  priority: "normal" | "high" | "critical"
  notes: string
  storageConditions: string
  transportRequirements: string
  createdAt: string
}

export function InventoryInputForm() {
  const [formData, setFormData] = useState({
    organType: "",
    bloodGroup: "",
    donorId: "",
    donorName: "",
    location: "",
    harvestDate: "",
    expiryDate: "",
    temperature: "",
    priority: "normal",
    notes: "",
    storageConditions: "",
    transportRequirements: "",
  })
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilters, setSearchFilters] = useState({
    organType: "",
    bloodGroup: "",
    status: "",
    priority: "",
    location: "",
    donorName: "",
  })
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Load inventory on component mount
  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem("organease_inventory") || "[]")

    // If no inventory exists, add sample data
    if (storedInventory.length === 0) {
      const sampleInventory: InventoryItem[] = [
        {
          id: "1",
          organType: "kidney",
          bloodGroup: "O+",
          donorId: "DON-2025-001",
          donorName: "Rajesh Kumar",
          location: "AIIMS Delhi - Renal Storage Unit A1 (28.5665°N, 77.2072°E)",
          harvestDate: "2025-01-15T08:30:00",
          expiryDate: "2025-01-18T08:30:00",
          temperature: "4",
          status: "available",
          priority: "high",
          notes: "Excellent condition, compatible with multiple recipients",
          storageConditions: "Hypothermic machine perfusion, optimal preservation",
          transportRequirements: "Temperature-controlled transport, max 6 hours",
          createdAt: "2025-01-15T08:45:00.000Z",
        },
        {
          id: "2",
          organType: "liver",
          bloodGroup: "A+",
          donorId: "DON-2025-002",
          donorName: "Priya Sharma",
          location: "Apollo Hospital Chennai - Hepatic Storage B2 (13.0827°N, 80.2707°E)",
          harvestDate: "2025-01-14T14:15:00",
          expiryDate: "2025-01-16T14:15:00",
          temperature: "2",
          status: "reserved",
          priority: "critical",
          notes: "Reserved for pediatric recipient, excellent match",
          storageConditions: "Static cold storage with UW solution",
          transportRequirements: "Immediate transport required, pediatric team ready",
          createdAt: "2025-01-14T14:30:00.000Z",
        },
        {
          id: "3",
          organType: "heart",
          bloodGroup: "B-",
          donorId: "DON-2025-003",
          donorName: "Arjun Patel",
          location: "Fortis Escorts Heart Institute Delhi - Cardiac Unit C1 (28.5494°N, 77.2001°E)",
          harvestDate: "2025-01-15T11:20:00",
          expiryDate: "2025-01-15T17:20:00",
          temperature: "4",
          status: "transported",
          priority: "critical",
          notes: "Emergency transport to Narayana Health Bangalore",
          storageConditions: "Continuous perfusion system active",
          transportRequirements: "Air transport with medical team, ETA 2 hours",
          createdAt: "2025-01-15T11:35:00.000Z",
        },
        {
          id: "4",
          organType: "kidney",
          bloodGroup: "AB+",
          donorId: "DON-2025-004",
          donorName: "Sneha Reddy",
          location: "King George Hospital Visakhapatnam - Storage D3 (17.6868°N, 83.2185°E)",
          harvestDate: "2025-01-13T16:45:00",
          expiryDate: "2025-01-16T16:45:00",
          temperature: "3",
          status: "available",
          priority: "normal",
          notes: "Second kidney from dual donation, good viability",
          storageConditions: "Machine perfusion with oxygenated solution",
          transportRequirements: "Ground transport acceptable, 4-hour window",
          createdAt: "2025-01-13T17:00:00.000Z",
        },
        {
          id: "5",
          organType: "lungs",
          bloodGroup: "O-",
          donorId: "DON-2025-005",
          donorName: "Vikram Singh",
          location: "PGI Chandigarh - Pulmonary Storage E1 (30.7333°N, 76.7794°E)",
          harvestDate: "2025-01-15T09:10:00",
          expiryDate: "2025-01-15T21:10:00",
          temperature: "8",
          status: "available",
          priority: "high",
          notes: "Bilateral lung transplant ready, excellent function tests",
          storageConditions: "Ex-vivo lung perfusion system running",
          transportRequirements: "Specialized lung transport team required",
          createdAt: "2025-01-15T09:25:00.000Z",
        },
        {
          id: "6",
          organType: "liver",
          bloodGroup: "O+",
          donorId: "DON-2025-006",
          donorName: "Kavya Nair",
          location: "SCTIMST Trivandrum - Hepatic Storage F2 (8.5241°N, 76.9366°E)",
          harvestDate: "2025-01-12T13:30:00",
          expiryDate: "2025-01-14T13:30:00",
          temperature: "1",
          status: "expired",
          priority: "high",
          notes: "Expired due to transport delays, autopsy scheduled",
          storageConditions: "Cold storage maintained until expiry",
          transportRequirements: "N/A - Expired",
          createdAt: "2025-01-12T13:45:00.000Z",
        },
        {
          id: "7",
          organType: "pancreas",
          bloodGroup: "A-",
          donorId: "DON-2025-007",
          donorName: "Rohit Gupta",
          location: "SGPGIMS Lucknow - Endocrine Storage G1 (26.8467°N, 80.9462°E)",
          harvestDate: "2025-01-15T07:20:00",
          expiryDate: "2025-01-17T07:20:00",
          temperature: "4",
          status: "available",
          priority: "normal",
          notes: "Suitable for pancreas-kidney transplant combination",
          storageConditions: "Two-layer method with UW and HTK solutions",
          transportRequirements: "Coordinate with kidney transport if combined",
          createdAt: "2025-01-15T07:35:00.000Z",
        },
        {
          id: "8",
          organType: "cornea",
          bloodGroup: "B+",
          donorId: "DON-2025-008",
          donorName: "Anita Joshi",
          location: "LV Prasad Eye Institute Hyderabad - Storage H1 (17.4065°N, 78.4772°E)",
          harvestDate: "2025-01-14T10:15:00",
          expiryDate: "2025-01-28T10:15:00",
          temperature: "4",
          status: "reserved",
          priority: "normal",
          notes: "Bilateral corneas, reserved for two separate recipients",
          storageConditions: "Optisol-GS preservation medium",
          transportRequirements: "Standard eye bank transport protocols",
          createdAt: "2025-01-14T10:30:00.000Z",
        },
        {
          id: "9",
          organType: "kidney",
          bloodGroup: "A+",
          donorId: "DON-2025-009",
          donorName: "Suresh Menon",
          location: "Christian Medical College Vellore - Renal Storage I2 (12.9165°N, 79.1325°E)",
          harvestDate: "2025-01-15T15:40:00",
          expiryDate: "2025-01-18T15:40:00",
          temperature: "3",
          status: "available",
          priority: "critical",
          notes: "Perfect HLA match found, recipient being prepared",
          storageConditions: "Hypothermic machine perfusion with excellent parameters",
          transportRequirements: "Immediate transport once recipient ready",
          createdAt: "2025-01-15T15:55:00.000Z",
        },
        {
          id: "10",
          organType: "heart",
          bloodGroup: "AB-",
          donorId: "DON-2025-010",
          donorName: "Deepika Rao",
          location: "Narayana Health Bangalore - Cardiac Storage J1 (12.9716°N, 77.5946°E)",
          harvestDate: "2025-01-15T12:00:00",
          expiryDate: "2025-01-15T18:00:00",
          temperature: "4",
          status: "transported",
          priority: "critical",
          notes: "En route to recipient, ETA 45 minutes",
          storageConditions: "Portable heart perfusion system active",
          transportRequirements: "Helicopter transport with cardiac team",
          createdAt: "2025-01-15T12:15:00.000Z",
        },
        {
          id: "11",
          organType: "bone",
          bloodGroup: "O+",
          donorId: "DON-2025-011",
          donorName: "Manoj Tiwari",
          location: "AIIMS Rishikesh - Tissue Bank Storage K1 (30.0668°N, 78.2905°E)",
          harvestDate: "2025-01-10T09:30:00",
          expiryDate: "2026-01-10T09:30:00",
          temperature: "-80",
          status: "available",
          priority: "normal",
          notes: "Femoral head and tibial grafts available",
          storageConditions: "Deep freeze storage, sterile processing complete",
          transportRequirements: "Dry ice transport, standard tissue protocols",
          createdAt: "2025-01-10T10:00:00.000Z",
        },
        {
          id: "12",
          organType: "skin",
          bloodGroup: "B+",
          donorId: "DON-2025-012",
          donorName: "Ritu Agarwal",
          location: "Safdarjung Hospital Delhi - Skin Bank L1 (28.5706°N, 77.2094°E)",
          harvestDate: "2025-01-11T14:20:00",
          expiryDate: "2025-07-11T14:20:00",
          temperature: "-70",
          status: "available",
          priority: "high",
          notes: "Large surface area available for burn victims",
          storageConditions: "Cryopreserved with glycerol, multiple sheets",
          transportRequirements: "Frozen transport required, burn unit coordination",
          createdAt: "2025-01-11T14:45:00.000Z",
        },
      ]

      localStorage.setItem("organease_inventory", JSON.stringify(sampleInventory))
      setInventory(sampleInventory)
    } else {
      setInventory(storedInventory)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const existingInventory = JSON.parse(localStorage.getItem("organease_inventory") || "[]")

      if (editingId) {
        // Update existing item
        const updatedInventory = existingInventory.map((item: InventoryItem) =>
          item.id === editingId
            ? { ...item, ...formData, priority: formData.priority as "normal" | "high" | "critical" }
            : item,
        )
        localStorage.setItem("organease_inventory", JSON.stringify(updatedInventory))
        setInventory(updatedInventory)
        setEditingId(null)
        toast({
          title: "Inventory item updated successfully",
          description: `${formData.organType} from ${formData.donorName} has been updated`,
        })
      } else {
        // Add new item
        const newItem: InventoryItem = {
          id: Date.now().toString(),
          ...formData,
          status: "available",
          priority: formData.priority as "normal" | "high" | "critical",
          createdAt: new Date().toISOString(),
        }

        const updatedInventory = [...existingInventory, newItem]
        localStorage.setItem("organease_inventory", JSON.stringify(updatedInventory))
        setInventory(updatedInventory)

        toast({
          title: "Inventory item added successfully",
          description: `${formData.organType} from ${formData.donorName} has been added to inventory`,
        })
      }

      // Reset form
      setFormData({
        organType: "",
        bloodGroup: "",
        donorId: "",
        donorName: "",
        location: "",
        harvestDate: "",
        expiryDate: "",
        temperature: "",
        priority: "normal",
        notes: "",
        storageConditions: "",
        transportRequirements: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inventory item",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      organType: item.organType,
      bloodGroup: item.bloodGroup,
      donorId: item.donorId,
      donorName: item.donorName,
      location: item.location,
      harvestDate: item.harvestDate,
      expiryDate: item.expiryDate,
      temperature: item.temperature,
      priority: item.priority,
      notes: item.notes,
      storageConditions: item.storageConditions,
      transportRequirements: item.transportRequirements,
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = (id: string) => {
    const updatedInventory = inventory.filter((item) => item.id !== id)
    localStorage.setItem("organease_inventory", JSON.stringify(updatedInventory))
    setInventory(updatedInventory)
    toast({
      title: "Item deleted",
      description: "Inventory item has been removed",
    })
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedInventory = inventory.map((item) =>
      item.id === id ? { ...item, status: newStatus as "available" | "reserved" | "transported" | "expired" } : item,
    )
    localStorage.setItem("organease_inventory", JSON.stringify(updatedInventory))
    setInventory(updatedInventory)
    toast({
      title: "Status updated",
      description: `Item status changed to ${newStatus}`,
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      default:
        return "bg-green-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      case "transported":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchFilters({
      organType: "",
      bloodGroup: "",
      status: "",
      priority: "",
      location: "",
      donorName: "",
    })
  }

  const exportFilteredData = () => {
    const csvContent = [
      [
        "Organ Type",
        "Blood Group",
        "Donor Name",
        "Donor ID",
        "Location",
        "Status",
        "Priority",
        "Harvest Date",
        "Expiry Date",
        "Temperature",
        "Notes",
      ],
      ...inventory.map((item) => [
        item.organType,
        item.bloodGroup,
        item.donorName,
        item.donorId,
        item.location,
        item.status,
        item.priority,
        new Date(item.harvestDate).toLocaleDateString(),
        new Date(item.expiryDate).toLocaleDateString(),
        item.temperature + "°C",
        item.notes,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inventory-filtered-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export completed",
      description: `Exported ${inventory.length} items to CSV`,
    })
  }

  const filteredInventory = inventory
    .filter((item) => {
      // Text search across multiple fields
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        item.organType.toLowerCase().includes(searchLower) ||
        item.donorName.toLowerCase().includes(searchLower) ||
        item.donorId.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        item.notes.toLowerCase().includes(searchLower)

      // Filter by specific criteria
      const matchesFilters =
        (searchFilters.organType === "" || item.organType === searchFilters.organType) &&
        (searchFilters.bloodGroup === "" || item.bloodGroup === searchFilters.bloodGroup) &&
        (searchFilters.status === "" || item.status === searchFilters.status) &&
        (searchFilters.priority === "" || item.priority === searchFilters.priority) &&
        (searchFilters.location === "" || item.location.toLowerCase().includes(searchFilters.location.toLowerCase())) &&
        (searchFilters.donorName === "" || item.donorName.toLowerCase().includes(searchFilters.donorName.toLowerCase()))

      // Apply main filter dropdown (separate from search filters)
      const matchesMainFilter = filter === "all" || item.status === filter

      return matchesSearch && matchesFilters && matchesMainFilter
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof InventoryItem]
      let bValue = b[sortBy as keyof InventoryItem]

      // Handle date sorting
      if (sortBy === "createdAt" || sortBy === "harvestDate" || sortBy === "expiryDate") {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const stats = {
    total: inventory.length,
    available: inventory.filter((item) => item.status === "available").length,
    reserved: inventory.filter((item) => item.status === "reserved").length,
    transported: inventory.filter((item) => item.status === "transported").length,
    expired: inventory.filter((item) => item.status === "expired").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
            <div className="text-sm text-gray-600">Reserved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.transported}</div>
            <div className="text-sm text-gray-600">Transported</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </CardContent>
        </Card>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? "Edit Organ in Inventory" : "Add Organ to Inventory"}
          </CardTitle>
          <CardDescription>
            {editingId ? "Update organ details" : "Enter organ details to add to the inventory management system"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organType">Organ Type</Label>
                <Select
                  value={formData.organType}
                  onValueChange={(value) => handleInputChange("organType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organ type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kidney">Kidney</SelectItem>
                    <SelectItem value="liver">Liver</SelectItem>
                    <SelectItem value="heart">Heart</SelectItem>
                    <SelectItem value="lungs">Lungs</SelectItem>
                    <SelectItem value="pancreas">Pancreas</SelectItem>
                    <SelectItem value="cornea">Cornea</SelectItem>
                    <SelectItem value="bone">Bone</SelectItem>
                    <SelectItem value="skin">Skin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) => handleInputChange("bloodGroup", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange("priority", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="donorId">Donor ID</Label>
                <Input
                  id="donorId"
                  placeholder="Enter donor ID"
                  value={formData.donorId}
                  onChange={(e) => handleInputChange("donorId", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorName">Donor Name</Label>
                <Input
                  id="donorName"
                  placeholder="Enter donor name"
                  value={formData.donorName}
                  onChange={(e) => handleInputChange("donorName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  placeholder="Enter storage location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Storage Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="Enter temperature"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date & Time</Label>
                <Input
                  id="harvestDate"
                  type="datetime-local"
                  value={formData.harvestDate}
                  onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date & Time</Label>
                <Input
                  id="expiryDate"
                  type="datetime-local"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageConditions">Storage Conditions</Label>
              <Textarea
                id="storageConditions"
                placeholder="Describe storage conditions and requirements"
                value={formData.storageConditions}
                onChange={(e) => handleInputChange("storageConditions", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportRequirements">Transport Requirements</Label>
              <Textarea
                id="transportRequirements"
                placeholder="Special transport requirements or instructions"
                value={formData.transportRequirements}
                onChange={(e) => handleInputChange("transportRequirements", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes or special instructions"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                    ? "Update Inventory"
                    : "Add to Inventory"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      organType: "",
                      bloodGroup: "",
                      donorId: "",
                      donorName: "",
                      location: "",
                      harvestDate: "",
                      expiryDate: "",
                      temperature: "",
                      priority: "normal",
                      notes: "",
                      storageConditions: "",
                      transportRequirements: "",
                    })
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Advanced Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Inventory
          </CardTitle>
          <CardDescription>Search and filter inventory items using multiple criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by organ type, donor name, ID, location, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="default"
              onClick={() =>
                toast({
                  title: "Search executed",
                  description: `Found ${filteredInventory.length} matching items`,
                })
              }
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={clearSearch}>
              Clear All
            </Button>
            <Button variant="outline" onClick={exportFilteredData}>
              Export Results
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              value={searchFilters.organType || "all"}
              onValueChange={(value) =>
                setSearchFilters((prev) => ({ ...prev, organType: value === "all" ? "" : value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Organ Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organs</SelectItem>
                <SelectItem value="kidney">Kidney</SelectItem>
                <SelectItem value="liver">Liver</SelectItem>
                <SelectItem value="heart">Heart</SelectItem>
                <SelectItem value="lungs">Lungs</SelectItem>
                <SelectItem value="pancreas">Pancreas</SelectItem>
                <SelectItem value="cornea">Cornea</SelectItem>
                <SelectItem value="bone">Bone</SelectItem>
                <SelectItem value="skin">Skin</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchFilters.bloodGroup || "all"}
              onValueChange={(value) =>
                setSearchFilters((prev) => ({ ...prev, bloodGroup: value === "all" ? "" : value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Groups</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchFilters.status || "all"}
              onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, status: value === "all" ? "" : value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="transported">Transported</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchFilters.priority || "all"}
              onValueChange={(value) =>
                setSearchFilters((prev) => ({ ...prev, priority: value === "all" ? "" : value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Search Inputs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search by location..."
              value={searchFilters.location}
              onChange={(e) => setSearchFilters((prev) => ({ ...prev, location: e.target.value }))}
            />

            <Input
              placeholder="Search by donor name..."
              value={searchFilters.donorName}
              onChange={(e) => setSearchFilters((prev) => ({ ...prev, donorName: e.target.value }))}
            />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Added</SelectItem>
                <SelectItem value="harvestDate">Harvest Date</SelectItem>
                <SelectItem value="expiryDate">Expiry Date</SelectItem>
                <SelectItem value="organType">Organ Type</SelectItem>
                <SelectItem value="donorName">Donor Name</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={searchFilters.status === "available" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSearchFilters((prev) => ({
                  ...prev,
                  status: prev.status === "available" ? "" : "available",
                }))
              }
            >
              Available Only
            </Button>
            <Button
              variant={searchFilters.priority === "critical" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSearchFilters((prev) => ({
                  ...prev,
                  priority: prev.priority === "critical" ? "" : "critical",
                }))
              }
            >
              Critical Priority
            </Button>
            <Button
              variant={searchFilters.organType === "kidney" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSearchFilters((prev) => ({
                  ...prev,
                  organType: prev.organType === "kidney" ? "" : "kidney",
                }))
              }
            >
              Kidneys Only
            </Button>
            <Button
              variant={searchFilters.organType === "heart" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSearchFilters((prev) => ({
                  ...prev,
                  organType: prev.organType === "heart" ? "" : "heart",
                }))
              }
            >
              Hearts Only
            </Button>
          </div>

          {/* Search Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredInventory.length} of {inventory.length} items
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Display */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Current Inventory ({inventory.length} items)
              </CardTitle>
              <CardDescription>Overview of all organs currently in inventory</CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="transported">Transported</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filter === "all"
                ? "No items in inventory. Add organs using the form above."
                : `No ${filter} items found.`}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span className="font-medium">{item.organType}</span>
                        <Badge variant="outline">{item.bloodGroup}</Badge>
                      </div>
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                      <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="transported">Transported</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-gray-400" />
                      <span>{item.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Harvested: {new Date(item.harvestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Donor:</span> {item.donorName} ({item.donorId})
                  </div>

                  {item.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
