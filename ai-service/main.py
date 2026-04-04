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

@app.post("/predict-risk")
async def predict_risk(env: EnvironmentData):
    score = models.predict_risk(env)
    return {"risk_score": score}

@app.post("/predict-income")
async def predict_income(data: IncomeData):
    income = models.predict_income(data)
    return {"expected_income": income}

@app.post("/detect-fraud")
async def detect_fraud(data: FraudData):
    is_fraud = models.detect_fraud(data)
    return {"is_fraud": is_fraud, "trust_score": 0.2 if is_fraud else 0.9}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
