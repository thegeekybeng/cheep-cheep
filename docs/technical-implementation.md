# Technical Implementation Plan - Multi-Market Expansion

## 🏗️ Architecture for Multi-Market Support

### Database Schema Changes

```sql
-- Countries and Markets
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(2) UNIQUE NOT NULL, -- ID, VN, PH
    name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL, -- IDR, VND, PHP
    language_code VARCHAR(5) NOT NULL, -- id-ID, vi-VN, en-PH
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Airlines per Market
CREATE TABLE airlines (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    country_id INT REFERENCES countries(id),
    type VARCHAR(20) NOT NULL, -- budget, full-service, low-cost
    carry_on_included BOOLEAN DEFAULT true,
    checked_baggage_included BOOLEAN DEFAULT false,
    checked_baggage_weight INT DEFAULT 20,
    checked_baggage_price DECIMAL(10,2),
    logo_url VARCHAR(255),
    api_endpoint VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Airports per Market
CREATE TABLE airports (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country_id INT REFERENCES countries(id),
    region VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Flight Routes per Market
CREATE TABLE flight_routes (
    id SERIAL PRIMARY KEY,
    origin_airport_id INT REFERENCES airports(id),
    destination_airport_id INT REFERENCES airports(id),
    airline_id INT REFERENCES airlines(id),
    average_duration INT, -- in minutes
    frequency VARCHAR(20), -- daily, weekly, seasonal
    seasonal_start DATE,
    seasonal_end DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Market-specific Pricing
CREATE TABLE market_pricing (
    id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(id),
    base_price_multiplier DECIMAL(3,2) DEFAULT 1.0,
    tax_rate DECIMAL(5,4) DEFAULT 0.12,
    fuel_surcharge DECIMAL(10,2) DEFAULT 0,
    airport_fee DECIMAL(10,2) DEFAULT 0,
    government_fee DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences per Market
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INT,
    country_id INT REFERENCES countries(id),
    preferred_currency VARCHAR(3),
    preferred_language VARCHAR(5),
    preferred_airlines TEXT[], -- JSON array
    price_alert_threshold DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Structure Changes

```typescript
// Multi-market flight search endpoint
// POST /api/v2/flights/search/{country_code}

interface MultiMarketSearchRequest {
    market: 'ID' | 'VN' | 'PH';
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
    currency?: string;
    language?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    preferredAirlines?: string[];
}

interface MultiMarketSearchResponse {
    flights: Flight[];
    market: MarketInfo;
    antiTrackingSession: AntiTrackingSession;
    searchId: string;
    priceGuarantee: PriceGuarantee;
    currency: CurrencyInfo;
    taxes: TaxBredown;
    regulations: MarketRegulations;
}

interface MarketInfo {
    country: string;
    currency: string;
    language: string;
    timezone: string;
    regulations: {
        maxAdvanceBooking: number; // days
        cancellationPolicy: string;
        refundPolicy: string;
        baggageRules: BaggageRule[];
    };
}
```

### Configuration System

```typescript
// Market-specific configuration
export const MARKET_CONFIG = {
    ID: {
        country: 'Indonesia',
        currency: 'IDR',
        language: 'id-ID',
        timezone: 'Asia/Jakarta',
        dateFormat: 'DD/MM/YYYY',
        priceFormat: 'Rp {amount}',
        paymentMethods: ['gopay', 'ovo', 'dana', 'bank_transfer'],
        regulations: {
            maxAdvanceBooking: 330,
            minAdvanceBooking: 1,
            cancellationWindow: 24,
            refundProcessing: 7
        },
        airlines: INDONESIAN_AIRLINES,
        airports: INDONESIAN_AIRPORTS,
        popularRoutes: INDONESIAN_ROUTES
    },
    VN: {
        country: 'Vietnam',
        currency: 'VND',
        language: 'vi-VN',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        priceFormat: '{amount} ₫',
        paymentMethods: ['momo', 'zalopay', 'vietqr', 'bank_transfer'],
        regulations: {
            maxAdvanceBooking: 365,
            minAdvanceBooking: 2,
            cancellationWindow: 24,
            refundProcessing: 10
        },
        airlines: VIETNAMESE_AIRLINES,
        airports: VIETNAMESE_AIRPORTS,
        popularRoutes: VIETNAMESE_ROUTES
    },
    PH: {
        country: 'Philippines',
        currency: 'PHP',
        language: 'en-PH',
        timezone: 'Asia/Manila',
        dateFormat: 'MM/DD/YYYY',
        priceFormat: '₱{amount}',
        paymentMethods: ['gcash', 'paymaya', 'grabpay', 'bank_transfer'],
        regulations: {
            maxAdvanceBooking: 365,
            minAdvanceBooking: 1,
            cancellationWindow: 24,
            refundProcessing: 5
        },
        airlines: PHILIPPINE_AIRLINES,
        airports: PHILIPPINE_AIRPORTS,
        popularRoutes: PHILIPPINE_ROUTES
    }
};
```

### Internationalization (i18n) Setup

```typescript
// Localization files structure
// locales/id-ID/common.json
{
    "search": {
        "from": "Dari",
        "to": "Ke",
        "departure": "Keberangkatan",
        "return": "Kembali",
        "passengers": "Penumpang",
        "adults": "Dewasa",
        "children": "Anak",
        "infants": "Bayi",
        "search_flights": "Cari Penerbangan"
    },
    "results": {
        "flights_found": "{count} penerbangan ditemukan",
        "price_locked": "Harga terkunci",
        "carry_on_included": "Bagasi kabin termasuk",
        "checked_baggage": "Bagasi tercatat",
        "duration": "Durasi",
        "direct_flight": "Penerbangan langsung"
    },
    "airlines": {
        "garuda": "Garuda Indonesia",
        "lion": "Lion Air",
        "citilink": "Citilink"
    }
}

// locales/vi-VN/common.json
{
    "search": {
        "from": "Từ",
        "to": "Đến",
        "departure": "Khởi hành",
        "return": "Về",
        "passengers": "Hành khách",
        "adults": "Người lớn",
        "children": "Trẻ em",
        "infants": "Em bé",
        "search_flights": "Tìm chuyến bay"
    },
    "results": {
        "flights_found": "Tìm thấy {count} chuyến bay",
        "price_locked": "Giá đã khóa",
        "carry_on_included": "Hành lý xách tay bao gồm",
        "checked_baggage": "Hành lý ký gửi",
        "duration": "Thời gian",
        "direct_flight": "Bay thẳng"
    },
    "airlines": {
        "vietnam_airlines": "Vietnam Airlines",
        "vietjet": "VietJet Air",
        "bamboo": "Bamboo Airways"
    }
}
```

### Payment Integration

```typescript
// Payment gateway integration per market
export const PAYMENT_GATEWAYS = {
    ID: {
        gopay: {
            apiKey: process.env.GOPAY_API_KEY,
            merchantId: process.env.GOPAY_MERCHANT_ID,
            environment: 'sandbox' // or 'production'
        },
        ovo: {
            apiKey: process.env.OVO_API_KEY,
            merchantId: process.env.OVO_MERCHANT_ID
        },
        dana: {
            apiKey: process.env.DANA_API_KEY,
            merchantId: process.env.DANA_MERCHANT_ID
        }
    },
    VN: {
        momo: {
            partnerCode: process.env.MOMO_PARTNER_CODE,
            accessKey: process.env.MOMO_ACCESS_KEY,
            secretKey: process.env.MOMO_SECRET_KEY
        },
        zalopay: {
            appId: process.env.ZALOPAY_APP_ID,
            key1: process.env.ZALOPAY_KEY1,
            key2: process.env.ZALOPAY_KEY2
        }
    },
    PH: {
        gcash: {
            apiKey: process.env.GCASH_API_KEY,
            merchantId: process.env.GCASH_MERCHANT_ID
        },
        paymaya: {
            apiKey: process.env.PAYMAYA_API_KEY,
            publicKey: process.env.PAYMAYA_PUBLIC_KEY
        }
    }
};
```

### Deployment Strategy

```yaml
# docker-compose.yml for multi-market deployment
version: '3.8'
services:
  app-ph:
    build: .
    environment:
      - MARKET=PH
      - DATABASE_URL=postgresql://user:pass@db-ph:5432/cheep_ph
      - REDIS_URL=redis://redis-ph:6379
    ports:
      - "3000:3000"
    
  app-id:
    build: .
    environment:
      - MARKET=ID
      - DATABASE_URL=postgresql://user:pass@db-id:5432/cheep_id
      - REDIS_URL=redis://redis-id:6379
    ports:
      - "3001:3000"
    
  app-vn:
    build: .
    environment:
      - MARKET=VN
      - DATABASE_URL=postgresql://user:pass@db-vn:5432/cheep_vn
      - REDIS_URL=redis://redis-vn:6379
    ports:
      - "3002:3000"
```

### Market-Specific Data

```typescript
// Indonesian Airlines
export const INDONESIAN_AIRLINES: Airline[] = [
    {
        code: 'GA',
        name: 'Garuda Indonesia',
        type: 'full-service',
        carryOnIncluded: true,
        checkedBaggage: { included: true, weight: 23, price: 0 },
        logo: '/airlines/garuda.png'
    },
    {
        code: 'JT',
        name: 'Lion Air',
        type: 'low-cost',
        carryOnIncluded: true,
        checkedBaggage: { included: false, weight: 20, price: 200000 }, // IDR
        logo: '/airlines/lion.png'
    },
    {
        code: 'QG',
        name: 'Citilink',
        type: 'budget',
        carryOnIncluded: true,
        checkedBaggage: { included: false, weight: 20, price: 150000 }, // IDR
        logo: '/airlines/citilink.png'
    }
];

// Vietnamese Airlines
export const VIETNAMESE_AIRLINES: Airline[] = [
    {
        code: 'VN',
        name: 'Vietnam Airlines',
        type: 'full-service',
        carryOnIncluded: true,
        checkedBaggage: { included: true, weight: 23, price: 0 },
        logo: '/airlines/vietnam-airlines.png'
    },
    {
        code: 'VJ',
        name: 'VietJet Air',
        type: 'low-cost',
        carryOnIncluded: true,
        checkedBaggage: { included: false, weight: 20, price: 400000 }, // VND
        logo: '/airlines/vietjet.png'
    },
    {
        code: 'QH',
        name: 'Bamboo Airways',
        type: 'full-service',
        carryOnIncluded: true,
        checkedBaggage: { included: true, weight: 23, price: 0 },
        logo: '/airlines/bamboo.png'
    }
];
```

This technical implementation provides a solid foundation for expanding CheepCheep to multiple emerging markets while maintaining the core anti-manipulation and price lock features.
