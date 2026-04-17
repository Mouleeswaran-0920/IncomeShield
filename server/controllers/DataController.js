const weatherService = require('../services/WeatherService');

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon, city } = req.query;
        let coords = { lat, lon };
        
        if (city) {
            coords = await weatherService.getCityCoords(city);
        }

        if (!coords.lat || !coords.lon) {
            return res.status(400).json({ error: 'Lat/Lon or City required' });
        }

        const data = await weatherService.getWeatherData(coords.lat, coords.lon, coords.name || city);
        res.json(data);
    } catch (error) {
        res.status(200).json({ 
            temp: 25, 
            rain: 0, 
            humidity: 50, 
            condition: 'Clear', 
            source: 'EMERGENCY_FALLBACK' 
        });
    }
};

exports.getAQI = async (req, res) => {
    try {
        const { lat, lon, city } = req.query;
        let coords = { lat, lon };
        
        if (city) {
            coords = await weatherService.getCityCoords(city);
        }

        if (!coords.lat || !coords.lon) {
            return res.status(400).json({ error: 'Lat/Lon or City required' });
        }

        const data = await weatherService.getAQIData(coords.lat, coords.lon, coords.name || city);
        res.json(data);
    } catch (error) {
        res.status(200).json({ 
            index: 2, 
            pm2_5: 15, 
            pm10: 25, 
            co: 300, 
            source: 'EMERGENCY_FALLBACK' 
        });
    }
};
