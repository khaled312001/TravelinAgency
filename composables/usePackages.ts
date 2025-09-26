// import type { Database } from '~/types/supabase'
import { ref, onMounted, onUnmounted } from 'vue'

export interface PackageOptions {
  flight?: boolean
  hotel?: boolean
  transportation?: boolean
  hotelGrade?: number // Hotel grade (stars), e.g., 3, 4, 5
}

export interface Package {
  id: string
  image_url: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  travel_period?: string
  duration_days: number
  price: number
  max_persons?: number
  featured?: boolean | number
  included_options?: PackageOptions
}



export function usePackages() {
  // Create reactive state - start with pending true to ensure consistent initial state
  const packages = ref<Package[]>([])
  const pending = ref(true) // Start with pending true for consistent hydration
  const error = ref<Error | null>(null)

  // Fetch function
  const fetchPackages = async () => {
    if (pending.value && packages.value.length > 0) return // Prevent multiple simultaneous requests if we already have data
    
    pending.value = true
    error.value = null
    
    try {
      console.log('usePackages: Fetching packages from API...')
      const res = await fetch('/api/packages')
      if (!res.ok) {
        console.error('usePackages: Failed to fetch packages:', res.status, res.statusText)
        throw new Error('Failed to fetch packages')
      }
      const result = await res.json()
      console.log('usePackages: API response:', result)
      console.log('usePackages: Packages data:', result.data)
      packages.value = result.data as Package[]
    } catch (err) {
      error.value = err as Error
      console.error('usePackages: Error fetching packages:', err)
    } finally {
      pending.value = false
    }
  }

  // Initialize data fetching
  const initializePackages = () => {
    fetchPackages()
  }

  // Only fetch on client-side to avoid SSR issues
  if (process.client) {
    onMounted(initializePackages)
  } else {
    // Server-side: Set pending to false and use empty array
    pending.value = false
    packages.value = []
  }

  // Listen for auto-refresh events from the plugin
  if (process.client) {
    onMounted(() => {
      const handlePackagesRefresh = (event: CustomEvent) => {
        if (packages.value) {
          packages.value = event.detail
          console.log('🔄 Packages updated from auto-refresh')
        }
      }
      
      window.addEventListener('packages-refreshed', handlePackagesRefresh as EventListener)
      
      onUnmounted(() => {
        window.removeEventListener('packages-refreshed', handlePackagesRefresh as EventListener)
      })
    })
  }

  // Get all packages
  const getPackages = () => {
    const allPackages = packages.value || []
    console.log('getPackages called, returning:', allPackages.length, 'packages')
    return allPackages
  }

  // Get package by ID
  const getPackageById = (id: string) => getPackages().find(p => p.id === id)

  // Refresh function
  const refresh = () => {
    return fetchPackages()
  }

  return {
    packages,
    getPackages,
    getPackageById,
    pending,
    error,
    refresh
  }
}