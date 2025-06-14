"use client"

import { InventoryInputForm } from "@/components/inventory-input-form"
import { Navbar } from "@/components/navbar"

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add, track, and manage organ inventory with real-time updates
          </p>
        </div>
        <InventoryInputForm />
      </div>
    </div>
  )
}
