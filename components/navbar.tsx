"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Menu, X, User, Settings, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, switchRole, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleRoleSwitch = (newRole: string) => {
    switchRole(newRole as "admin" | "donor" | "recipient")
    toast({
      title: "Role Switched",
      description: `You are now viewing as ${newRole}`,
    })
  }

  const handleNavigation = (path: string, message?: string) => {
    if (message) {
      toast({
        title: "Navigating...",
        description: message,
      })
    }
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    router.push("/")
  }

  const handleProfileSettings = () => {
    toast({
      title: "Profile Settings",
      description: "Opening profile settings panel",
    })
    // In a real app, this would open a profile modal or navigate to settings
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">OrganEase</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => handleNavigation("/dashboard", "Opening your dashboard")}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation("/inventory", "Opening inventory management")}>
              Inventory
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation("/search", "Opening search and matching")}>
              Search
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation("/about", "Opening about page")}>
              About
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation("/contact", "Opening contact page")}>
              Contact
            </Button>
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Select value={user.role} onValueChange={handleRoleSwitch}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="donor">Donor</SelectItem>
                    <SelectItem value="recipient">Recipient</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="ghost" size="sm" onClick={handleProfileSettings}>
                  <User className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>

                <Button variant="ghost" size="sm" onClick={handleProfileSettings}>
                  <Settings className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => handleNavigation("/dashboard", "Opening your dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => handleNavigation("/inventory", "Opening inventory management")}
              >
                Inventory
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => handleNavigation("/search", "Opening search and matching")}
              >
                Search
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => handleNavigation("/about", "Opening about page")}
              >
                About
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => handleNavigation("/contact", "Opening contact page")}
              >
                Contact
              </Button>

              {user && (
                <>
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Select value={user.role} onValueChange={handleRoleSwitch}>
                      <SelectTrigger className="w-full mb-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="recipient">Recipient</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" className="justify-start w-full" onClick={handleProfileSettings}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="justify-start w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
