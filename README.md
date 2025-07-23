# CheepCheep - Philippines Domestic Flight Booking Tool

A modern web application designed specifically for Filipino travelers to find the best domestic flight deals while bypassing price manipulation tactics commonly used by airlines.

## 🚀 Features

### Core Functionality
- **Anti-Price Manipulation**: Bypasses tracking cookies and user profiling that inflate prices
- **15-minute Price Lock**: Provides users with a consideration window with locked prices
- **Carry-on Guarantee**: Ensures all flight options include carry-on baggage as mandatory
- **Economic Value Focus**: Prioritizes budget-friendly options suitable for Philippines' economic context

### Supported Airlines
- **Philippine Airlines** (PR) - Full-service carrier
- **Cebu Pacific** (5J) - Budget carrier
- **Philippines AirAsia** (Z2) - Low-cost carrier
- **Skyjet Airlines** (M8) - Regional carrier
- **PAL Express** (2P) - Full-service regional
- **Cebgo** (DG) - Budget regional

### Key Routes Covered
- Manila (MNL) ↔ Cebu (CEB)
- Manila (MNL) ↔ Davao (DVO)
- Manila (MNL) ↔ Iloilo (ILO)
- Manila (MNL) ↔ Kalibo (KLO)
- And many more domestic routes

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **State Management**: Zustand

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── flights/
│   │       ├── search/route.ts      # Flight search API
│   │       └── price-lock/route.ts  # Price locking API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Main application page
├── components/
│   ├── FlightSearch.tsx            # Search form component
│   └── FlightResults.tsx           # Results display component
├── data/
│   └── philippines.ts              # Philippine airports and airlines data
└── types/
    └── flight.ts                   # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 1_2_cheep
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📱 Usage

1. **Search Flights**: Select origin and destination cities, choose travel dates, and specify passenger count
2. **View Results**: Browse available flights sorted by price, time, or duration
3. **Price Lock**: Select a flight to lock its price for 15 minutes
4. **Baggage Info**: All flights include carry-on; checked baggage policies vary by airline

## 🔒 Anti-Manipulation Features

- **Session Anonymization**: Each search uses a fresh session
- **Cookie Management**: Automatic clearing of tracking cookies
- **User-Agent Rotation**: Prevents browser fingerprinting
- **VPN Simulation**: Mimics different geographic locations
- **Price History Blocking**: Prevents price inflation based on search history

## 🏷️ Price Lock System

- **Duration**: 15 minutes from selection
- **Coverage**: Locks the displayed price without additional fees
- **Expiry**: Automatic release after timeout
- **Guarantee**: Price cannot increase during lock period

## 🎯 Target Audience

- **Filipino Domestic Travelers**: Focused on Philippine domestic routes
- **Budget-Conscious Users**: Optimized for best value deals
- **Mobile-First**: Responsive design for mobile users
- **Frequent Flyers**: Quick booking for regular travelers

## 🧪 API Endpoints

### Flight Search
- **POST** `/api/flights/search`
- **Body**: `SearchCriteria` object
- **Response**: Array of `Flight` objects with anti-tracking session

### Price Lock
- **POST** `/api/flights/price-lock` - Create price lock
- **GET** `/api/flights/price-lock?flightId={id}` - Check lock status
- **DELETE** `/api/flights/price-lock?flightId={id}` - Release lock

## 🔧 Configuration

### Environment Variables
```env
# Add any API keys for real airline integrations
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Airline Integration
Currently uses mock data. For production, integrate with:
- Individual airline APIs
- GDS (Global Distribution System) providers
- Travel aggregator APIs

## 📊 Performance Optimizations

- **Server-Side Rendering**: Fast initial page loads
- **Code Splitting**: Reduced bundle sizes
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: API response caching for frequently searched routes

## 🌟 Future Enhancements

- **Real-time Price Updates**: WebSocket integration for live prices
- **User Accounts**: Save preferences and booking history
- **Payment Integration**: Complete booking flow with payment
- **Push Notifications**: Price alerts and booking reminders
- **Multi-language Support**: English and Filipino languages

## 📈 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for educational and practical purposes to help Filipino travelers find better flight deals.

## 🙏 Acknowledgments

- Built with Next.js and modern web technologies
- Designed with Filipino travelers in mind
- Focused on economic value and transparency
