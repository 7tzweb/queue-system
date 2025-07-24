const Agent = require('../models/Agent');
const { validateAgentData } = require('../utils/validator');

const createAgent = async (req, res, next) => {
  try {
    const { name, department } = req.body;

    const validation = validateAgentData({ name, department });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const agent = new Agent({ name, department });
    await agent.save();
    res.status(201).json(agent);
  } catch (err) {
    next(err);
  }
};

const getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAgent,
  getAllAgents
};
