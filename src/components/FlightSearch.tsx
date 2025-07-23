'use client';

import { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { PHILIPPINE_AIRPORTS, POPULAR_ROUTES } from '@/data/philippines';
import { SearchCriteria } from '@/types/flight';

interface FlightSearchProps {
    onSearch: (criteria: SearchCriteria) => void;
    isLoading?: boolean;
}

export default function FlightSearch({ onSearch, isLoading = false }: FlightSearchProps) {
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: {
            adults: 1,
            children: 0,
            infants: 0
        },
        tripType: 'one-way'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchCriteria);
    };

    const handleRouteSelect = (origin: string, destination: string) => {
        setSearchCriteria(prev => ({
            ...prev,
            origin,
            destination
        }));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Find the Best Domestic Flight Deals
                </h1>
                <p className="text-gray-600">
                    ✈️ Carry-on guaranteed • 🔒 15-minute price lock • 💰 Best value for Filipino travelers
                </p>
            </div>

            {/* Trip Type Toggle */}
            <div className="flex mb-6">
                <button
                    type="button"
                    className={`px-4 py-2 rounded-l-lg border ${searchCriteria.tripType === 'one-way'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                    onClick={() => setSearchCriteria(prev => ({ ...prev, tripType: 'one-way' }))}
                >
                    One Way
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 rounded-r-lg border-t border-r border-b ${searchCriteria.tripType === 'round-trip'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                    onClick={() => setSearchCriteria(prev => ({ ...prev, tripType: 'round-trip' }))}
                >
                    Round Trip
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origin and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="inline w-4 h-4 mr-1" />
                            From
                        </label>
                        <select
                            value={searchCriteria.origin}
                            onChange={(e) => setSearchCriteria(prev => ({ ...prev, origin: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select departure city</option>
                            {PHILIPPINE_AIRPORTS.map((airport) => (
                                <option key={airport.code} value={airport.code}>
                                    {airport.city} ({airport.code}) - {airport.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="inline w-4 h-4 mr-1" />
                            To
                        </label>
                        <select
                            value={searchCriteria.destination}
                            onChange={(e) => setSearchCriteria(prev => ({ ...prev, destination: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select destination city</option>
                            {PHILIPPINE_AIRPORTS.map((airport) => (
                                <option key={airport.code} value={airport.code}>
                                    {airport.city} ({airport.code}) - {airport.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Popular Routes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Popular Routes</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {POPULAR_ROUTES.slice(0, 6).map((route) => (
                            <button
                                key={`${route.origin}-${route.destination}`}
                                type="button"
                                onClick={() => handleRouteSelect(route.origin, route.destination)}
                                className="text-left p-2 text-sm bg-gray-50 hover:bg-blue-50 rounded-md transition-colors"
                            >
                                {route.route}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Departure Date
                        </label>
                        <input
                            type="date"
                            value={searchCriteria.departureDate}
                            onChange={(e) => setSearchCriteria(prev => ({ ...prev, departureDate: e.target.value }))}
                            min={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {searchCriteria.tripType === 'round-trip' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                Return Date
                            </label>
                            <input
                                type="date"
                                value={searchCriteria.returnDate}
                                onChange={(e) => setSearchCriteria(prev => ({ ...prev, returnDate: e.target.value }))}
                                min={searchCriteria.departureDate || today}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* Passengers */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="inline w-4 h-4 mr-1" />
                        Passengers
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Adults</label>
                            <select
                                value={searchCriteria.passengers.adults}
                                onChange={(e) => setSearchCriteria(prev => ({
                                    ...prev,
                                    passengers: { ...prev.passengers, adults: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Children (2-11)</label>
                            <select
                                value={searchCriteria.passengers.children}
                                onChange={(e) => setSearchCriteria(prev => ({
                                    ...prev,
                                    passengers: { ...prev.passengers, children: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Infants (0-2)</label>
                            <select
                                value={searchCriteria.passengers.infants}
                                onChange={(e) => setSearchCriteria(prev => ({
                                    ...prev,
                                    passengers: { ...prev.passengers, infants: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[0, 1, 2].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Searching for best deals...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Search className="w-5 h-5 mr-2" />
                            Search Flights
                        </div>
                    )}
                </button>
            </form>

            {/* Anti-manipulation features */}
            <div className="mt-6 p-4 bg-green-50 rounded-md">
                <h3 className="text-sm font-medium text-green-800 mb-2">🛡️ Anti-Price Manipulation Active</h3>
                <ul className="text-xs text-green-700 space-y-1">
                    <li>• Tracking cookies automatically cleared</li>
                    <li>• Price history monitoring disabled</li>
                    <li>• Anonymous browsing mode enabled</li>
                    <li>• 15-minute price lock guarantee</li>
                </ul>
            </div>
        </div>
    );
}
