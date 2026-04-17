const disasterService = require('../services/DisasterService');
const logger = require('../utils/logger');

exports.triggerDisaster = async (req, res) => {
    const { region, data } = req.body;
    const result = await disasterService.triggerDisaster(region, data);
    res.json(result);
};

exports.getPriorityQueue = async (req, res) => {
    const queue = await disasterService.getPriorityQueue();
    res.json(queue);
};

exports.getStatus = (req, res) => {
    res.json({
        isDisasterMode: disasterService.isDisasterMode,
        activeRegion: disasterService.activeRegion,
        scalingFactor: disasterService.scalingFactor
    });
};
