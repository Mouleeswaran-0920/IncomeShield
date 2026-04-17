const { Earning, Claim } = require('../models');

exports.getIncomeProtectionScore = async (req, res) => {
    const { user_id } = req.query;
    
    // Fetch user history
    const earnings = await Earning.findAll({ where: { user_id }, limit: 10 });
    
    // Mock factor calculation
    const consistency = earnings.length > 5 ? 85 : 40;
    const workingHours = 75; // Mock
    const zoneRisk = 20; // Lower is better
    const disruptionFreq = 15; // Lower is better
    
    // Calculate final score (0-100)
    // Weightage: consistency(40%), hours(20%), zone(20%), disruption(20%)
    const finalScore = (consistency * 0.4) + (workingHours * 0.2) + ((100 - zoneRisk) * 0.2) + ((100 - disruptionFreq) * 0.2);
    
    res.json({
        score: Math.round(finalScore),
        breakdown: {
            earnings_consistency: consistency,
            working_hours: workingHours,
            zone_risk: zoneRisk,
            disruption_frequency: disruptionFreq
        }
    });
};
