"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "donor" | "recipient" | "admin"
  profile?: {
    bloodGroup: string
    location: string
    phone: string
    medicalHistory: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  updateProfile: (profileData: any) => Promise<boolean>
  switchRole: (role: "donor" | "recipient" | "admin") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Auto-login with default admin user
    const defaultUser: User = {
      id: "1",
      email: "admin@organease.com",
      name: "OrganEase Admin",
      role: "admin",
      profile: {
        bloodGroup: "O+",
        location: "New York",
        phone: "+1234567890",
        medicalHistory: "No major health issues",
      },
    }
    setUser(defaultUser)
    localStorage.setItem("organease_user", JSON.stringify(defaultUser))
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    return true // Always return true since we're bypassing login
  }

  const register = async (userData: any): Promise<boolean> => {
    return true // Always return true
  }

  const logout = () => {
    // Don't actually logout, just show a message
    console.log("Logout functionality disabled for demo")
  }

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          profile: { ...user.profile, ...profileData },
        }
        setUser(updatedUser)
        localStorage.setItem("organease_user", JSON.stringify(updatedUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    }
  }

  const switchRole = (role: "donor" | "recipient" | "admin") => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem("organease_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
