const mongoose = require('mongoose');

const proposalSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    coverLetter: { type: String, required: true },
    bidAmount: { type: Number, required: true },
    estimatedDays: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
