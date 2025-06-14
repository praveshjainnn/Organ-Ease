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
import { Plus, Package, Calendar, MapPin, Thermometer, Clock, Trash2, Edit } from "lucide-react"

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

  // Load inventory on component mount
  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem("organease_inventory") || "[]")
    setInventory(storedInventory)
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

  const filteredInventory = inventory.filter((item) => {
    if (filter === "all") return true
    return item.status === filter
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

      {/* Inventory Display */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Current Inventory ({filteredInventory.length} items)
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
