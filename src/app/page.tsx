'use client';

import { useState } from 'react';
import FlightSearch from '@/components/FlightSearch';
import FlightResults from '@/components/FlightResults';
import { Flight, SearchCriteria, PriceLock } from '@/types/flight';
import { Plane, Shield, Clock, DollarSign } from 'lucide-react';

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceLocks, setPriceLocks] = useState<PriceLock[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleFlightSearch = async (criteria: SearchCriteria) => {
    setIsLoading(true);
    setFlights([]);
    setSelectedFlight(null);

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error('Failed to search flights');
      }

      const data = await response.json();
      setFlights(data.flights);
    } catch (error) {
      console.error('Flight search error:', error);
      alert('Failed to search flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightSelect = async (flight: Flight) => {
    setSelectedFlight(flight);

    // Lock the price for 15 minutes
    try {
      const response = await fetch('/api/flights/price-lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: flight.id,
          price: flight.price.total
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPriceLocks(prev => [...prev.filter(lock => lock.flightId !== flight.id), data.priceLock]);
      }
    } catch (error) {
      console.error('Price lock error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Plane className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CheepCheep</h1>
                <p className="text-xs text-gray-600">Philippines Flight Deals</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                <span>Anti-manipulation</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>15-min lock</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Best value</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Best Domestic Flight Deals in the Philippines
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bypass price manipulation tactics and secure the lowest fares with our 15-minute price lock guarantee.
            Every flight includes carry-on baggage as standard.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Anti-Price Manipulation</h3>
            <p className="text-gray-600">
              Our technology bypasses tracking cookies and user profiling to ensure you get genuine prices.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">15-Minute Price Lock</h3>
            <p className="text-gray-600">
              Take your time to decide. We lock your price for 15 minutes with no hidden fees.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Value Focus</h3>
            <p className="text-gray-600">
              Optimized for Filipino travelers with economic value and carry-on guarantee.
            </p>
          </div>
        </div>

        {/* Search Component */}
        <FlightSearch onSearch={handleFlightSearch} isLoading={isLoading} />

        {/* Results Component */}
        {(flights.length > 0 || isLoading) && (
          <FlightResults
            flights={flights}
            isLoading={isLoading}
            onFlightSelect={handleFlightSelect}
            priceLocks={priceLocks}
          />
        )}

        {/* Selected Flight Summary */}
        {selectedFlight && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Flight Selected - Price Locked for 15 Minutes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-800">
                    <strong>{selectedFlight.airline.name}</strong> - {selectedFlight.flightNumber}
                  </p>
                  <p className="text-blue-700">
                    {selectedFlight.departure.airport.city} → {selectedFlight.arrival.airport.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">
                    ₱{selectedFlight.price.total.toLocaleString()}
                  </p>
                  <p className="text-blue-700">Price locked until expiry</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Plane className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold">CheepCheep</span>
              </div>
              <p className="text-gray-300 text-sm">
                The smart way to book domestic flights in the Philippines.
                Best prices, guaranteed carry-on, and no price manipulation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Supported Airlines</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>Philippine Airlines</li>
                <li>Cebu Pacific</li>
                <li>Philippines AirAsia</li>
                <li>Skyjet Airlines</li>
                <li>PAL Express</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>✓ Anti-price manipulation</li>
                <li>✓ 15-minute price lock</li>
                <li>✓ Carry-on guarantee</li>
                <li>✓ Best value focus</li>
                <li>✓ Real-time pricing</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 CheepCheep. Made for Filipino travelers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
