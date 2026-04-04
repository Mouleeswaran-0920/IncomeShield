const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/database');
const simulationService = require('./services/SimulationService');
require('dotenv').config();

// Security Check: Required Environment Variables
const REQUIRED_ENV = ['JWT_SECRET', 'RAZORPAY_KEY_ID', 'OPENWEATHER_API_KEY', 'AQI_TOKEN'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0 && process.env.DEMO_MODE !== 'true') {
    console.error(`\x1b[31mCRITICAL ERROR: Missing environment variables: ${missing.join(', ')}\x1b[0m`);
    console.error(`Please refer to .env.example and update your .env file.`);
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

app.get("/api/test", (req, res) => res.json({ status: "ok", service: "IncomeShield Backend" }));

// Routes
const authRoutes = require('./routes/auth');
const claimRoutes = require('./routes/claims');
const paymentRoutes = require('./routes/payments');

app.use('/api/auth', authRoutes);
app.use('/api', claimRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/simulated-environment', async (req, res) => {
    const data = await simulationService.getEnvironmentData();
    res.json(data);
});

// Real-time loop
setInterval(async () => {
    try {
        const envData = await simulationService.getEnvironmentData();
        io.emit('environment_update', envData);
    } catch (err) {
        console.error('SIMULATION_LOOP_ERROR:', err.message);
    }
}, 10000);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
