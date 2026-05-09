const User = require('../models/User');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');

const getDashboardMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalClients = await User.countDocuments({ role: 'Client' });
        const totalFreelancers = await User.countDocuments({ role: 'Freelancer' });
        
        const activeProjects = await Project.countDocuments({ status: { $in: ['Open', 'In Progress'] } });
        const completedProjects = await Project.countDocuments({ status: 'Completed' });
        
        const totalProposals = await Proposal.countDocuments();

        const completed = await Project.find({ status: 'Completed' });
        const totalRevenue = completed.reduce((acc, curr) => acc + (curr.budget * 0.10), 0);

        res.json({
            users: {
                total: totalUsers,
                clients: totalClients,
                freelancers: totalFreelancers
            },
            projects: {
                active: activeProjects,
                completed: completedProjects
            },
            proposals: totalProposals,
            revenue: totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDashboardMetrics };
