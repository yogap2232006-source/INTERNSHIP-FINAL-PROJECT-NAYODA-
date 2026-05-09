const express = require('express');
const router = express.Router();
const { createReview, getFreelancerReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('Client', 'Admin'), createReview);
router.get('/freelancer/:freelancerId', protect, getFreelancerReviews);

module.exports = router;
