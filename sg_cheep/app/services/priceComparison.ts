import axios from 'axios'

export interface PriceComparisonRequest {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

export interface HotelPrice {
  platform: string
  price: number | null
  url: string
  availability: boolean
}

export interface HotelResult {
  id: string
  name: string
  rating: number
  reviewCount: number
  location: string
  description: string
  image: string
  amenities: string[]
  prices: HotelPrice[]
  bestPrice: number
  bestPlatform: string
  savings: number
}

class PriceComparisonService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  async searchHotels(params: PriceComparisonRequest): Promise<HotelResult[]> {
    try {
      // In a real implementation, this would make parallel requests to:
      // 1. Booking.com API
      // 2. Agoda API 
      // 3. Trip.com API
      // 4. Google Travel API
      // 5. Priceline API (for comparison baseline)

      const response = await axios.post(`${this.baseUrl}/search`, params)
      return response.data.hotels
    } catch (error) {
      console.error('Error searching hotels:', error)
      throw new Error('Failed to search hotels')
    }
  }

  async getBookingComPrices(hotelId: string, params: PriceComparisonRequest): Promise<HotelPrice> {
    try {
      // Mock Booking.com API integration
      const response = await axios.get(`${this.baseUrl}/booking/${hotelId}`, { params })
      return {
        platform: 'Booking.com',
        price: response.data.price,
        url: response.data.bookingUrl,
        availability: response.data.available
      }
    } catch (error) {
      return {
        platform: 'Booking.com',
        price: null,
        url: '',
        availability: false
      }
    }
  }

  async getAgodaPrices(hotelId: string, params: PriceComparisonRequest): Promise<HotelPrice> {
    try {
      // Mock Agoda API integration
      const response = await axios.get(`${this.baseUrl}/agoda/${hotelId}`, { params })
      return {
        platform: 'Agoda',
        price: response.data.price,
        url: response.data.bookingUrl,
        availability: response.data.available
      }
    } catch (error) {
      return {
        platform: 'Agoda',
        price: null,
        url: '',
        availability: false
      }
    }
  }

  async getTripComPrices(hotelId: string, params: PriceComparisonRequest): Promise<HotelPrice> {
    try {
      // Mock Trip.com API integration
      const response = await axios.get(`${this.baseUrl}/trip/${hotelId}`, { params })
      return {
        platform: 'Trip.com',
        price: response.data.price,
        url: response.data.bookingUrl,
        availability: response.data.available
      }
    } catch (error) {
      return {
        platform: 'Trip.com',
        price: null,
        url: '',
        availability: false
      }
    }
  }

  async getGoogleTravelPrices(hotelId: string, params: PriceComparisonRequest): Promise<HotelPrice> {
    try {
      // Mock Google Travel API integration
      const response = await axios.get(`${this.baseUrl}/google/${hotelId}`, { params })
      return {
        platform: 'Google Travel',
        price: response.data.price,
        url: response.data.bookingUrl,
        availability: response.data.available
      }
    } catch (error) {
      return {
        platform: 'Google Travel',
        price: null,
        url: '',
        availability: false
      }
    }
  }

  async getPricelinePrices(hotelId: string, params: PriceComparisonRequest): Promise<HotelPrice> {
    try {
      // Mock Priceline API integration (for comparison baseline)
      const response = await axios.get(`${this.baseUrl}/priceline/${hotelId}`, { params })
      return {
        platform: 'Priceline',
        price: response.data.price,
        url: response.data.bookingUrl,
        availability: response.data.available
      }
    } catch (error) {
      return {
        platform: 'Priceline',
        price: null,
        url: '',
        availability: false
      }
    }
  }

  async compareAllPrices(hotelId: string, params: PriceComparisonRequest): Promise<HotelPrice[]> {
    // Run all price checks in parallel for faster response
    const pricePromises = [
      this.getBookingComPrices(hotelId, params),
      this.getAgodaPrices(hotelId, params),
      this.getTripComPrices(hotelId, params),
      this.getGoogleTravelPrices(hotelId, params),
      this.getPricelinePrices(hotelId, params)
    ]

    const prices = await Promise.all(pricePromises)
    return prices
  }

  calculateBestDeal(prices: HotelPrice[]): { bestPrice: number; bestPlatform: string; savings: number } {
    const validPrices = prices.filter(p => p.price !== null && p.availability)
    
    if (validPrices.length === 0) {
      return { bestPrice: 0, bestPlatform: '', savings: 0 }
    }

    const bestDeal = validPrices.reduce((best, current) => 
      (current.price! < best.price!) ? current : best
    )

    const pricelinePrice = prices.find(p => p.platform === 'Priceline')?.price || 0
    const savings = pricelinePrice > 0 ? pricelinePrice - bestDeal.price! : 0

    return {
      bestPrice: bestDeal.price!,
      bestPlatform: bestDeal.platform,
      savings: Math.max(0, savings)
    }
  }
}

export const priceComparisonService = new PriceComparisonService()
