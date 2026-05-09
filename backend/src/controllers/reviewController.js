const Review = require('../models/Review');
const Project = require('../models/Project');

const createReview = async (req, res) => {
    const { projectId, freelancerId, rating, comment } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.status !== 'Completed') {
        return res.status(400).json({ message: 'Can only review completed projects' });
    }

    if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to review this project' });
    }

    const review = new Review({
        project: projectId,
        reviewer: req.user._id,
        freelancer: freelancerId,
        rating,
        comment
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
};

const getFreelancerReviews = async (req, res) => {
    const reviews = await Review.find({ freelancer: req.params.freelancerId }).populate('reviewer', 'name');
    res.json(reviews);
};

module.exports = { createReview, getFreelancerReviews };
