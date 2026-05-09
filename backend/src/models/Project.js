const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    skillsRequired: [String],
    location: String,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Open'
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
