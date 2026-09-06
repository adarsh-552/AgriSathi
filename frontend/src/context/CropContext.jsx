import React, { createContext, useContext, useState, useCallback } from 'react'
import { cropService } from '../services/cropService'
import { memoryService } from '../services/memoryService'

const CropContext = createContext(null)

export function CropProvider({ children }) {
  const [catalog, setCatalog]               = useState([])
  const [activeCrops, setActiveCrops]       = useState([])
  const [selectedCrop, setSelectedCrop]     = useState(null)   // currently viewed FarmerCrop
  const [dashboard, setDashboard]           = useState(null)
  const [timeline, setTimeline]             = useState([])
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [loadingDash, setLoadingDash]       = useState(false)
  const [loadingTimeline, setLoadingTimeline] = useState(false)
  const [error, setError]                   = useState(null)

  /** Fetch global crop catalog (runs once at home) */
  const fetchCatalog = useCallback(async () => {
    if (catalog.length > 0) return catalog   // cache hit
    setLoadingCatalog(true)
    setError(null)
    try {
      const data = await cropService.getCatalog()
      setCatalog(data)
      return data
    } catch (err) {
      setError('catalog_load_error')
      return []
    } finally {
      setLoadingCatalog(false)
    }
  }, [catalog])

  /** Fetch dashboard for a specific farmer crop */
  const fetchDashboard = useCallback(async (farmerCropId) => {
    setLoadingDash(true)
    setError(null)
    try {
      const data = await cropService.getDashboard(farmerCropId)
      setDashboard(data)
      return data
    } catch (err) {
      setError('dashboard_load_error')
      return null
    } finally {
      setLoadingDash(false)
    }
  }, [])

  /** Start a new crop journey */
  const startCropJourney = useCallback(async (payload) => {
    setError(null)
    try {
      const data = await cropService.createFarmerCrop(payload)
      setActiveCrops(prev => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      const msg = err.response?.data?.message || 'crop_create_error'
      setError(msg)
      return { success: false, message: msg }
    }
  }, [])

  /** Confirm a crop milestone */
  const confirmMilestone = useCallback(async (farmerCropId, milestoneCode) => {
    try {
      const data = await cropService.confirmMilestone(farmerCropId, milestoneCode)
      // Refresh dashboard after milestone
      if (selectedCrop?.id === farmerCropId) await fetchDashboard(farmerCropId)
      return { success: true, data }
    } catch (err) {
      return { success: false }
    }
  }, [selectedCrop, fetchDashboard])

  /** Fetch crop memory timeline */
  const fetchTimeline = useCallback(async (farmerCropId) => {
    setLoadingTimeline(true)
    try {
      const data = await memoryService.getTimeline(farmerCropId)
      setTimeline(data)
      return data
    } catch {
      return []
    } finally {
      setLoadingTimeline(false)
    }
  }, [])

  /** Log a new event to crop memory */
  const logEvent = useCallback(async (farmerCropId, eventPayload) => {
    try {
      const data = await memoryService.logEvent(farmerCropId, eventPayload)
      setTimeline(prev => [data, ...prev])
      return { success: true, data }
    } catch {
      return { success: false }
    }
  }, [])

  const selectCrop = useCallback((crop) => {
    setSelectedCrop(crop)
    setDashboard(null)
    setTimeline([])
  }, [])

  const value = {
    catalog,
    activeCrops,
    selectedCrop,
    dashboard,
    timeline,
    loadingCatalog,
    loadingDash,
    loadingTimeline,
    error,
    fetchCatalog,
    fetchDashboard,
    startCropJourney,
    confirmMilestone,
    fetchTimeline,
    logEvent,
    selectCrop,
  }

  return (
    <CropContext.Provider value={value}>
      {children}
    </CropContext.Provider>
  )
}

export function useCrop() {
  const ctx = useContext(CropContext)
  if (!ctx) throw new Error('useCrop must be used within CropProvider')
  return ctx
}
