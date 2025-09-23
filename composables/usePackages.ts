// import type { Database } from '~/types/supabase'
import { ref } from 'vue'
import { useAsyncData } from '#app'

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
  // Fetch packages from API (SSR/CSR compatible, SWR caching)
  const { data: packages, pending, error, refresh } = useAsyncData('packages', async () => {
    console.log('usePackages: Fetching packages from API...')
    const res = await fetch('/api/packages')
    if (!res.ok) {
      console.error('usePackages: Failed to fetch packages:', res.status, res.statusText)
      throw new Error('Failed to fetch packages')
    }
    const result = await res.json()
    console.log('usePackages: API response:', result)
    console.log('usePackages: Packages data:', result.data)
    return result.data as Package[]
  }, {
    server: true,
    client: true
  })

  // Get all packages
  const getPackages = () => {
    const allPackages = packages.value || []
    console.log('getPackages called, returning:', allPackages.length, 'packages')
    return allPackages
  }

  // Get package by ID
  const getPackageById = (id: string) => getPackages().find(p => p.id === id)

  return {
    getPackages,
    getPackageById,
    pending,
    error,
    refresh
  }
}