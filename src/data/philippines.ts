// Philippine domestic airports and airlines data

import { Airport, Airline } from '@/types/flight';

export const PHILIPPINE_AIRPORTS: Airport[] = [
    {
        code: 'MNL',
        name: 'Ninoy Aquino International Airport',
        city: 'Manila',
        region: 'Metro Manila'
    },
    {
        code: 'CEB',
        name: 'Mactan-Cebu International Airport',
        city: 'Cebu City',
        region: 'Central Visayas'
    },
    {
        code: 'DVO',
        name: 'Francisco Bangoy International Airport',
        city: 'Davao City',
        region: 'Davao Region'
    },
    {
        code: 'ILO',
        name: 'Iloilo International Airport',
        city: 'Iloilo City',
        region: 'Western Visayas'
    },
    {
        code: 'KLO',
        name: 'Kalibo International Airport',
        city: 'Kalibo',
        region: 'Western Visayas'
    },
    {
        code: 'BCD',
        name: 'Bacolod-Silay Airport',
        city: 'Bacolod',
        region: 'Western Visayas'
    },
    {
        code: 'TAG',
        name: 'Tagbilaran Airport',
        city: 'Tagbilaran',
        region: 'Central Visayas'
    },
    {
        code: 'CYZ',
        name: 'Cauayan Airport',
        city: 'Cauayan',
        region: 'Cagayan Valley'
    },
    {
        code: 'LAO',
        name: 'Laoag International Airport',
        city: 'Laoag',
        region: 'Ilocos Region'
    },
    {
        code: 'TUG',
        name: 'Tuguegarao Airport',
        city: 'Tuguegarao',
        region: 'Cagayan Valley'
    },
    {
        code: 'ZAM',
        name: 'Zamboanga International Airport',
        city: 'Zamboanga City',
        region: 'Zamboanga Peninsula'
    },
    {
        code: 'GES',
        name: 'General Santos Airport',
        city: 'General Santos',
        region: 'Soccsksargen'
    },
    {
        code: 'CYP',
        name: 'Calbayog Airport',
        city: 'Calbayog',
        region: 'Eastern Visayas'
    },
    {
        code: 'TAC',
        name: 'Daniel Z. Romualdez Airport',
        city: 'Tacloban',
        region: 'Eastern Visayas'
    },
    {
        code: 'PPS',
        name: 'Puerto Princesa Airport',
        city: 'Puerto Princesa',
        region: 'Mimaropa'
    },
    {
        code: 'CGY',
        name: 'Laguindingan Airport',
        city: 'Cagayan de Oro',
        region: 'Northern Mindanao'
    },
    {
        code: 'BXU',
        name: 'Butuan Airport',
        city: 'Butuan',
        region: 'Caraga'
    },
    {
        code: 'CDO',
        name: 'Lumbia Airport',
        city: 'Cagayan de Oro',
        region: 'Northern Mindanao'
    },
    {
        code: 'LGP',
        name: 'Legaspi Airport',
        city: 'Legazpi',
        region: 'Bicol Region'
    },
    {
        code: 'WNP',
        name: 'Naga Airport',
        city: 'Naga',
        region: 'Bicol Region'
    }
];

export const PHILIPPINE_AIRLINES: Airline[] = [
    {
        code: '5J',
        name: 'Cebu Pacific',
        type: 'budget',
        carryOnIncluded: true,
        checkedBaggage: {
            included: false,
            weight: 20,
            price: 1500 // PHP
        },
        logo: '/airlines/cebu-pacific.png'
    },
    {
        code: 'PR',
        name: 'Philippine Airlines',
        type: 'full-service',
        carryOnIncluded: true,
        checkedBaggage: {
            included: true,
            weight: 23,
            price: 0
        },
        logo: '/airlines/philippine-airlines.png'
    },
    {
        code: 'Z2',
        name: 'Philippines AirAsia',
        type: 'low-cost',
        carryOnIncluded: true,
        checkedBaggage: {
            included: false,
            weight: 20,
            price: 1200 // PHP
        },
        logo: '/airlines/airasia.png'
    },
    {
        code: 'M8',
        name: 'Skyjet Airlines',
        type: 'budget',
        carryOnIncluded: true,
        checkedBaggage: {
            included: false,
            weight: 15,
            price: 1000 // PHP
        },
        logo: '/airlines/skyjet.png'
    },
    {
        code: 'DG',
        name: 'Cebgo',
        type: 'budget',
        carryOnIncluded: true,
        checkedBaggage: {
            included: false,
            weight: 20,
            price: 1300 // PHP
        },
        logo: '/airlines/cebgo.png'
    },
    {
        code: '2P',
        name: 'PAL Express',
        type: 'full-service',
        carryOnIncluded: true,
        checkedBaggage: {
            included: true,
            weight: 20,
            price: 0
        },
        logo: '/airlines/pal-express.png'
    }
];

// Popular domestic routes in the Philippines
export const POPULAR_ROUTES = [
    { origin: 'MNL', destination: 'CEB', route: 'Manila to Cebu' },
    { origin: 'MNL', destination: 'DVO', route: 'Manila to Davao' },
    { origin: 'MNL', destination: 'ILO', route: 'Manila to Iloilo' },
    { origin: 'MNL', destination: 'KLO', route: 'Manila to Kalibo' },
    { origin: 'MNL', destination: 'BCD', route: 'Manila to Bacolod' },
    { origin: 'CEB', destination: 'DVO', route: 'Cebu to Davao' },
    { origin: 'CEB', destination: 'ILO', route: 'Cebu to Iloilo' },
    { origin: 'CEB', destination: 'TAG', route: 'Cebu to Tagbilaran' },
    { origin: 'MNL', destination: 'PPS', route: 'Manila to Puerto Princesa' },
    { origin: 'MNL', destination: 'ZAM', route: 'Manila to Zamboanga' },
    { origin: 'CEB', destination: 'BCD', route: 'Cebu to Bacolod' },
    { origin: 'MNL', destination: 'GES', route: 'Manila to General Santos' },
    { origin: 'MNL', destination: 'TAC', route: 'Manila to Tacloban' },
    { origin: 'CEB', destination: 'ZAM', route: 'Cebu to Zamboanga' },
    { origin: 'MNL', destination: 'CGY', route: 'Manila to Cagayan de Oro' }
];

export const BUDGET_AIRLINES = ['5J', 'Z2', 'M8', 'DG'];
export const FULL_SERVICE_AIRLINES = ['PR', '2P'];
