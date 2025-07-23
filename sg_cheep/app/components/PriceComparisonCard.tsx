'use client'

import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, ExternalLink } from 'lucide-react'
import { Hotel } from '../store/travelStore'

interface PriceComparisonCardProps {
  hotel: Hotel
}

export default function PriceComparisonCard({ hotel }: PriceComparisonCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />
      case 'parking':
        return <Car className="w-4 h-4" />
      case 'breakfast':
        return <Coffee className="w-4 h-4" />
      case 'gym':
      case 'fitness':
        return <Dumbbell className="w-4 h-4" />
      default:
        return <span className="w-4 h-4 text-center">•</span>
    }
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A'
    return `$${price}`
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'booking':
        return 'bg-blue-600'
      case 'agoda':
        return 'bg-red-600'
      case 'trip':
        return 'bg-orange-600'
      case 'google':
        return 'bg-green-600'
      case 'priceline':
        return 'bg-purple-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Hotel Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format`}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
          Save ${hotel.savings}
        </div>
      </div>

      <div className="p-5">
        {/* Hotel Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{hotel.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span>{hotel.rating}</span>
              <span className="ml-1">({hotel.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{hotel.location}</span>
          </div>
          <p className="text-sm text-gray-600">{hotel.description}</p>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Price Comparison</h4>
          <div className="space-y-2">
            {Object.entries(hotel.prices).map(([platform, price]) => (
              <div key={platform} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getPlatformColor(platform)}`}></div>
                  <span className="capitalize font-medium">{platform}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={price === hotel.bestPrice ? 'text-green-600 font-bold' : 'text-gray-600'}>
                    {formatPrice(price)}
                  </span>
                  {price === hotel.bestPrice && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                      BEST
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Deal */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-700">Best Price on {hotel.bestPlatform}</p>
              <p className="text-2xl font-bold text-green-600">${hotel.bestPrice}</p>
              <p className="text-xs text-green-600">per night • ${hotel.savings} cheaper than Priceline</p>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
          <span>Book on {hotel.bestPlatform}</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
