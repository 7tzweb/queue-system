const express = require('express');
const router = express.Router();
const { createAgent, getAllAgents } = require('../controllers/agentController');

router.post('/', createAgent);     // POST /agents
router.get('/', getAllAgents);     // GET /agents

module.exports = router;
