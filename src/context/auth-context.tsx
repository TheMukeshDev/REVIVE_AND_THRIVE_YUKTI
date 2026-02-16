"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
    _id: string
    name: string
    username: string
    email: string
    points: number
    totalItemsRecycled: number
    totalCO2Saved: number
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (userData: User) => void
    logout: () => void
    updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initAuth = () => {
            // Check local storage on mount — no server calls needed
            const storedUser = localStorage.getItem("eco_user")
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser)
                    setUser(parsedUser)
                } catch (e) {
                    console.error("Failed to parse user data", e)
                    localStorage.removeItem("eco_user")
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = (userData: User) => {
        setUser(userData)
        localStorage.setItem("eco_user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("eco_user")
        router.push("/auth/login")
    }

    const updateUser = (updates: Partial<User>) => {
        if (!user) return
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem("eco_user", JSON.stringify(updatedUser))
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
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
