'use client';

import { useState } from 'react';
import { Clock, Plane, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Flight, PriceLock } from '@/types/flight';
import { PHILIPPINE_AIRPORTS } from '@/data/philippines';
import { format, differenceInMinutes } from 'date-fns';

interface FlightResultsProps {
    flights: Flight[];
    isLoading?: boolean;
    onFlightSelect: (flight: Flight) => void;
    priceLocks: PriceLock[];
}

export default function FlightResults({
    flights,
    isLoading = false,
    onFlightSelect,
    priceLocks
}: FlightResultsProps) {
    const [sortBy, setSortBy] = useState<'price' | 'time' | 'duration'>('price');
    const [selectedFlight, setSelectedFlight] = useState<string | null>(null);

    const getAirportName = (code: string) => {
        return PHILIPPINE_AIRPORTS.find(airport => airport.code === code)?.city || code;
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const getPriceLockInfo = (flightId: string) => {
        return priceLocks.find(lock => lock.flightId === flightId);
    };

    const getRemainingLockTime = (expiresAt: string) => {
        const now = new Date();
        const expires = new Date(expiresAt);
        const remainingMinutes = differenceInMinutes(expires, now);
        return Math.max(0, remainingMinutes);
    };

    const sortedFlights = [...flights].sort((a, b) => {
        switch (sortBy) {
            case 'price':
                return a.price.total - b.price.total;
            case 'time':
                return new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
            case 'duration':
                return a.duration - b.duration;
            default:
                return 0;
        }
    });

    const handleFlightSelect = (flight: Flight) => {
        setSelectedFlight(flight.id);
        onFlightSelect(flight);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-gray-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (flights.length === 0) {
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No flights found</h2>
                    <p className="text-gray-600">Try adjusting your search criteria or selecting different dates.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {flights.length} flight{flights.length > 1 ? 's' : ''} found
                        </h2>
                        <div className="flex items-center space-x-4">
                            <label className="text-sm text-gray-600">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'price' | 'time' | 'duration')}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="price">Price (Low to High)</option>
                                <option value="time">Departure Time</option>
                                <option value="duration">Flight Duration</option>
                            </select>
                        </div>
                    </div>

                    {/* Value guarantee banner */}
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center text-green-800">
                            <Shield className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">
                                All flights include carry-on baggage • Best price guarantee • 15-minute price lock
                            </span>
                        </div>
                    </div>
                </div>

                {/* Flight List */}
                <div className="divide-y divide-gray-200">
                    {sortedFlights.map((flight) => {
                        const priceLock = getPriceLockInfo(flight.id);
                        const remainingLockTime = priceLock ? getRemainingLockTime(priceLock.expiresAt) : 0;

                        return (
                            <div
                                key={flight.id}
                                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${selectedFlight === flight.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    }`}
                                onClick={() => handleFlightSelect(flight)}
                            >
                                <div className="flex justify-between items-start">
                                    {/* Flight Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Plane className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    {flight.airline.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {flight.flightNumber} • {flight.aircraft}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Route and Time */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <div className="font-semibold text-lg">
                                                    {format(new Date(flight.departure.time), 'HH:mm')}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {getAirportName(flight.departure.airport.code)} ({flight.departure.airport.code})
                                                </div>
                                                {flight.departure.terminal && (
                                                    <div className="text-xs text-gray-500">
                                                        Terminal {flight.departure.terminal}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        {formatDuration(flight.duration)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="flex-1 border-t border-gray-300"></div>
                                                        <Plane className="w-4 h-4 mx-2 text-gray-400" />
                                                        <div className="flex-1 border-t border-gray-300"></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">Non-stop</div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="font-semibold text-lg">
                                                    {format(new Date(flight.arrival.time), 'HH:mm')}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {getAirportName(flight.arrival.airport.code)} ({flight.arrival.airport.code})
                                                </div>
                                                {flight.arrival.terminal && (
                                                    <div className="text-xs text-gray-500">
                                                        Terminal {flight.arrival.terminal}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Baggage Info */}
                                        <div className="flex items-center space-x-4 text-sm">
                                            <div className="flex items-center text-green-600">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Carry-on included
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                {flight.airline.checkedBaggage.included ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                                        {flight.airline.checkedBaggage.weight}kg checked bag included
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-4 h-4 mr-1 text-orange-500" />
                                                        {flight.airline.checkedBaggage.weight}kg checked bag: ₱{flight.airline.checkedBaggage.price}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price and Book */}
                                    <div className="text-right ml-6">
                                        <div className="mb-2">
                                            <div className="text-2xl font-bold text-gray-800">
                                                ₱{flight.price.total.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                per person
                                            </div>
                                        </div>

                                        {/* Price Lock Status */}
                                        {priceLock && remainingLockTime > 0 ? (
                                            <div className="mb-3 p-2 bg-green-100 rounded-md">
                                                <div className="flex items-center text-green-800 text-sm">
                                                    <Lock className="w-4 h-4 mr-1" />
                                                    Price locked
                                                </div>
                                                <div className="text-xs text-green-700">
                                                    {remainingLockTime} min remaining
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-3 p-2 bg-blue-100 rounded-md">
                                                <div className="flex items-center text-blue-800 text-sm">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    15-min lock available
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFlightSelect(flight);
                                            }}
                                        >
                                            {selectedFlight === flight.id ? 'Selected' : 'Select'}
                                        </button>

                                        <div className="text-xs text-gray-500 mt-2">
                                            {flight.availability.seats} seats left
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
