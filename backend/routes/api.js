const express = require('express');
const simulatorController = require('../controllers/simulatorController');

const router = express.Router();

// API endpoints
router.post('/simulate', simulatorController.simulate);
router.get('/algorithms', simulatorController.getAlgorithms);
router.post('/compare', simulatorController.compareAlgorithms);

module.exports = router;
