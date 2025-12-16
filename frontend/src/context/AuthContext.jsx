import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/user', {
                withCredentials: true
            })
            if (response.data.authenticated) {
                setUser({
                    name: response.data.name,
                    email: response.data.email,
                    avatar: response.data.avatar
                })
            }
        } catch (error) {
            console.log('Not authenticated')
        } finally {
            setLoading(false)
        }
    }

    const loginWithGoogle = () => {
        window.location.href = '/oauth2/authorization/google'
    }

    const loginWithGithub = () => {
        window.location.href = '/oauth2/authorization/github'
    }

    const logout = async () => {
        try {
            setUser(null)
            // Use Spring Security's logout endpoint which properly invalidates session
            window.location.href = '/logout'
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const value = {
        user,
        loading,
        loginWithGoogle,
        loginWithGithub,
        logout,
        checkAuth,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
