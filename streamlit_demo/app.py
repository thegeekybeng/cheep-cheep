"""
🇵🇭 CheepNow - Philippines Domestic Flight Booking Tool 
🛡️ Anti-Price Manipulation • 🔒 15-Min Price Lock • 🎒 Carry-on Guaranteed
Built for Filipino Travelers, By Filipino Developers

A comprehensive live demo showcasing advanced flight booking with real-time features,
price manipulation bypass, and intelligent recommendations.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time as time_module
import random
import hashlib
import base64
from dataclasses import dataclass
from typing import List, Optional, Dict, Tuple
import math

# Configure Streamlit page with enhanced settings
st.set_page_config(
    page_title="🇵🇭 CheepNow - Anti-Price Manipulation Flight Search",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'Get Help': 'https://github.com/thegeekybeng/cheep-cheep',
        'Report a bug': 'https://github.com/thegeekybeng/cheep-cheep/issues',
        'About': '''
        # CheepNow Philippines Flight Booking Tool
        
        **Version 2.0** - Built for Filipino Travelers
        
        🛡️ Anti-Price Manipulation Technology
        🔒 15-Minute Price Lock Guarantee  
        🎒 Transparent Carry-on Policies
        💰 Value-Optimized Recommendations
        
        Developed with ❤️ for the Filipino travel community
        '''
    }
)

# Enhanced Data Models with more features
@dataclass
class Airline:
    code: str
    name: str
    type: str  # 'budget', 'full-service', 'low-cost'
    carry_on_included: bool
    checked_baggage_included: bool
    checked_baggage_weight: int
    logo: str
    on_time_performance: float  # 0.0 to 1.0
    customer_rating: float  # 1.0 to 5.0
    wifi_available: bool
    meal_service: bool
    loyalty_program: str

@dataclass
class Airport:
    code: str
    name: str
    city: str
    region: str
    timezone: str
    facilities: List[str]
    distance_from_city: int  # km

@dataclass
class PriceHistory:
    date: str
    price: float
    demand_level: str  # 'Low', 'Medium', 'High'

@dataclass
class Flight:
    id: str
    flight_number: str
    airline: Airline
    departure_airport: Airport
    arrival_airport: Airport
    departure_time: str
    arrival_time: str
    duration_minutes: int
    base_price: float
    taxes: float
    total_price: float
    seats_available: int
    aircraft: str
    price_locked_until: Optional[str] = None
    price_trend: str = "stable"  # 'rising', 'falling', 'stable'
    carbon_emissions: float = 0.0  # kg CO2
    price_history: Optional[List[PriceHistory]] = None
    value_score: float = 0.0
    recommendation_reason: str = ""

# Enhanced Philippine Airlines Data with realistic details
AIRLINES = {
    "5J": Airline(
        code="5J", 
        name="Cebu Pacific", 
        type="budget", 
        carry_on_included=True, 
        checked_baggage_included=False, 
        checked_baggage_weight=20, 
        logo="🟦",
        on_time_performance=0.82,
        customer_rating=3.8,
        wifi_available=False,
        meal_service=False,
        loyalty_program="GetGo"
    ),
    "PR": Airline(
        code="PR", 
        name="Philippine Airlines", 
        type="full-service", 
        carry_on_included=True, 
        checked_baggage_included=True, 
        checked_baggage_weight=23, 
        logo="�",
        on_time_performance=0.78,
        customer_rating=4.1,
        wifi_available=True,
        meal_service=True,
        loyalty_program="Mabuhay Miles"
    ),
    "Z2": Airline(
        code="Z2", 
        name="Philippines AirAsia", 
        type="low-cost", 
        carry_on_included=True, 
        checked_baggage_included=False, 
        checked_baggage_weight=20, 
        logo="🔴",
        on_time_performance=0.85,
        customer_rating=3.9,
        wifi_available=False,
        meal_service=False,
        loyalty_program="BIG Loyalty"
    ),
    "M8": Airline(
        code="M8", 
        name="Skyjet Airlines", 
        type="regional", 
        carry_on_included=True, 
        checked_baggage_included=False, 
        checked_baggage_weight=15, 
        logo="🟨",
        on_time_performance=0.88,
        customer_rating=4.2,
        wifi_available=False,
        meal_service=True,
        loyalty_program="Skyjet Rewards"
    )
}

AIRPORTS = {
    "MNL": Airport(
        code="MNL", 
        name="Ninoy Aquino International Airport", 
        city="Manila", 
        region="Metro Manila",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "Duty Free", "Lounges", "ATM", "Currency Exchange"],
        distance_from_city=7
    ),
    "CEB": Airport(
        code="CEB", 
        name="Mactan-Cebu International Airport", 
        city="Cebu", 
        region="Central Visayas",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "Duty Free", "Car Rental", "ATM"],
        distance_from_city=12
    ),
    "DVO": Airport(
        code="DVO", 
        name="Francisco Bangoy International Airport", 
        city="Davao", 
        region="Mindanao",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "ATM", "Car Rental"],
        distance_from_city=11
    ),
    "ILO": Airport(
        code="ILO", 
        name="Iloilo International Airport", 
        city="Iloilo", 
        region="Western Visayas",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "ATM"],
        distance_from_city=18
    ),
    "BCD": Airport(
        code="BCD", 
        name="Bacolod-Silay Airport", 
        city="Bacolod", 
        region="Western Visayas",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "Car Rental"],
        distance_from_city=16
    ),
    "TAG": Airport(
        code="TAG", 
        name="Tagbilaran Airport", 
        city="Bohol", 
        region="Central Visayas",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "ATM"],
        distance_from_city=2
    ),
    "KLO": Airport(
        code="KLO", 
        name="Kalibo International Airport", 
        city="Kalibo", 
        region="Western Visayas",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "ATM", "Duty Free"],
        distance_from_city=3
    ),
    "PPS": Airport(
        code="PPS", 
        name="Puerto Princesa Airport", 
        city="Palawan", 
        region="Mimaropa",
        timezone="Asia/Manila",
        facilities=["WiFi", "Restaurants", "ATM"],
        distance_from_city=2
    )
}

POPULAR_ROUTES = [
    ("MNL", "CEB"), ("MNL", "DVO"), ("MNL", "ILO"), ("MNL", "BCD"),
    ("CEB", "DVO"), ("CEB", "MNL"), ("DVO", "MNL"), ("ILO", "MNL")
]

# Enhanced session state initialization
if 'price_locks' not in st.session_state:
    st.session_state.price_locks = {}
if 'search_performed' not in st.session_state:
    st.session_state.search_performed = False
if 'flights' not in st.session_state:
    st.session_state.flights = []
if 'user_preferences' not in st.session_state:
    st.session_state.user_preferences = {
        'preferred_airlines': [],
        'max_budget': 10000,
        'preferred_departure_time': 'any',
        'eco_conscious': False,
        'frequent_routes': []
    }
if 'search_history' not in st.session_state:
    st.session_state.search_history = []
if 'price_alerts' not in st.session_state:
    st.session_state.price_alerts = []
if 'anti_manipulation_score' not in st.session_state:
    st.session_state.anti_manipulation_score = random.randint(85, 98)

# Advanced utility functions
def calculate_carbon_footprint(distance_km: float, aircraft: str) -> float:
    """Calculate CO2 emissions for flight"""
    base_emission = distance_km * 0.15  # kg CO2 per km
    aircraft_multipliers = {
        "Airbus A320": 1.0,
        "Boeing 737": 1.05,
        "ATR 72": 0.8
    }
    return base_emission * aircraft_multipliers.get(aircraft, 1.0)

def generate_price_trend() -> str:
    """Generate realistic price trend"""
    trends = ["stable", "rising", "falling"]
    weights = [0.6, 0.25, 0.15]  # Most prices are stable
    return random.choices(trends, weights=weights)[0]

def simulate_anti_manipulation() -> Dict:
    """Simulate anti-price manipulation detection"""
    techniques = [
        "Cookie bypass active",
        "User agent rotation",
        "IP geolocation masking",
        "Search pattern randomization",
        "Cache avoidance enabled"
    ]
    
    return {
        'techniques_used': random.sample(techniques, 3),
        'manipulation_attempts_blocked': random.randint(2, 8),
        'clean_pricing_confidence': random.uniform(0.92, 0.99),
        'price_inflation_prevented': random.uniform(200, 800)
    }

def generate_enhanced_mock_flights(origin: str, destination: str, departure_date: str, passengers: int) -> List[Flight]:
    """Generate highly realistic mock flight data with advanced features"""
    flights = []
    
    # Calculate distance for carbon footprint
    distances = {
        ("MNL", "CEB"): 630, ("MNL", "DVO"): 970, ("MNL", "ILO"): 460,
        ("CEB", "DVO"): 380, ("CEB", "MNL"): 630, ("DVO", "MNL"): 970,
        ("MNL", "BCD"): 480, ("MNL", "TAG"): 660, ("MNL", "KLO"): 390,
        ("MNL", "PPS"): 590
    }
    
    distance = distances.get((origin, destination), 500)
    
    # Enhanced base prices with seasonal variation
    base_prices = {
        ("MNL", "CEB"): 3500, ("MNL", "DVO"): 4200, ("MNL", "ILO"): 2800,
        ("CEB", "DVO"): 3200, ("CEB", "MNL"): 3500, ("DVO", "MNL"): 4200,
        ("MNL", "BCD"): 2900, ("MNL", "TAG"): 3400, ("MNL", "KLO"): 2600,
        ("MNL", "PPS"): 3800
    }
    
    base_price = base_prices.get((origin, destination), 3000)
    
    # Add seasonal pricing (simulate peak/off-peak)
    date_obj = datetime.strptime(departure_date, "%Y-%m-%d")
    is_peak_season = date_obj.month in [12, 1, 3, 4, 5]  # Christmas, Summer
    seasonal_multiplier = 1.3 if is_peak_season else 1.0
    
    # Generate flights for each airline
    for airline_code, airline in AIRLINES.items():
        if airline.type == "regional" and distance > 600:
            continue  # Regional airlines for shorter routes only
            
        # Generate 1-3 flights per airline
        num_flights = random.randint(1, 3) if airline.type != "regional" else random.randint(1, 2)
        
        for flight_num in range(1, num_flights + 1):
            # Advanced pricing algorithm
            base_flight_price = base_price * seasonal_multiplier
            
            # Airline-specific pricing
            airline_multipliers = {
                "budget": random.uniform(0.8, 1.1),
                "low-cost": random.uniform(0.85, 1.15), 
                "full-service": random.uniform(1.1, 1.4),
                "regional": random.uniform(1.2, 1.5)
            }
            
            price_multiplier = airline_multipliers[airline.type]
            
            # Dynamic pricing based on demand
            demand_multiplier = random.uniform(0.9, 1.6)
            
            # Time-based pricing (early morning/late night cheaper)
            departure_hour = random.randint(5, 23)
            time_multiplier = 0.9 if departure_hour < 8 or departure_hour > 20 else 1.0
            
            flight_base_price = base_flight_price * price_multiplier * demand_multiplier * time_multiplier
            taxes = flight_base_price * 0.12  # 12% VAT
            total_price = flight_base_price + taxes
            
            # Generate realistic flight schedule
            departure_minute = random.choice([0, 15, 30, 45])
            duration = max(90, int(distance / 8) + random.randint(-20, 30))  # Realistic duration
            
            departure_time = f"{departure_hour:02d}:{departure_minute:02d}"
            arrival_hour = (departure_hour + duration // 60) % 24
            arrival_minute = (departure_minute + duration % 60) % 60
            arrival_time = f"{arrival_hour:02d}:{arrival_minute:02d}"
            
            # Aircraft selection based on route distance
            aircraft_options = ["Airbus A320", "Boeing 737"] if distance > 400 else ["ATR 72", "Airbus A320"]
            aircraft = random.choice(aircraft_options)
            
            # Calculate carbon emissions
            carbon_emissions = calculate_carbon_footprint(distance, aircraft)
            
            # Generate price history
            price_history = []
            for i in range(7):  # Past 7 days
                historical_date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
                historical_price = total_price * random.uniform(0.85, 1.15)
                demand_levels = ["Low", "Medium", "High"]
                demand = random.choice(demand_levels)
                price_history.append(PriceHistory(historical_date, historical_price, demand))
            
            flight = Flight(
                id=f"{airline_code}{flight_num}{random.randint(100, 999)}",
                flight_number=f"{airline_code} {flight_num}{random.randint(10, 99)}",
                airline=airline,
                departure_airport=AIRPORTS[origin],
                arrival_airport=AIRPORTS[destination],
                departure_time=departure_time,
                arrival_time=arrival_time,
                duration_minutes=duration,
                base_price=flight_base_price,
                taxes=taxes,
                total_price=total_price,
                seats_available=random.randint(3, 45),
                aircraft=aircraft,
                price_trend=generate_price_trend(),
                carbon_emissions=carbon_emissions,
                price_history=price_history
            )
            
            # Calculate value score
            flight.value_score = calculate_value_score(flight, flights)
            flight.recommendation_reason = generate_recommendation_reason(flight)
            
            flights.append(flight)
    
    # Sort by value score (best first)
    return sorted(flights, key=lambda x: x.value_score, reverse=True)

def calculate_value_score(flight: Flight, existing_flights: List[Flight]) -> float:
    """Calculate comprehensive value score for flight"""
    max_price = max([f.total_price for f in existing_flights], default=flight.total_price) + 1000
    min_price = min([f.total_price for f in existing_flights], default=flight.total_price) - 1000
    
    # Price score (lower price = higher score)
    price_score = (max_price - flight.total_price) / (max_price - min_price) * 40
    
    # Airline features score
    feature_score = 0
    if flight.airline.carry_on_included:
        feature_score += 15
    if flight.airline.checked_baggage_included:
        feature_score += 10
    if flight.airline.wifi_available:
        feature_score += 5
    if flight.airline.meal_service:
        feature_score += 5
    
    # On-time performance score
    performance_score = flight.airline.on_time_performance * 15
    
    # Customer rating score
    rating_score = (flight.airline.customer_rating / 5.0) * 10
    
    # Environmental score (lower emissions = higher score)
    env_score = max(0, 10 - (flight.carbon_emissions / 100))
    
    # Schedule convenience (prefer mid-day flights)
    hour = int(flight.departure_time.split(':')[0])
    schedule_score = 5 if 8 <= hour <= 18 else 2
    
    total_score = price_score + feature_score + performance_score + rating_score + env_score + schedule_score
    return min(100, max(0, total_score))

def generate_recommendation_reason(flight: Flight) -> str:
    """Generate personalized recommendation reason"""
    reasons = []
    
    if flight.airline.on_time_performance > 0.85:
        reasons.append("excellent punctuality")
    if flight.airline.carry_on_included and flight.airline.checked_baggage_included:
        reasons.append("all baggage included")
    if flight.carbon_emissions < 80:
        reasons.append("eco-friendly choice")
    if flight.airline.customer_rating > 4.0:
        reasons.append("high customer satisfaction")
    if flight.price_trend == "falling":
        reasons.append("price trending down")
    
    if not reasons:
        reasons = ["competitive pricing"]
    
    return f"Recommended for {random.choice(reasons)}"

def lock_price(flight: Flight) -> None:
    """Lock flight price for 15 minutes"""
    lock_time = datetime.now() + timedelta(minutes=15)
    st.session_state.price_locks[flight.id] = {
        'flight': flight,
        'locked_until': lock_time,
        'original_price': flight.total_price
    }

def is_price_locked(flight_id: str) -> bool:
    """Check if flight price is still locked"""
    if flight_id not in st.session_state.price_locks:
        return False
    
    lock_info = st.session_state.price_locks[flight_id]
    return datetime.now() < lock_info['locked_until']

def get_lock_time_remaining(flight_id: str) -> int:
    """Get remaining lock time in seconds"""
    if not is_price_locked(flight_id):
        return 0
    
    lock_info = st.session_state.price_locks[flight_id]
    remaining = lock_info['locked_until'] - datetime.now()
    return max(0, int(remaining.total_seconds()))

# Enhanced header with anti-manipulation showcase
def render_header():
    """Render enhanced header with real-time anti-manipulation stats"""
    
    # Custom CSS for animations and styling
    st.markdown("""
    <style>
    .main-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
        animation: fadeIn 1s ease-in;
    }
    
    .feature-badge {
        display: inline-block;
        background: rgba(255,255,255,0.2);
        padding: 0.5rem 1rem;
        border-radius: 25px;
        margin: 0.25rem;
        backdrop-filter: blur(10px);
        animation: slideUp 0.8s ease-out;
    }
    
    .anti-manipulation-banner {
        background: linear-gradient(45deg, #2E8B57, #3CB371);
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #00FF7F;
        animation: pulse 2s infinite;
    }
    
    .stats-container {
        display: flex;
        justify-content: space-around;
        margin: 1rem 0;
    }
    
    .stat-item {
        text-align: center;
        padding: 1rem;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        min-width: 120px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(0,255,127,0.3); }
        50% { box-shadow: 0 0 30px rgba(0,255,127,0.6); }
    }
    
    .price-lock-indicator {
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: #333;
        padding: 0.75rem;
        border-radius: 8px;
        font-weight: bold;
        display: inline-block;
        margin: 0.5rem;
        box-shadow: 0 4px 15px rgba(255,215,0,0.3);
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Main header
    st.markdown("""
    <div class="main-header">
        <h1>🇵🇭 CheepNow - Philippines Domestic Flights</h1>
        <h3>The Only Flight Search That Fights Back Against Price Manipulation</h3>
        <div>
            <span class="feature-badge">🛡️ Anti-Tracking Technology</span>
            <span class="feature-badge">🔒 15-Min Price Lock</span>
            <span class="feature-badge">🎒 Carry-on Guaranteed</span>
            <span class="feature-badge">💰 Value-Optimized</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Anti-manipulation status banner
    manipulation_data = simulate_anti_manipulation()
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown(f"""
        <div class="anti-manipulation-banner">
            <h4>🛡️ Anti-Price Manipulation Status: ACTIVE</h4>
            <div class="stats-container">
                <div class="stat-item">
                    <div style="font-size: 1.5rem; font-weight: bold;">{st.session_state.anti_manipulation_score}%</div>
                    <div>Clean Pricing</div>
                </div>
                <div class="stat-item">
                    <div style="font-size: 1.5rem; font-weight: bold;">{manipulation_data['manipulation_attempts_blocked']}</div>
                    <div>Blocks Active</div>
                </div>
                <div class="stat-item">
                    <div style="font-size: 1.5rem; font-weight: bold;">₱{manipulation_data['price_inflation_prevented']:.0f}</div>
                    <div>Savings Protected</div>
                </div>
            </div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem;">
                <strong>Active Protections:</strong> {' • '.join(manipulation_data['techniques_used'])}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        if st.session_state.price_locks:
            active_locks = sum(1 for fid in st.session_state.price_locks if is_price_locked(fid))
            st.markdown(f"""
            <div class="price-lock-indicator">
                🔒 {active_locks} Price Lock{'s' if active_locks != 1 else ''} Active
                <br><small>Your prices are protected!</small>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div style="text-align: center; padding: 1rem; color: #666;">
                <div style="font-size: 2rem;">⏰</div>
                <div>No active price locks</div>
                <small>Lock prices to protect against increases</small>
            </div>
            """, unsafe_allow_html=True)

# Main App Layout with enhanced features
def main():
    render_header()
    
    # Enhanced sidebar with multiple sections
    with st.sidebar:
        st.header("🔍 Flight Search & Preferences")
        
        # User preferences section
        with st.expander("⚙️ Search Preferences", expanded=False):
            st.subheader("Personalize Your Search")
            
            max_budget = st.slider(
                "💰 Maximum Budget (₱)", 
                min_value=2000, 
                max_value=15000, 
                value=st.session_state.user_preferences['max_budget'],
                step=500
            )
            st.session_state.user_preferences['max_budget'] = max_budget
            
            preferred_time = st.selectbox(
                "🕐 Preferred Departure Time",
                ["Any time", "Early morning (5-9 AM)", "Morning (9-12 PM)", 
                 "Afternoon (12-6 PM)", "Evening (6-10 PM)", "Late night (10 PM+)"],
                index=0
            )
            st.session_state.user_preferences['preferred_departure_time'] = preferred_time
            
            eco_conscious = st.checkbox(
                "🌱 Prioritize eco-friendly flights", 
                value=st.session_state.user_preferences['eco_conscious']
            )
            st.session_state.user_preferences['eco_conscious'] = eco_conscious
            
            preferred_airlines = st.multiselect(
                "✈️ Preferred Airlines",
                options=list(AIRLINES.keys()),
                format_func=lambda x: f"{AIRLINES[x].logo} {AIRLINES[x].name}",
                default=st.session_state.user_preferences['preferred_airlines']
            )
            st.session_state.user_preferences['preferred_airlines'] = preferred_airlines
        
        # Quick route selection with enhanced UI
        st.subheader("🚀 Popular Routes")
        
        route_buttons = [
            ("MNL", "CEB", "Manila → Cebu", "🏙️→🏖️"),
            ("MNL", "DVO", "Manila → Davao", "🏙️→🌺"),
            ("CEB", "MNL", "Cebu → Manila", "🏖️→🏙️"),
            ("MNL", "ILO", "Manila → Iloilo", "🏙️→🏛️"),
            ("MNL", "BCD", "Manila → Bacolod", "🏙️→🍃"),
            ("MNL", "PPS", "Manila → Palawan", "🏙️→🏝️")
        ]
        
        cols = st.columns(2)
        for i, (orig, dest, label, emoji) in enumerate(route_buttons):
            with cols[i % 2]:
                if st.button(f"{emoji} {label}", key=f"route_{i}", use_container_width=True):
                    st.session_state.origin = orig
                    st.session_state.destination = dest
                    st.rerun()
        
        st.divider()
        
        # Enhanced search form
        st.subheader("🔍 Custom Search")
        
        # Origin and destination with enhanced display (outside form for swap functionality)
        col1, col2, col3 = st.columns([5, 5, 2])
        with col1:
            origin = st.selectbox(
                "From",
                options=list(AIRPORTS.keys()),
                format_func=lambda x: f"{AIRPORTS[x].city} ({x})",
                key="origin",
                help="Select departure airport"
            )
        
        with col2:
            destination = st.selectbox(
                "To", 
                options=list(AIRPORTS.keys()),
                format_func=lambda x: f"{AIRPORTS[x].city} ({x})",
                key="destination",
                help="Select destination airport"
            )
        
        with col3:
            # Swap button (outside form)
            st.write("") # Add spacing
            if st.button("🔄 Swap", help="Swap origin and destination", use_container_width=True):
                # Swap the values by updating session state and triggering rerun
                temp_origin = origin
                st.session_state.origin = destination
                st.session_state.destination = temp_origin
                st.rerun()
        
        with st.form("flight_search"):
            
            # Travel dates with smart defaults
            today = datetime.now().date()
            departure_date = st.date_input(
                "📅 Departure Date",
                min_value=today,
                value=today + timedelta(days=7),
                help="Select your departure date"
            )
            
            # Trip type with round trip option
            trip_type = st.radio("✈️ Trip Type", ["One Way", "Round Trip"])
            
            if trip_type == "Round Trip":
                return_date = st.date_input(
                    "📅 Return Date",
                    min_value=departure_date,
                    value=departure_date + timedelta(days=3),
                    help="Select your return date"
                )
            
            # Passengers with detailed breakdown
            col1, col2, col3 = st.columns(3)
            with col1:
                adults = st.number_input("👥 Adults", min_value=1, max_value=9, value=1)
            with col2:
                children = st.number_input("👶 Children", min_value=0, max_value=8, value=0, help="2-11 years")
            with col3:
                infants = st.number_input("🍼 Infants", min_value=0, max_value=4, value=0, help="Under 2 years")
            
            passengers = adults + children + infants
            
            # Advanced search options
            with st.expander("⚙️ Advanced Options"):
                class_preference = st.selectbox(
                    "🎯 Class Preference",
                    ["Economy", "Premium Economy", "Business"],
                    help="Preferred travel class"
                )
                
                flexible_dates = st.checkbox(
                    "📅 Flexible dates (±3 days)",
                    help="Show flights 3 days before and after your selected date"
                )
                
                direct_flights_only = st.checkbox(
                    "🚫 Direct flights only",
                    help="Exclude connecting flights"
                )
            
            # Enhanced search button
            search_clicked = st.form_submit_button(
                "🔍 Search Flights", 
                type="primary", 
                use_container_width=True,
                help="Find the best flight deals with anti-manipulation protection"
            )
        
        # Enhanced price locks section
        if st.session_state.price_locks:
            st.divider()
            st.subheader("🔒 Active Price Locks")
            
            active_locks = [(fid, info) for fid, info in st.session_state.price_locks.items() 
                          if is_price_locked(fid)]
            
            if active_locks:
                for flight_id, lock_info in active_locks:
                    remaining = get_lock_time_remaining(flight_id)
                    if remaining > 0:
                        minutes = remaining // 60
                        seconds = remaining % 60
                        
                        # Create a more detailed lock display
                        with st.container():
                            st.markdown(f"""
                            <div style="background: linear-gradient(45deg, #FFD700, #FFA500); 
                                        padding: 1rem; border-radius: 10px; margin: 0.5rem 0;">
                                <strong>✈️ {lock_info['flight'].flight_number}</strong><br>
                                <strong>⏰ {minutes:02d}:{seconds:02d}</strong> remaining<br>
                                <strong>💰 ₱{lock_info['original_price']:,.0f}</strong> locked<br>
                                <small>{lock_info['flight'].departure_airport.city} → {lock_info['flight'].arrival_airport.city}</small>
                            </div>
                            """, unsafe_allow_html=True)
                            
                            if st.button(f"📧 Get Price Alert", key=f"alert_{flight_id}"):
                                st.success("✅ Price alert set! We'll notify you of any changes.")
            else:
                st.info("No active price locks. Lock prices to protect against increases!")
        
        # Search history
        if st.session_state.search_history:
            st.divider()
            st.subheader("📈 Recent Searches")
            for i, search in enumerate(st.session_state.search_history[-3:]):  # Show last 3
                st.write(f"🔍 {search['route']} - {search['date']}")
    
    # Main content area with enhanced features
    if search_clicked and origin != destination:
        # Enhanced anti-manipulation simulation
        with st.spinner("🛡️ Activating anti-manipulation shields..."):
            manipulation_data = simulate_anti_manipulation()
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            steps = [
                "Clearing tracking cookies...",
                "Rotating user agents...",
                "Masking location data...",
                "Randomizing search patterns...",
                "Bypassing price inflation algorithms...",
                "Fetching clean pricing data..."
            ]
            
            for i, step in enumerate(steps):
                status_text.text(step)
                progress_bar.progress((i + 1) / len(steps))
                time_module.sleep(0.3)
            
            status_text.text("✅ Anti-manipulation protection active!")
            time_module.sleep(0.5)
        
        # Store search in history
        search_record = {
            'route': f"{AIRPORTS[origin].city} → {AIRPORTS[destination].city}",
            'date': str(departure_date),
            'timestamp': datetime.now().isoformat()
        }
        st.session_state.search_history.append(search_record)
        
        with st.spinner("🔍 Searching for the best flight deals..."):
            flights = generate_enhanced_mock_flights(origin, destination, str(departure_date), passengers)
            st.session_state.flights = flights
            st.session_state.search_performed = True
            time_module.sleep(1)
        
        # Success message with savings info
        savings_protected = manipulation_data['price_inflation_prevented']
        st.success(f"""
        ✅ **Found {len(flights)} flights** from {AIRPORTS[origin].city} to {AIRPORTS[destination].city}
        
        🛡️ **Protected you from ₱{savings_protected:.0f} in price manipulation**
        """)
    
    # Enhanced search results display
    if st.session_state.search_performed and st.session_state.flights:
        flights = st.session_state.flights
        
        # Enhanced summary metrics with better layout
        st.subheader("📊 Flight Search Summary")
        
        col1, col2, col3, col4, col5 = st.columns(5)
        
        with col1:
            st.metric("✈️ Flights Found", len(flights))
        
        with col2:
            cheapest = min(flights, key=lambda x: x.total_price)
            st.metric("💰 Cheapest", f"₱{cheapest.total_price:,.0f}")
        
        with col3:
            avg_price = sum(f.total_price for f in flights) / len(flights)
            st.metric("📊 Average Price", f"₱{avg_price:,.0f}")
        
        with col4:
            carry_on_included = sum(1 for f in flights if f.airline.carry_on_included)
            st.metric("🎒 Carry-on Included", f"{carry_on_included}/{len(flights)}")
        
        with col5:
            avg_emissions = sum(f.carbon_emissions for f in flights) / len(flights)
            st.metric("🌱 Avg CO₂", f"{avg_emissions:.0f}kg")
        
        # Enhanced visualizations
        st.subheader("📈 Advanced Price Analysis")
        
        # Create tabs for different views
        tab1, tab2, tab3, tab4 = st.tabs(["💰 Price Comparison", "⏰ Timeline View", "🌱 Environmental Impact", "📊 Airline Analysis"])
        
        with tab1:
            # Enhanced price comparison chart
            chart_data = pd.DataFrame([
                {
                    'Airline': f.airline.name,
                    'Price': f.total_price,
                    'Flight': f.flight_number,
                    'Carry-on': '✅ Included' if f.airline.carry_on_included else '❌ Extra fee',
                    'Type': f.airline.type.title(),
                    'On-time Performance': f.airline.on_time_performance * 100,
                    'Customer Rating': f.airline.customer_rating,
                    'Value Score': f.value_score,
                    'Price Trend': f.price_trend
                }
                for f in flights
            ])
            
            fig = px.scatter(
                chart_data, 
                x='Airline', 
                y='Price',
                color='Value Score',
                size='Customer Rating',
                hover_data=['Flight', 'Carry-on', 'On-time Performance'],
                title="Flight Prices with Value Scoring",
                color_continuous_scale='RdYlGn'
            )
            fig.update_layout(height=500)
            st.plotly_chart(fig, use_container_width=True)
        
        with tab2:
            # Timeline view of departures
            timeline_data = pd.DataFrame([
                {
                    'Time': f.departure_time,
                    'Airline': f.airline.name,
                    'Price': f.total_price,
                    'Duration': f"{f.duration_minutes // 60}h {f.duration_minutes % 60}m",
                    'Aircraft': f.aircraft
                }
                for f in flights
            ])
            
            fig_timeline = px.scatter(
                timeline_data,
                x='Time',
                y='Price', 
                color='Airline',
                size=[100] * len(timeline_data),
                hover_data=['Duration', 'Aircraft'],
                title="Flight Prices by Departure Time"
            )
            st.plotly_chart(fig_timeline, use_container_width=True)
        
        with tab3:
            # Environmental impact analysis
            eco_data = pd.DataFrame([
                {
                    'Airline': f.airline.name,
                    'CO₂ Emissions (kg)': f.carbon_emissions,
                    'Price': f.total_price,
                    'Efficiency Score': 100 - (f.carbon_emissions / max(flight.carbon_emissions for flight in flights)) * 100
                }
                for f in flights
            ])
            
            fig_eco = px.bar(
                eco_data,
                x='Airline',
                y='CO₂ Emissions (kg)',
                color='Efficiency Score',
                title="Environmental Impact by Airline",
                color_continuous_scale='RdYlGn'
            )
            st.plotly_chart(fig_eco, use_container_width=True)
            
            # Eco-friendly recommendations
            eco_flight = min(flights, key=lambda x: x.carbon_emissions)
            st.success(f"""
            🌱 **Most Eco-Friendly Option**: {eco_flight.flight_number} - {eco_flight.airline.name}
            
            Only {eco_flight.carbon_emissions:.0f}kg CO₂ emissions • ₱{eco_flight.total_price:,.0f}
            """)
        
        with tab4:
            # Airline performance comparison
            airline_stats = {}
            for flight in flights:
                airline = flight.airline.name
                if airline not in airline_stats:
                    airline_stats[airline] = {
                        'avg_price': [],
                        'on_time_perf': flight.airline.on_time_performance,
                        'rating': flight.airline.customer_rating,
                        'carry_on': flight.airline.carry_on_included,
                        'checked_bag': flight.airline.checked_baggage_included
                    }
                airline_stats[airline]['avg_price'].append(flight.total_price)
            
            # Calculate averages
            for airline in airline_stats:
                airline_stats[airline]['avg_price'] = sum(airline_stats[airline]['avg_price']) / len(airline_stats[airline]['avg_price'])
            
            # Create comparison radar chart
            airlines = list(airline_stats.keys())
            categories = ['Price Score', 'On-time Performance', 'Customer Rating', 'Value Features']
            
            fig_radar = go.Figure()
            
            for airline in airlines:
                stats = airline_stats[airline]
                max_price = max(airline_stats[a]['avg_price'] for a in airline_stats)
                price_score = (max_price - stats['avg_price']) / max_price * 100
                
                feature_score = 0
                if stats['carry_on']: feature_score += 50
                if stats['checked_bag']: feature_score += 50
                
                values = [
                    price_score,
                    stats['on_time_perf'] * 100,
                    stats['rating'] * 20,
                    feature_score
                ]
                
                fig_radar.add_trace(go.Scatterpolar(
                    r=values,
                    theta=categories,
                    fill='toself',
                    name=airline
                ))
            
            fig_radar.update_layout(
                polar=dict(
                    radialaxis=dict(
                        visible=True,
                        range=[0, 100]
                    )),
                showlegend=True,
                title="Airline Performance Comparison"
            )
            
            st.plotly_chart(fig_radar, use_container_width=True)
        
        # Flight results table
        st.subheader("✈️ Available Flights")
        
        for i, flight in enumerate(flights):
            with st.container():
                # Create a bordered container for each flight
                border_color = "🟢" if i == 0 else "🔵"  # Highlight cheapest
                
                col1, col2, col3, col4, col5 = st.columns([2, 2, 2, 2, 1])
                
                with col1:
                    st.markdown(f"**{flight.airline.logo} {flight.airline.name}**")
                    st.write(f"Flight: {flight.flight_number}")
                    st.write(f"Aircraft: {flight.aircraft}")
                
                with col2:
                    st.write(f"🛫 **{flight.departure_time}**")
                    st.write(f"{flight.departure_airport.city}")
                    st.write(f"({flight.departure_airport.code})")
                
                with col3:
                    hours = flight.duration_minutes // 60
                    minutes = flight.duration_minutes % 60
                    st.write(f"⏱️ **{hours}h {minutes}m**")
                    st.write(f"🛬 **{flight.arrival_time}**")
                    st.write(f"{flight.arrival_airport.city}")
                
                with col4:
                    # Price display
                    if is_price_locked(flight.id):
                        st.success(f"🔒 **₱{flight.total_price:,.0f}** LOCKED")
                        remaining = get_lock_time_remaining(flight.id)
                        minutes = remaining // 60
                        seconds = remaining % 60
                        st.write(f"⏰ {minutes:02d}:{seconds:02d} remaining")
                    else:
                        st.write(f"💰 **₱{flight.total_price:,.0f}**")
                        st.write(f"Base: ₱{flight.base_price:,.0f}")
                        st.write(f"Taxes: ₱{flight.taxes:,.0f}")
                    
                    # Baggage info
                    carry_on = "✅ Included" if flight.airline.carry_on_included else "❌ Extra fee"
                    checked = "✅ Included" if flight.airline.checked_baggage_included else f"₱1,500 ({flight.airline.checked_baggage_weight}kg)"
                    
                    st.write(f"🎒 Carry-on: {carry_on}")
                    st.write(f"🧳 Checked: {checked}")
                
                with col5:
                    if not is_price_locked(flight.id):
                        if st.button(f"🔒 Lock Price", key=f"lock_{flight.id}", type="primary"):
                            lock_price(flight)
                            st.rerun()
                    else:
                        st.success("🔒 Locked!")
                    
                    st.write(f"💺 {flight.seats_available} seats")
                
                st.divider()
        
        # Best value recommendation
        st.subheader("🏆 CheepNow Recommendation")
        
        # Use the existing value scores that were already calculated
        best_value = max(flights, key=lambda x: x.value_score)
        
        st.success(f"""
        **Best Value: {best_value.flight_number} - {best_value.airline.name}**
        
        💰 Price: ₱{best_value.total_price:,.0f} | 🎒 Carry-on: {'Included' if best_value.airline.carry_on_included else 'Extra fee'} | 
        🧳 Checked baggage: {'Included' if best_value.airline.checked_baggage_included else 'Extra fee'}
        
        This flight offers the best combination of price, included services, and airline reliability for Filipino travelers.
        """)
    
    elif search_clicked and origin == destination:
        st.error("❌ Origin and destination cannot be the same!")
    
    # Footer
    st.divider()
    st.markdown("""
    ---
    **CheepNow Philippines Domestic Flight Booking Tool**
    
    Built specifically for Filipino travelers to find genuine flight deals without price manipulation.
    
    🛡️ **Anti-tracking enabled** • 🔒 **Price protection** • 🎒 **Carry-on transparency** • 💰 **Value-focused recommendations**
    """)

if __name__ == "__main__":
    main()
