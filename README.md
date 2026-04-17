Pitch Deck Link = https://docs.google.com/presentation/d/18AIJ2NEdmcL_ZuxnpzQpVZyDqJ-Yo2t-/edit?usp=sharing&ouid=107625543254439871507&rtpof=true&sd=true
# IncomeShield AI

IncomeShield AI is a production-ready, AI-powered parametric income protection platform for gig workers in India. It automatically detects disruptions (weather, AQI, traffic), predicts income loss, and triggers automatic payouts.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Recharts, Mapbox GL JS.
- **Backend**: Node.js, Express, WebSocket (Socket.io), PostgreSQL (Sequelize), Redis.
- **AI Service**: Python FastAPI, scikit-learn, pandas, numpy.

## Features

1. **Real-time Disruption Detection**: Monitors Weather, AQI, and Traffic in 10-second intervals.
2. **AI Predictions**: Uses Regression for income forecasting and Isolation Forest for fraud detection.
3. **Automatic Payouts**: Logic-based payout triggers with disaster mode scaling.
4. **Simulation Engine**: Global `DEMO_MODE` for predictable testing and high-risk simulation.
5. **Interactive Dashboard**: Modern fintech UI with charts and heatmaps.

## Setup Instructions

### 1. Backend (Node.js)
```bash
cd backend
npm install
# Ensure PostgreSQL is running and update .env
npm start
```

### 2. AI Service (Python)
```bash
cd ai-service
# Recommended: Create a virtual environment
pip install -r requirements.txt
python main.py
```

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## Simulation Mode
Set `DEMO_MODE=true` in `backend/.env` to see the high-risk payout scenario immediately on the dashboard.

## API Documentation

- `POST /api/auth/signup`: User registration
- `GET /api/simulated-environment`: Fetch current environmental conditions
- `POST /api/claim`: Create a new claim
- `POST /api/payout`: Trigger a payout (Razorpay sim)
- `POST /predict-risk`: (AI Service) Calculate risk score
- `POST /predict-income`: (AI Service) Forecast earnings
