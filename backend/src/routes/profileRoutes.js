const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;
