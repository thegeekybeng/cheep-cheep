# Philippines Flight Booking Tool - Streamlit Conversion Plan

## Overview

Convert the Next.js Philippines domestic flight booking application to a Streamlit web app for public demo deployment.

## Key Components to Convert

### 1. Core Data Structures

- Convert TypeScript types to Python dataclasses/Pydantic models
- Maintain Philippine airports, airlines, and routes data
- Preserve anti-price manipulation logic

### 2. UI Components

- **Flight Search Form** → Streamlit form with selectboxes, date inputs
- **Flight Results Display** → Streamlit dataframes and cards
- **Price Lock Feature** → Session state management
- **Airline Comparison** → Interactive charts and tables

### 3. Backend Logic

- Convert API routes to Python functions
- Implement mock flight search (or integrate real APIs)
- Price lock mechanism using session state
- Anti-tracking features simulation

## Implementation Steps

### Phase 1: Setup & Core Structure

```bash
# Create new Streamlit app directory
mkdir streamlit_demo
cd streamlit_demo

# Install dependencies
pip install streamlit pandas plotly requests datetime python-dotenv
```

### Phase 2: Data Models

- Create `models.py` with airline, airport, flight dataclasses
- Port `philippines.ts` data to `data/philippines.py`
- Implement flight search logic

### Phase 3: Streamlit App

- Main app (`app.py`) with search interface
- Sidebar for filters and preferences
- Results display with price comparison
- Price lock timer functionality

### Phase 4: Features

- Mock flight data generation
- Price manipulation bypass simulation
- Carry-on guarantee highlighting
- Philippine airline-specific logic

### Phase 5: Deployment

- Streamlit Cloud deployment
- Environment configuration
- Performance optimization

## Key Streamlit Features to Use

1. **st.form()** - Flight search form
2. **st.selectbox()** - Airport selection
3. **st.date_input()** - Travel dates
4. **st.dataframe()** - Flight results
5. **st.plotly_chart()** - Price comparison charts
6. **st.session_state** - Price locks and user data
7. **st.sidebar** - Filters and settings
8. **st.progress()** - Loading indicators
9. **st.timer()** - Price lock countdown
10. **st.columns()** - Layout management

## Advantages of Streamlit Version

1. **Easy Deployment** - One-click deployment to Streamlit Cloud
2. **Public Access** - Shareable public URL
3. **Real-time Updates** - Easy to modify and deploy changes
4. **Data Visualization** - Built-in charts for price comparisons
5. **Rapid Prototyping** - Faster development cycle
6. **Python Ecosystem** - Access to ML/AI libraries for price prediction

## File Structure

```
streamlit_demo/
├── app.py                 # Main Streamlit application
├── models.py             # Data models (Flight, Airline, etc.)
├── services/
│   ├── flight_search.py  # Flight search logic
│   ├── price_lock.py     # Price locking mechanism
│   └── anti_tracking.py  # Anti-manipulation features
├── data/
│   ├── philippines.py    # Airport and airline data
│   └── mock_flights.py   # Sample flight data
├── utils/
│   ├── helpers.py        # Utility functions
│   └── validators.py     # Input validation
├── requirements.txt      # Dependencies
└── README.md            # Setup instructions
```

## Demo Features Priority

### Must-Have (MVP)

1. ✅ Airport selection (Philippine domestic)
2. ✅ Date selection with validation
3. ✅ Flight search results display
4. ✅ Price comparison between airlines
5. ✅ Carry-on guarantee highlighting
6. ✅ Basic price lock simulation

### Nice-to-Have

1. 🔄 Real-time price updates
2. 🔄 Interactive price charts
3. 🔄 Booking flow simulation
4. 🔄 User preferences storage
5. 🔄 Mobile-responsive design
6. 🔄 Export/share functionality

### Advanced Features

1. 🚀 ML-based price prediction
2. 🚀 Historical price analysis
3. 🚀 Smart recommendations
4. 🚀 Multi-currency support
5. 🚀 API integration with real flight data
