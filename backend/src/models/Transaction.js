const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Created', 'Paid', 'Failed'], default: 'Created' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
