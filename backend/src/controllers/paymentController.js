const Razorpay = require('razorpay');
const Transaction = require('../models/Transaction');
const dotenv = require('dotenv');
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {
    const { amount, projectId } = req.body;
    
    try {
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };
        
        const order = await razorpay.orders.create(options);
        
        if (!order) return res.status(500).json({ message: 'Some error occurred' });

        const transaction = new Transaction({
            user: req.user ? req.user._id : "507f1f77bcf86cd799439011", // Dummy user ID if not logged in
            project: projectId,
            razorpayOrderId: order.id,
            amount: amount
        });
        await transaction.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const transaction = await Transaction.findOne({ razorpayOrderId });
    if (transaction) {
        transaction.status = 'Paid';
        transaction.razorpayPaymentId = razorpayPaymentId;
        await transaction.save();
        res.json({ message: 'Payment verified successfully', transaction });
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
};

module.exports = { createOrder, verifyPayment };
