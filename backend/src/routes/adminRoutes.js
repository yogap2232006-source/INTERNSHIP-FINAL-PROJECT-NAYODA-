const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/metrics')
    .get(protect, authorize('Admin'), getDashboardMetrics);

module.exports = router;
