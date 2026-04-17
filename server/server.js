require('express-async-errors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');
const simulationService = require('./services/SimulationService');
const disasterService = require('./services/DisasterService');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Security Check: Required Environment Variables
const REQUIRED_ENV = ['JWT_SECRET', 'RAZORPAY_KEY_ID', 'OPENWEATHER_API_KEY', 'AQI_TOKEN'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0 && process.env.DEMO_MODE !== 'true') {
    logger.error(`CRITICAL ERROR: Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.get("/api/test", (req, res) => res.json({ status: "ok", service: "IncomeShield Backend" }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/claims'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/disaster', require('./routes/disaster'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

app.get('/api/simulated-environment', async (req, res) => {
    const data = await simulationService.getEnvironmentData();
    res.json(data);
});

// Error handling
app.use(errorHandler);

// Real-time loop
setInterval(async () => {
    try {
        const envData = await simulationService.getEnvironmentData();
        io.emit('environment_update', envData);
        
        // Advanced real-time updates
        const riskScore = (envData.rain / 100 * 0.4) + (envData.aqi / 300 * 0.3) + (envData.traffic / 100 * 0.3);
        io.emit('risk:update', { 
            score: parseFloat(riskScore.toFixed(2)),
            timestamp: new Date()
        });

        if (riskScore > 0.6) {
            io.emit('disruption:alert', {
                type: 'ENVIRONMENT_RISK',
                message: 'High disruption risk detected in your area.',
                severity: 'HIGH'
            });
        }
        
        if (disasterService.isDisasterMode) {
            io.emit('disruption:alert', {
                type: 'DISASTER_MODE',
                message: `Disaster mode active for ${disasterService.activeRegion}`,
                severity: 'CRITICAL'
            });
        }
    } catch (err) {
        logger.error('SIMULATION_LOOP_ERROR: ' + err.message);
    }
}, 10000);

// Helper for other services to emit
app.set('socketio', io);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}).catch(err => {
    logger.error('Database connection failed: ' + err);
});
