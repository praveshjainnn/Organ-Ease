"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrganDonationFormProps {
  onClose: () => void
}

export function OrganDonationForm({ onClose }: OrganDonationFormProps) {
  const [formData, setFormData] = useState({
    organ: "",
    availability: "",
    medicalCondition: "",
    notes: "",
    urgency: "normal",
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
        title: "Organ donation listed successfully",
        description: "Your organ donation has been added to the system.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit organ donation form",
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
              <CardTitle>Add Organ Donation</CardTitle>
              <CardDescription>List an organ for donation to help save lives</CardDescription>
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
                <Label htmlFor="organ">Organ Type</Label>
                <Select onValueChange={(value) => handleInputChange("organ", value)} required>
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
                <Label htmlFor="availability">Availability</Label>
                <Select onValueChange={(value) => handleInputChange("availability", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="within-month">Within 1 Month</SelectItem>
                    <SelectItem value="within-3months">Within 3 Months</SelectItem>
                    <SelectItem value="within-6months">Within 6 Months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Priority Level</Label>
              <Select onValueChange={(value) => handleInputChange("urgency", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalCondition">Current Medical Condition</Label>
              <Textarea
                id="medicalCondition"
                placeholder="Describe your current health status and any relevant medical conditions"
                value={formData.medicalCondition}
                onChange={(e) => handleInputChange("medicalCondition", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information or special requirements"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• All organ donations will be verified by medical professionals</li>
                <li>• You will be contacted for additional medical screening</li>
                <li>• Your privacy and medical information are protected</li>
                <li>• You can withdraw your donation at any time</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Donation"}
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
