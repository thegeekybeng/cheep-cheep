# CheepNow - Philippines Domestic Flight Booking Tool (Streamlit Demo)

A live public demo of the anti-price manipulation flight booking system specifically designed for Filipino travelers.

## 🚀 Live Demo

**Streamlit Cloud URL:** [Coming Soon - Deploy Instructions Below]

## 🌟 Features

- **🛡️ Anti-Price Manipulation**: Bypasses airline tracking and user profiling
- **🔒 15-Minute Price Lock**: Hold prices while you decide
- **🎒 Carry-on Guarantee**: All options clearly show baggage policies
- **💰 Value-Focused**: Optimized for Philippines' economic context
- **✈️ Domestic Routes**: Philippine Airlines, Cebu Pacific, Philippines AirAsia, Skyjet

## 🛠️ Local Development

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/thegeekybeng/cheep-cheep.git
cd cheep-cheep/streamlit_demo
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Run the application**

```bash
streamlit run app.py
```

4. **Open in browser**

```
Local URL: http://localhost:8501
Network URL: http://[your-ip]:8501
```

## 🌐 Deploy to Streamlit Cloud

### Option 1: Direct Deployment (Recommended)

1. **Fork this repository** to your GitHub account

2. **Go to [Streamlit Cloud](https://streamlit.io/cloud)**

3. **Click "New app"**

4. **Fill in deployment settings:**

   - Repository: `your-username/cheep-cheep`
   - Branch: `main`
   - Main file path: `streamlit_demo/app.py`
   - App URL: `cheepnow-ph-flights` (or your preferred name)

5. **Click "Deploy"** - Your app will be live in 2-3 minutes!

### Option 2: Command Line Deployment

```bash
# Install Streamlit CLI
pip install streamlit

# Login to Streamlit Cloud
streamlit login

# Deploy from repository
streamlit deploy streamlit_demo/app.py
```

## 📋 Deployment Checklist

- ✅ `requirements.txt` is properly configured
- ✅ `app.py` contains the main Streamlit application
- ✅ All imports are available in requirements
- ✅ No local file dependencies
- ✅ Environment variables handled (if any)

## 🎯 Demo Usage

1. **Select Route**: Choose from popular Philippine domestic routes or use custom search
2. **Set Travel Dates**: Pick departure (and return for round-trip)
3. **Search Flights**: Click "Search Flights" to find available options
4. **Compare Results**: View price comparisons, airline features, and baggage policies
5. **Lock Prices**: Use the 15-minute price lock feature to hold your selection
6. **Get Recommendations**: See CheepNow's best value suggestions

## 🏗️ Architecture

```
streamlit_demo/
├── app.py              # Main Streamlit application
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## 🔧 Features Included

### Core Functionality

- ✅ Philippine domestic airport selection
- ✅ Real-time flight search simulation
- ✅ Price comparison charts
- ✅ Airline feature comparison
- ✅ Interactive price locking
- ✅ Best value recommendations

### Anti-Manipulation Features

- ✅ Simulated clean pricing (no tracking cookies)
- ✅ Transparent baggage policy display
- ✅ Economic value optimization
- ✅ Filipino traveler-specific recommendations

### User Experience

- ✅ Mobile-responsive design
- ✅ Real-time price lock countdown
- ✅ Interactive charts and visualizations
- ✅ Quick route selection
- ✅ Clear airline comparison

## 📊 Mock Data

The demo uses realistic mock flight data including:

- **Airlines**: Philippine Airlines, Cebu Pacific, Philippines AirAsia, Skyjet
- **Routes**: 8+ popular domestic routes
- **Pricing**: Based on real market rates (in PHP)
- **Features**: Accurate baggage policies and airline types

## 🔗 Related Links

- **Original Next.js App**: [Main Repository](../)
- **Streamlit Documentation**: [streamlit.io/docs](https://streamlit.io/docs)
- **Philippine Airlines**: Official websites for real booking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the Streamlit app locally
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/thegeekybeng/cheep-cheep/issues)
- **Documentation**: [Streamlit Docs](https://streamlit.io/docs)
- **Community**: [Streamlit Community Forum](https://discuss.streamlit.io/)

---

**Built for Filipino travelers, by Filipino developers** 🇵🇭✈️
