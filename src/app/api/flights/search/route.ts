import { NextRequest, NextResponse } from 'next/server';
import { Flight, SearchCriteria, AntiTrackingSession } from '@/types/flight';
import { PHILIPPINE_AIRLINES, PHILIPPINE_AIRPORTS } from '@/data/philippines';
import { addHours } from 'date-fns';

// Mock flight data generator for demonstration
// In production, this would integrate with real airline APIs
export async function POST(request: NextRequest) {
    try {
        const searchCriteria: SearchCriteria = await request.json();

        // Generate anti-tracking session
        const antiTrackingSession: AntiTrackingSession = {
            sessionId: generateSessionId(),
            userAgent: request.headers.get('user-agent') || '',
            vpnEnabled: true, // Simulated
            cookiesCleared: true,
            incognitoMode: true,
            searchHistory: [searchCriteria]
        };

        // Simulate API delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate mock flight data
        const flights = generateMockFlights(searchCriteria);

        return NextResponse.json({
            flights,
            antiTrackingSession,
            searchId: generateSessionId(),
            priceGuarantee: {
                lockDuration: 15, // minutes
                expiresAt: addHours(new Date(), 0.25).toISOString()
            }
        });

    } catch (error) {
        console.error('Flight search error:', error);
        return NextResponse.json(
            { error: 'Failed to search flights' },
            { status: 500 }
        );
    }
}

function generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
}

function generateMockFlights(criteria: SearchCriteria): Flight[] {
    const flights: Flight[] = [];
    const baseDate = new Date(criteria.departureDate);

    // Generate flights for each airline
    PHILIPPINE_AIRLINES.forEach((airline, index) => {
        // Generate multiple flights per airline with different times
        const flightTimes = [
            { departure: '06:00', arrival: '08:30' },
            { departure: '09:15', arrival: '11:45' },
            { departure: '13:20', arrival: '15:50' },
            { departure: '16:30', arrival: '19:00' },
            { departure: '19:45', arrival: '22:15' }
        ];

        flightTimes.forEach((time, timeIndex) => {
            const departureTime = new Date(baseDate);
            const [depHour, depMin] = time.departure.split(':').map(Number);
            departureTime.setHours(depHour, depMin, 0, 0);

            const arrivalTime = new Date(baseDate);
            const [arrHour, arrMin] = time.arrival.split(':').map(Number);
            arrivalTime.setHours(arrHour, arrMin, 0, 0);

            const duration = Math.floor((arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60));

            // Price generation based on airline type and time
            let basePrice = 3000; // Base price in PHP

            // Adjust price based on airline type
            if (airline.type === 'budget') {
                basePrice = 2500 + Math.random() * 1500;
            } else if (airline.type === 'full-service') {
                basePrice = 4000 + Math.random() * 2000;
            } else {
                basePrice = 2800 + Math.random() * 1700;
            }

            // Peak hour pricing
            if (depHour >= 6 && depHour <= 9) basePrice *= 1.2; // Morning rush
            if (depHour >= 17 && depHour <= 20) basePrice *= 1.15; // Evening rush

            // Weekend pricing
            if (baseDate.getDay() === 0 || baseDate.getDay() === 6) {
                basePrice *= 1.1;
            }

            // Random price variation to simulate real-world pricing
            basePrice += (Math.random() - 0.5) * 500;

            const taxes = Math.floor(basePrice * 0.12); // 12% tax
            const total = Math.floor(basePrice + taxes);

            const originAirport = PHILIPPINE_AIRPORTS.find(a => a.code === criteria.origin);
            const destinationAirport = PHILIPPINE_AIRPORTS.find(a => a.code === criteria.destination);

            if (!originAirport || !destinationAirport) return;

            const flight: Flight = {
                id: `${airline.code}-${index}-${timeIndex}-${Date.now()}`,
                flightNumber: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
                airline,
                departure: {
                    airport: originAirport,
                    time: departureTime.toISOString(),
                    terminal: Math.random() > 0.5 ? String(Math.floor(Math.random() * 4) + 1) : undefined
                },
                arrival: {
                    airport: destinationAirport,
                    time: arrivalTime.toISOString(),
                    terminal: Math.random() > 0.5 ? String(Math.floor(Math.random() * 4) + 1) : undefined
                },
                duration,
                price: {
                    base: Math.floor(basePrice),
                    taxes,
                    total,
                    currency: 'PHP'
                },
                availability: {
                    seats: Math.floor(Math.random() * 50) + 10,
                    priceLockedUntil: undefined
                },
                aircraft: getRandomAircraft(airline.type),
                amenities: getAmenities(airline.type),
                bookingClass: 'Economy'
            };

            flights.push(flight);
        });
    });

    // Sort by price by default
    return flights.sort((a, b) => a.price.total - b.price.total);
}

function getRandomAircraft(airlineType: string): string {
    const aircraft = {
        budget: ['A320', 'A321', 'A319'],
        'full-service': ['A330', 'A321', 'A320', 'Boeing 777'],
        'low-cost': ['A320', 'A321', 'A319']
    };

    const options = aircraft[airlineType as keyof typeof aircraft] || aircraft.budget;
    return options[Math.floor(Math.random() * options.length)];
}

function getAmenities(airlineType: string): string[] {
    const baseAmenities = ['Carry-on baggage'];

    if (airlineType === 'full-service') {
        return [
            ...baseAmenities,
            'Checked baggage',
            'In-flight meal',
            'Entertainment system',
            'WiFi available'
        ];
    } else if (airlineType === 'budget') {
        return [
            ...baseAmenities,
            'Seat selection (paid)',
            'Snacks available for purchase'
        ];
    } else {
        return [
            ...baseAmenities,
            'Seat selection (paid)',
            'Meals for purchase'
        ];
    }
}
