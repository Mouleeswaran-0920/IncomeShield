const { Claim, User } = require('../models');
const logger = require('../utils/logger');

class DisasterService {
    constructor() {
        this.isDisasterMode = false;
        this.activeRegion = null;
        this.disasterData = null;
        this.scalingFactor = 1.0;
    }

    async triggerDisaster(region, data) {
        this.isDisasterMode = true;
        this.activeRegion = region;
        this.disasterData = data;
        
        // Dynamic scaling logic
        const activeClaimsCount = await Claim.count({ where: { status: 'PENDING' } });
        const availableFunds = 100000; // Mock budget for disaster
        const avgPayout = 500;
        this.scalingFactor = Math.min(1.0, availableFunds / (activeClaimsCount * avgPayout || 1));
        
        logger.info(`Disaster Mode Triggered: ${region}. Scaling Factor: ${this.scalingFactor}`);
        return { success: true, scalingFactor: this.scalingFactor };
    }

    async getPriorityQueue() {
        const claims = await Claim.findAll({
            where: { status: 'PENDING' },
            include: [{ model: User }],
            limit: 20
        });

        // Simple priority score logic
        const priorityQueue = claims.map(claim => {
            const reliability = 0.9; // Mock
            const incomeScore = 75; // Mock
            const severity = claim.loss / 1000;
            
            const priorityScore = (incomeScore * 0.3) + (severity * 0.5) + (reliability * 0.2);
            return {
                ...claim.toJSON(),
                priorityScore: parseFloat(priorityScore.toFixed(2))
            };
        }).sort((a, b) => b.priorityScore - a.priorityScore);

        return priorityQueue;
    }

    deactivate() {
        this.isDisasterMode = false;
        this.activeRegion = null;
        this.scalingFactor = 1.0;
    }
}

module.exports = new DisasterService();
