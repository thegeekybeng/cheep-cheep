// Types for the Philippines domestic flight booking system

export interface Airline {
    code: string;
    name: string;
    type: 'budget' | 'full-service' | 'low-cost';
    carryOnIncluded: boolean;
    checkedBaggage: {
        included: boolean;
        weight: number; // in kg
        price?: number; // additional cost if not included
    };
    logo: string;
}

export interface Airport {
    code: string;
    name: string;
    city: string;
    region: string;
}

export interface Flight {
    id: string;
    flightNumber: string;
    airline: Airline;
    departure: {
        airport: Airport;
        time: string;
        terminal?: string;
    };
    arrival: {
        airport: Airport;
        time: string;
        terminal?: string;
    };
    duration: number; // in minutes
    price: {
        base: number;
        taxes: number;
        total: number;
        currency: 'PHP';
    };
    availability: {
        seats: number;
        priceLockedUntil?: string; // ISO string
    };
    aircraft: string;
    amenities: string[];
    bookingClass: 'Economy' | 'Premium Economy' | 'Business';
}

export interface SearchCriteria {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    };
    tripType: 'one-way' | 'round-trip';
    preferredAirlines?: string[];
    maxPrice?: number;
    departureTimeRange?: {
        earliest: string;
        latest: string;
    };
}

export interface PriceLock {
    flightId: string;
    lockedPrice: number;
    lockedAt: string;
    expiresAt: string;
    sessionId: string;
}

export interface BookingSession {
    id: string;
    flights: Flight[];
    priceLocks: PriceLock[];
    searchCriteria: SearchCriteria;
    createdAt: string;
    lastActivity: string;
}

// Anti-manipulation session data
export interface AntiTrackingSession {
    sessionId: string;
    userAgent: string;
    vpnEnabled: boolean;
    cookiesCleared: boolean;
    incognitoMode: boolean;
    searchHistory: SearchCriteria[];
}
