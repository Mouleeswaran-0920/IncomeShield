const axios = require('axios');
require('dotenv').config();

const DEMO_MODE = process.env.DEMO_MODE === 'true';

class SimulationService {
    async getEnvironmentData(city = 'Delhi') {
        if (DEMO_MODE) {
            return {
                rain: 5,
                aqi: 280,
                traffic: 85,
                temp: 43,
                riskScore: 0.88,
                alert: "HEAT_WAVE",
                source: "INCOMESHIELD_SIMULATOR"
            };
        }

        try {
            // Simulate real API calls with fallback
            const weather = await this.safeFetch(
                () => axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`, { timeout: 2000 }),
                { data: { rain: { "1h": 0 } } }
            );

            const aqi = await this.safeFetch(
                () => axios.get(`https://api.waqi.info/feed/${city}/?token=${process.env.AQI_TOKEN}`, { timeout: 2000 }),
                { data: { data: { aqi: 50 } } }
            );

            const hour = new Date().getHours();
            const traffic = this.simulateTraffic(hour);
            const rain = weather.data.rain ? weather.data.rain["1h"] || 0 : 0;
            const aqiValue = aqi.data.data.aqi;

            const aiRisk = await this.safeFetch(
                () => axios.post(`${process.env.AI_SERVICE_URL}/predict-risk`, { rain: rain * 10, aqi: aqiValue, traffic: traffic }, { timeout: 2000 }),
                { data: { risk_score: 0.5 } }
            );

            return {
                rain: rain * 10, // Scale for comparison logic
                aqi: aqiValue,
                traffic: traffic,
                riskScore: aiRisk.data.risk_score,
                alert: this.simulateAlert(rain * 10, aqiValue),
                source: "LIVE_DATA"
            };
        } catch (error) {
            console.log("Using Fallback Data due to API error");
            return {
                rain: 60,
                aqi: 180,
                traffic: 70,
                riskScore: 0.65,
                alert: "NONE",
                source: "FALLBACK_MODE"
            };
        }
    }

    async safeFetch(fetchFn, fallback) {
        try {
            // No longer using axios.post(url) wrapper here to keep it simple
            const res = await fetchFn();
            return res.data || res;
        } catch (error) {
            console.error('FETCH_FAIL:', error.message);
            return fallback;
        }
    }

    simulateTraffic(hour) {
        if (hour >= 8 && hour <= 11) return 85;   // morning rush
        if (hour >= 17 && hour <= 21) return 90;  // evening rush
        return 40; // normal
    }

    simulateStrike() {
        // 10% chance of a localized strike in demo mode
        return Math.random() > 0.9 ? Math.floor(Math.random() * 100) : 0;
    }

    simulateAlert(rain, aqi, strike = 0, temp = 40) {
        if (strike > 50) return "GIG_STRIKE";
        if (temp > 42 || aqi > 300) return "HEAT_WAVE";
        if (rain > 70) return "FLOOD";
        if (aqi > 250) return "AIR_EMERGENCY";
        if (rain > 40) return "RAIN";
        return "NONE";
    }

    async getDemoData() {
        const strikeProb = this.simulateStrike();
        return {
            rain: 5, // Summer: low rain
            aqi: 320, // Summer: high AQI/Dust
            traffic: 90,
            temp: 42,
            strike: strikeProb,
            riskScore: strikeProb > 0 ? 0.95 : 0.75,
            alert: this.simulateAlert(5, 320, strikeProb),
            source: "DEMO_MODE (SUMMER)"
        };
    }
}

module.exports = new SimulationService();
