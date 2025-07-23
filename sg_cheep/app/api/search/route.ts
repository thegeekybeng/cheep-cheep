import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { destination, checkIn, checkOut, guests, rooms } = await request.json()

    // Validate required fields
    if (!destination || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, checkIn, checkOut' },
        { status: 400 }
      )
    }

    // In a real implementation, this would:
    // 1. Query multiple hotel booking APIs simultaneously
    // 2. Normalize the data from different providers
    // 3. Calculate best prices and savings vs Priceline
    // 4. Return sorted results

    // Mock data for demonstration - Singapore hotels
    const mockHotels = [
      {
        id: 'mbs001',
        name: 'Marina Bay Sands',
        rating: 4.5,
        reviewCount: 15420,
        location: 'Marina Bay, Singapore',
        description: 'Iconic luxury hotel with infinity pool overlooking Singapore skyline',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        amenities: ['Infinity Pool', 'Casino', 'Shopping Mall', 'Spa', 'Fine Dining'],
        prices: [
          { platform: 'Booking.com', price: 450, url: 'https://booking.com/...', availability: true },
          { platform: 'Agoda', price: 420, url: 'https://agoda.com/...', availability: true },
          { platform: 'Trip.com', price: 435, url: 'https://trip.com/...', availability: true },
          { platform: 'Google Travel', price: 440, url: 'https://travel.google.com/...', availability: true },
          { platform: 'Priceline', price: 480, url: 'https://priceline.com/...', availability: true }
        ],
        bestPrice: 420,
        bestPlatform: 'Agoda',
        savings: 60
      },
      {
        id: 'raffles001',
        name: 'Raffles Singapore',
        rating: 4.8,
        reviewCount: 8900,
        location: 'City Centre, Singapore',
        description: 'Historic luxury hotel in the heart of Singapore',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        amenities: ['Historic Building', 'Butler Service', 'Spa', 'Fine Dining', 'Bar'],
        prices: [
          { platform: 'Booking.com', price: 680, url: 'https://booking.com/...', availability: true },
          { platform: 'Agoda', price: 650, url: 'https://agoda.com/...', availability: true },
          { platform: 'Trip.com', price: 670, url: 'https://trip.com/...', availability: true },
          { platform: 'Google Travel', price: 660, url: 'https://travel.google.com/...', availability: true },
          { platform: 'Priceline', price: 720, url: 'https://priceline.com/...', availability: true }
        ],
        bestPrice: 650,
        bestPlatform: 'Agoda',
        savings: 70
      },
      {
        id: 'shangri001',
        name: 'Shangri-La Hotel Singapore',
        rating: 4.6,
        reviewCount: 12300,
        location: 'Orchard Road, Singapore',
        description: 'Garden oasis in the city with award-winning restaurants',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        amenities: ['Garden View', 'Pool', 'Restaurants', 'Shopping Access', 'Spa'],
        prices: [
          { platform: 'Booking.com', price: 380, url: 'https://booking.com/...', availability: true },
          { platform: 'Agoda', price: 360, url: 'https://agoda.com/...', availability: true },
          { platform: 'Trip.com', price: 375, url: 'https://trip.com/...', availability: true },
          { platform: 'Google Travel', price: 370, url: 'https://travel.google.com/...', availability: true },
          { platform: 'Priceline', price: 410, url: 'https://priceline.com/...', availability: true }
        ],
        bestPrice: 360,
        bestPlatform: 'Agoda',
        savings: 50
      },
      {
        id: 'ritz001',
        name: 'The Ritz-Carlton, Millenia Singapore',
        rating: 4.7,
        reviewCount: 9800,
        location: 'Marina Centre, Singapore',
        description: 'Luxury hotel with stunning harbor views and world-class service',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        amenities: ['Harbor View', 'Club Lounge', 'Spa', 'Pool', 'Fine Dining'],
        prices: [
          { platform: 'Booking.com', price: 520, url: 'https://booking.com/...', availability: true },
          { platform: 'Agoda', price: 495, url: 'https://agoda.com/...', availability: true },
          { platform: 'Trip.com', price: 510, url: 'https://trip.com/...', availability: true },
          { platform: 'Google Travel', price: 505, url: 'https://travel.google.com/...', availability: true },
          { platform: 'Priceline', price: 550, url: 'https://priceline.com/...', availability: true }
        ],
        bestPrice: 495,
        bestPlatform: 'Agoda',
        savings: 55
      },
      {
        id: 'mandarin001',
        name: 'Mandarin Oriental Singapore',
        rating: 4.6,
        reviewCount: 7200,
        location: 'Marina Bay, Singapore',
        description: 'Contemporary luxury with Oriental heritage and exceptional service',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
        amenities: ['City View', 'Oriental Spa', 'Pool', 'Business Center', 'Restaurants'],
        prices: [
          { platform: 'Booking.com', price: 410, url: 'https://booking.com/...', availability: true },
          { platform: 'Agoda', price: 385, url: 'https://agoda.com/...', availability: true },
          { platform: 'Trip.com', price: 400, url: 'https://trip.com/...', availability: true },
          { platform: 'Google Travel', price: 395, url: 'https://travel.google.com/...', availability: true },
          { platform: 'Priceline', price: 440, url: 'https://priceline.com/...', availability: true }
        ],
        bestPrice: 385,
        bestPlatform: 'Agoda',
        savings: 55
      }
    ]

    // Filter hotels based on destination (simple text match for demo)
    const filteredHotels = mockHotels.filter(hotel => 
      hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
      destination.toLowerCase().includes('singapore')
    )

    // Sort by best savings
    const sortedHotels = filteredHotels.sort((a, b) => b.savings - a.savings)

    return NextResponse.json({
      success: true,
      hotels: sortedHotels,
      searchParams: { destination, checkIn, checkOut, guests, rooms },
      totalResults: sortedHotels.length,
      averageSavings: sortedHotels.reduce((sum, hotel) => sum + hotel.savings, 0) / sortedHotels.length
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
