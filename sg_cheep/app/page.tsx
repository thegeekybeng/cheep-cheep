'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, Users, Star, DollarSign } from 'lucide-react'
import HotelSearchForm from './components/HotelSearchForm'
import PriceComparisonCard from './components/PriceComparisonCard'
import { useTravelStore } from './store/travelStore'

export default function HomePage() {
  const { searchResults, isLoading } = useTravelStore()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              SG <span className="text-green-600">Cheep</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              Always cheaper than Priceline
            </span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
              🇸🇬 Made for Singapore
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Find the <span className="text-green-600">Cheapest</span> Hotels in Singapore
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We compare prices from Booking.com, Agoda, Trip.com & Google Travel to get you the best deals. 
          Guaranteed better prices than Priceline!
        </p>
        
        {/* Search Form */}
        <HotelSearchForm />
      </section>

      {/* Search Results */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Comparing prices across all platforms...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Best Deals Found ({searchResults.length} hotels)
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((hotel, index) => (
              <PriceComparisonCard key={index} hotel={hotel} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 border-t border-blue-100">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Why Choose SG Cheep?
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-800 mb-2">Multi-Platform Search</h4>
            <p className="text-sm text-gray-600">Search across Booking, Agoda, Trip & Google simultaneously</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-800 mb-2">Best Price Guarantee</h4>
            <p className="text-sm text-gray-600">Always cheaper than Priceline or we'll refund the difference</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <MapPin className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-800 mb-2">Singapore Focused</h4>
            <p className="text-sm text-gray-600">Optimized for Singapore travelers with local insights</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-800 mb-2">Verified Reviews</h4>
            <p className="text-sm text-gray-600">Real reviews from verified Singapore travelers</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-blue-100 text-center text-gray-600">
        <p>&copy; 2025 SG Cheep. Made with ❤️ in Singapore 🇸🇬</p>
      </footer>
    </div>
  )
}
