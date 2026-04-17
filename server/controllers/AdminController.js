const { Claim, User, Earning } = require('../models');
const disasterService = require('../services/DisasterService');

exports.getOverview = async (req, res) => {
    const totalPayouts = await Claim.sum('payout', { where: { status: 'PAID' } }) || 0;
    const activeClaims = await Claim.count({ where: { status: 'PENDING' } });
    const totalUsers = await User.count();
    
    res.json({
        totalPayouts,
        activeClaims,
        totalUsers,
        systemStatus: disasterService.isDisasterMode ? 'DISASTER_MODE_ACTIVE' : 'HEALTHY',
        scalingFactor: disasterService.scalingFactor
    });
};

exports.getClaims = async (req, res) => {
    const claims = await Claim.findAll({
        include: [{ model: User }],
        order: [['createdAt', 'DESC']],
        limit: 50
    });
    res.json(claims);
};

exports.getRiskHeatmap = async (req, res) => {
    // Mock risk heatmap data for demonstration
    const heatmap = [
        { lat: 19.0760, lng: 72.8777, intensity: 0.8, zone: 'Mumbai Central' },
        { lat: 28.6139, lng: 77.2090, intensity: 0.9, zone: 'Delhi NCR' },
        { lat: 12.9716, lng: 77.5946, intensity: 0.4, zone: 'Bangalore' },
        { lat: 13.0827, lng: 80.2707, intensity: 0.6, zone: 'Chennai' }
    ];
    res.json(heatmap);
};
