import { create } from 'zustand'

export interface Hotel {
  id: string
  name: string
  image: string
  rating: number
  reviewCount: number
  description: string
  location: string
  prices: {
    booking: number | null
    agoda: number | null
    trip: number | null
    google: number | null
    priceline: number | null
  }
  bestPrice: number
  bestPlatform: string
  savings: number
  amenities: string[]
}

interface SearchParams {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

interface TravelStore {
  searchParams: SearchParams
  searchResults: Hotel[]
  isLoading: boolean
  setSearchParams: (params: Partial<SearchParams>) => void
  searchHotels: () => Promise<void>
  clearResults: () => void
}

export const useTravelStore = create<TravelStore>((set, get) => ({
  searchParams: {
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  },
  searchResults: [],
  isLoading: false,

  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params }
    })),

  searchHotels: async () => {
    const { searchParams } = get()
    set({ isLoading: true })
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
      })

      if (!response.ok) {
        throw new Error('Failed to search hotels')
      }

      const data = await response.json()
      
      // Transform API response to match our Hotel interface
      const hotels: Hotel[] = data.hotels.map((hotel: any) => ({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        rating: hotel.rating,
        reviewCount: hotel.reviewCount,
        description: hotel.description,
        location: hotel.location,
        prices: {
          booking: hotel.prices.find((p: any) => p.platform === 'Booking.com')?.price || null,
          agoda: hotel.prices.find((p: any) => p.platform === 'Agoda')?.price || null,
          trip: hotel.prices.find((p: any) => p.platform === 'Trip.com')?.price || null,
          google: hotel.prices.find((p: any) => p.platform === 'Google Travel')?.price || null,
          priceline: hotel.prices.find((p: any) => p.platform === 'Priceline')?.price || null
        },
        bestPrice: hotel.bestPrice,
        bestPlatform: hotel.bestPlatform,
        savings: hotel.savings,
        amenities: hotel.amenities
      }))
      
      set({ searchResults: hotels })
    } catch (error) {
      console.error('Error searching hotels:', error)
      set({ searchResults: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  clearResults: () => set({ searchResults: [] })
}))
