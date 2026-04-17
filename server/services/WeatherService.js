const axios = require('axios');
require('dotenv').config();

class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.aqiToken = process.env.AQI_TOKEN;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async getWeatherData(lat, lon, cityName = 'Delhi') {
        try {
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: this.apiKey,
                    units: 'metric'
                },
                timeout: 3000 // Tight timeout for hybrid resilience
            });

            const rain = response.data.rain ? response.data.rain['1h'] || response.data.rain['3h'] || 0 : 0;
            
            return {
                temp: response.data.main.temp,
                rain: rain,
                humidity: response.data.main.humidity,
                condition: response.data.weather[0].main,
                source: 'LIVE_API'
            };
        } catch (error) {
            console.error(`Weather API Error (${cityName}):`, error.message);
            // Hybrid Resilience: Realistic simulation for demo
            const isHot = cityName === 'Delhi' || cityName === 'Mumbai';
            return {
                temp: isHot ? 32 + (Math.random() * 5) : 18 + (Math.random() * 5),
                rain: Math.random() < 0.3 ? (Math.random() * 10).toFixed(1) : 0,
                humidity: 60 + (Math.random() * 20),
                condition: Math.random() > 0.8 ? 'Rainy' : 'Cloudy',
                source: 'HYBRID_SIMULATION'
            };
        }
    }

    async getAQIData(lat, lon, cityName = 'Delhi') {
        try {
            const response = await axios.get(`${this.baseUrl}/air_pollution`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: this.apiKey // Using main API key for OWM pollution
                },
                timeout: 3000
            });

            const data = response.data.list[0];
            return {
                index: data.main.aqi,
                pm2_5: data.components.pm2_5,
                pm10: data.components.pm10,
                co: data.components.co,
                source: 'LIVE_API'
            };
        } catch (error) {
            console.error(`AQI API Error (${cityName}):`, error.message);
            // Realistic simulation
            const baseAqi = cityName === 'Delhi' ? 4 : 2;
            return {
                index: Math.min(5, Math.max(1, baseAqi + (Math.random() > 0.7 ? 1 : 0))),
                pm2_5: baseAqi * 25 + (Math.random() * 15),
                pm10: baseAqi * 40 + (Math.random() * 20),
                co: 400 + (Math.random() * 100),
                source: 'HYBRID_SIMULATION'
            };
        }
    }

    // Helper to get coordinates for a city
    async getCityCoords(city) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
                params: {
                    q: city,
                    limit: 1,
                    appid: this.apiKey
                },
                timeout: 3000
            });

            if (response.data && response.data.length > 0) {
                return {
                    lat: response.data[0].lat,
                    lon: response.data[0].lon,
                    name: response.data[0].name
                };
            }
            throw new Error('City not found');
        } catch (error) {
            console.error(`Geocoding API Error (${city}):`, error.message);
            // Default static coordinates map for resilience
            const fallbackCoords = {
                'Delhi': { lat: 28.6139, lon: 77.2090 },
                'Mumbai': { lat: 19.0760, lon: 72.8777 },
                'Bangalore': { lat: 12.9716, lon: 77.5946 },
                'Chennai': { lat: 13.0827, lon: 80.2707 },
                'Hyderabad': { lat: 17.3850, lon: 78.4867 },
                'Kolkata': { lat: 22.5726, lon: 88.3639 }
            };
            return { ...(fallbackCoords[city] || fallbackCoords['Delhi']), name: city, source: 'HYBRID_SIMULATION' };
        }
    }
}

module.exports = new WeatherService();
