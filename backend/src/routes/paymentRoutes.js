const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Removed auth middlewares so you can easily test the payment without logging in!
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

module.exports = router;
