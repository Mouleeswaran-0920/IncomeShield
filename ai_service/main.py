from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
import uvicorn

import sys
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Security Check
REQUIRED_ENV = ["PORT"]
for key in REQUIRED_ENV:
    if not os.getenv(key) and os.getenv("DEMO_MODE") != "true":
        print(f"\033[91mCRITICAL ERROR: Missing environment variable: {key}\033[0m")
        # sys.exit(1) # Optional for Python if defaults are safe

# Input schemas
class EnvironmentData(BaseModel):
    rain: float
    aqi: float
    traffic: float
    strike: float = 0 # 0-100 percentage

class IncomeData(BaseModel):
    user_history: list
    rain: float
    aqi: float
    traffic: float
    temp: float = 30
    strike: float = 0

class FraudData(BaseModel):
    deliveries: float
    avg_deliveries: float

# Prediction models
class AIModels:
    def __init__(self):
        # Mock training data for demonstration
        self.income_model = LinearRegression()
        X_mock = np.array([[0, 50, 40], [50, 150, 60], [100, 300, 90]]) # rain, aqi, traffic
        y_mock = np.array([1000, 700, 300]) # income
        self.income_model.fit(X_mock, y_mock)
        
        self.fraud_model = IsolationForest(contamination=0.1)
        # Mock delivery patterns
        d_mock = np.array([[30], [25], [35], [28], [32], [5]]) # deliveries
        self.fraud_model.fit(d_mock)

    def predict_risk(self, env: EnvironmentData):
        # Risk score calculation (0-1)
        rain_risk = env.rain / 100
        aqi_risk = env.aqi / 300
        traffic_risk = env.traffic / 100
        strike_risk = env.strike / 100
        
        # Weighted risk including strike
        risk_score = (rain_risk * 0.2) + (aqi_risk * 0.2) + (traffic_risk * 0.2) + (strike_risk * 0.4)
        return min(1.0, risk_score)

    def predict_income(self, data: IncomeData):
        # Base income heavily penalized by Strike and Heat
        strike_factor = (100 - data.strike) / 100
        heat_factor = 0.7 if data.temp > 40 else 1.0
        
        X = np.array([[data.rain, data.aqi, data.traffic]])
        prediction = self.income_model.predict(X)[0]
        
        # Final calculation
        expected = (prediction * strike_factor * heat_factor)
        avg_history = np.mean(data.user_history) if data.user_history else 800
        
        return max(0, (expected + avg_history) / 2)

    def detect_fraud(self, data: FraudData):
        # Flag if deliveries are significantly lower than average
        prediction = self.fraud_model.predict([[data.deliveries]])[0]
        is_fraud = prediction == -1 or (data.deliveries < (data.avg_deliveries * 0.3))
        return is_fraud

models = AIModels()

@app.post("/risk-score")
async def get_risk_score(env: EnvironmentData):
    score = models.predict_risk(env)
    
    # Factor breakdown for Explainable AI
    factors = {
        "rain": round(env.rain / 100 * 0.2, 2),
        "aqi": round(env.aqi / 300 * 0.2, 2),
        "traffic": round(env.traffic / 100 * 0.2, 2),
        "strike": round(env.strike / 100 * 0.4, 2)
    }
    
    # Human-readable explanation
    sorted_factors = sorted(factors.items(), key=lambda x: x[1], reverse=True)
    top_factor = sorted_factors[0][0]
    explanation = f"High {top_factor} is the main contributor to your risk score."
    if score > 0.7:
        explanation = f"Critical risk detected! {top_factor.capitalize()} is extremely high."
    elif score < 0.3:
        explanation = "Environmental conditions are stable and safe."

    return {
        "riskScore": score,
        "factors": factors,
        "explanation": explanation
    }

@app.post("/predict-income")
async def predict_income(data: IncomeData):
    income = models.predict_income(data)
    # Return more details for analytics
    return {
        "expectedIncome": income,
        "confidence": 0.85,
        "factors": {
            "historical_avg": round(np.mean(data.user_history) if data.user_history else 800, 2),
            "environmental_penalty": round(1.0 - (income / (np.mean(data.user_history) if data.user_history else 800)), 2)
        }
    }

@app.post("/fraud-score")
async def get_fraud_score(data: FraudData):
    # More sophisticated fraud scoring
    drop_percentage = (data.avg_deliveries - data.deliveries) / data.avg_deliveries if data.avg_deliveries > 0 else 0
    
    # 0 to 1 score
    fraud_score = 0.0
    if drop_percentage > 0.7:
        fraud_score = 0.85
    elif drop_percentage > 0.5:
        fraud_score = 0.6
    else:
        fraud_score = 0.15
        
    risk_level = "LOW"
    if fraud_score > 0.7:
        risk_level = "HIGH"
    elif fraud_score > 0.4:
        risk_level = "MEDIUM"
        
    return {
        "fraudScore": fraud_score,
        "riskLevel": risk_level,
        "details": {
            "delivery_drop": round(drop_percentage * 100, 2),
            "pattern_anomaly": "detected" if fraud_score > 0.5 else "none"
        }
    }

@app.post("/detect-fraud")
async def detect_fraud_legacy(data: FraudData):
    # Keeping for backward compatibility
    is_fraud = models.detect_fraud(data)
    return {"is_fraud": is_fraud, "trust_score": 0.2 if is_fraud else 0.9}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
