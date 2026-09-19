import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '../services/authService'
import { profileService } from '../services/profileService'

const AuthContext = createContext(null)

const TOKEN_KEY   = 'agrisathi_token'
const USER_KEY    = 'agrisathi_user'
const PROFILE_KEY = 'agrisathi_profile'

export function AuthProvider({ children }) {
  const [token, setToken]       = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser]         = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [profile, setProfile]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) } catch { return null }
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const isAuthenticated = !!token
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const isFarmer = user?.role === 'ROLE_FARMER'

  // Parse JWT payload (no verify — server-side validates)
  const parseToken = useCallback((jwt) => {
    try {
      let base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      while (base64.length % 4) {
        base64 += '='
      }
      const payload = JSON.parse(atob(base64))
      return {
        userId:     payload.sub,
        identifier: payload.identifier,
        role:       payload.role,
        exp:        payload.exp,
      }
    } catch {
      return null
    }
  }, [])

  const saveSession = useCallback((jwt, userInfo, profileInfo = null) => {
    setToken(jwt)
    setUser(userInfo)
    setProfile(profileInfo)
    localStorage.setItem(TOKEN_KEY, jwt)
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
    if (profileInfo) localStorage.setItem(PROFILE_KEY, JSON.stringify(profileInfo))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setProfile(null)
    setError(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(PROFILE_KEY)
  }, [])

  // Auto-logout if token expired
  useEffect(() => {
    if (!token) return
    const payload = parseToken(token)
    if (!payload) { logout(); return }
    const msUntilExpiry = payload.exp * 1000 - Date.now()
    if (msUntilExpiry <= 0) { logout(); return }
    const timer = setTimeout(logout, msUntilExpiry)
    return () => clearTimeout(timer)
  }, [token, parseToken, logout])

  /**
   * Step 1 — Request OTP (mobile or email)
   */
  const requestOtp = useCallback(async (identifier) => {
    setLoading(true)
    setError(null)
    try {
      await authService.requestOtp(identifier)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP request failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Step 2 — Verify OTP and receive JWT
   */
  const verifyOtp = useCallback(async (identifier, otp) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.verifyOtp(identifier, otp)
      const payload = parseToken(data.token)
      const userInfo = { role: payload?.role, identifier }
      saveSession(data.token, userInfo)
      return { success: true, data }
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [parseToken, saveSession])

  /**
   * Admin login with email + password
   */
  const adminLogin = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.adminLogin(email, password)
      const payload = parseToken(data.token)
      const userInfo = { role: payload?.role, identifier: email }
      saveSession(data.token, userInfo)
      return { success: true, data }
    } catch (err) {
      const msg = err.response?.data?.message || 'Admin login failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [parseToken, saveSession])

  /**
   * Update profile with backend persistence and local cache
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      if (token) {
        const persisted = await profileService.updateProfile(profileData)
        setProfile(persisted)
        localStorage.setItem(PROFILE_KEY, JSON.stringify(persisted))
        return { success: true, data: persisted }
      } else {
        setProfile(profileData)
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData))
        return { success: true, data: profileData }
      }
    } catch (err) {
      // Graceful fallback to local state if offline/network error
      setProfile(profileData)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData))
      return { success: true, data: profileData }
    }
  }, [token])

  // Load profile from backend if authenticated
  useEffect(() => {
    if (token && isFarmer) {
      profileService.getProfile()
        .then((data) => {
          setProfile(data)
          localStorage.setItem(PROFILE_KEY, JSON.stringify(data))
        })
        .catch(() => {})
    }
  }, [token, isFarmer])

  const value = {
    token,
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isFarmer,
    requestOtp,
    verifyOtp,
    adminLogin,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
