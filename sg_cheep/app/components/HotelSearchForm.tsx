'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, Users, Bed } from 'lucide-react'
import { useTravelStore } from '../store/travelStore'
import { format } from 'date-fns'

export default function HotelSearchForm() {
  const { searchParams, setSearchParams, searchHotels } = useTravelStore()
  const [localParams, setLocalParams] = useState(searchParams)

  const handleInputChange = (field: string, value: string | number) => {
    const newParams = { ...localParams, [field]: value }
    setLocalParams(newParams)
    setSearchParams(newParams)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchHotels()
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Destination */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Where to?
            </label>
            <input
              type="text"
              placeholder="Singapore, Kuala Lumpur, Bangkok..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={localParams.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
            />
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Check-in
            </label>
            <input
              type="date"
              min={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={localParams.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Check-out
            </label>
            <input
              type="date"
              min={localParams.checkIn || tomorrow}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={localParams.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
            />
          </div>

          {/* Guests & Rooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Guests & Rooms
            </label>
            <div className="flex space-x-2">
              <select
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={localParams.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
              <select
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={localParams.rooms}
                onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg flex items-center space-x-2 transition-colors"
            disabled={!localParams.destination || !localParams.checkIn || !localParams.checkOut}
          >
            <Search className="w-5 h-5" />
            <span>Compare Prices Now</span>
          </button>
        </div>
      </form>

      {/* Popular Destinations */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-3">Popular destinations:</p>
        <div className="flex flex-wrap gap-2">
          {['Singapore', 'Kuala Lumpur', 'Bangkok', 'Jakarta', 'Manila', 'Ho Chi Minh'].map(city => (
            <button
              key={city}
              onClick={() => handleInputChange('destination', city)}
              className="px-3 py-1 bg-gray-100 hover:bg-green-100 text-gray-700 rounded-full text-sm transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
