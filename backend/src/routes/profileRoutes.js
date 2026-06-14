const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getFreelancers, getClients } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/freelancers', protect, getFreelancers);
router.get('/clients', protect, getClients);

router.route('/')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;
