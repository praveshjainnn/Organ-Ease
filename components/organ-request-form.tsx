"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrganRequestFormProps {
  onClose: () => void
}

export function OrganRequestForm({ onClose }: OrganRequestFormProps) {
  const [formData, setFormData] = useState({
    organ: "",
    urgency: "",
    medicalCondition: "",
    doctorName: "",
    hospitalName: "",
    notes: "",
    timeframe: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Organ request submitted successfully",
        description: "Your request has been added to our matching system.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit organ request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Request Organ Donation</CardTitle>
              <CardDescription>Submit a request for organ donation</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organ">Organ Needed</Label>
                <Select onValueChange={(value) => handleInputChange("organ", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organ needed" />
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
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select onValueChange={(value) => handleInputChange("urgency", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Required Timeframe</Label>
              <Select onValueChange={(value) => handleInputChange("timeframe", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (within days)</SelectItem>
                  <SelectItem value="within-month">Within 1 Month</SelectItem>
                  <SelectItem value="within-3months">Within 3 Months</SelectItem>
                  <SelectItem value="within-6months">Within 6 Months</SelectItem>
                  <SelectItem value="within-year">Within 1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Primary Doctor</Label>
                <Input
                  id="doctorName"
                  placeholder="Enter doctor's name"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange("doctorName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital/Medical Center</Label>
                <Input
                  id="hospitalName"
                  placeholder="Enter hospital name"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalCondition">Medical Condition</Label>
              <Textarea
                id="medicalCondition"
                placeholder="Describe your medical condition and why you need this organ"
                value={formData.medicalCondition}
                onChange={(e) => handleInputChange("medicalCondition", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Information</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information that might help with matching"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Important Notice</h4>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                <li>• All requests will be reviewed by medical professionals</li>
                <li>• Medical documentation may be required for verification</li>
                <li>• Priority is given based on medical urgency and compatibility</li>
                <li>• You will be notified when potential matches are found</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
