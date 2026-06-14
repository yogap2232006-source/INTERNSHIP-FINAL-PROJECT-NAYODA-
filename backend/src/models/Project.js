const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    skillsRequired: [String],
    location: String,
    deadline: Date,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Open'
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    phase: {
        type: String,
        enum: ['Discovery', 'Requirements', 'Negotiation', 'Payment', 'Active'],
        default: 'Discovery'
    },
    freelancerReplied: {
        type: Boolean,
        default: false
    },
    requirementsCollected: {
        type: String
    },
    complexityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    estimatedDuration: {
        type: Number,
        default: 10
    },
    negotiatedDuration: {
        type: Number,
        default: 10
    },
    timelineApproved: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Pending', 'Paid'],
        default: 'Unpaid'
    },
    commissionFee: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    freelancerContactRevealed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
