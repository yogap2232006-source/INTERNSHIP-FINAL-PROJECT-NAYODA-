const Project = require('../models/Project');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sn00srcSNz2YO4',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'vVAlpbOl0O4Ai3Pq6uw1ht0c'
});

const getProjects = async (req, res) => {
    try {
        const { skills, minBudget, location } = req.query;
        
        let query = {};
        if (req.user) {
            if (req.user.role === 'Client') {
                query.client = req.user._id;
            } else if (req.user.role === 'Freelancer') {
                query.freelancer = req.user._id;
            }
        }
        
        if (skills) query.skillsRequired = { $in: skills.split(',') };
        if (minBudget) query.budget = { $gte: Number(minBudget) };
        if (location) query.location = new RegExp(location, 'i');
        
        const projects = await Project.find(query)
            .populate('client', 'name email profile.location')
            .populate('freelancer', 'name email profile.location profile.phoneNumber');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('client', 'name email profile.location')
            .populate('freelancer', 'name email profile.location profile.phoneNumber');
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        if (req.user.role !== 'Freelancer' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Only freelancers can initiate and create project contracts' });
        }

        const { title, description, budget, skillsRequired, location, deadline, client, estimatedDuration } = req.body;
        
        const project = new Project({
            title,
            description,
            budget,
            skillsRequired,
            location,
            deadline: deadline ? new Date(deadline) : undefined,
            client: client,
            freelancer: req.user._id,
            estimatedDuration: Number(estimatedDuration) || 10,
            negotiatedDuration: Number(estimatedDuration) || 10
        });

        const createdProject = await project.save();
        
        await Notification.create({
            user: client,
            message: `Freelancer ${req.user.name} has created a new project contract for you: ${title}. Please acknowledge to begin requirements gathering.`
        });
        
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.client.toString() !== req.user._id.toString() && project.freelancer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this project' });
            }

            project.title = req.body.title || project.title;
            project.description = req.body.description || project.description;
            project.budget = req.body.budget || project.budget;
            project.skillsRequired = req.body.skillsRequired || project.skillsRequired;
            project.location = req.body.location || project.location;
            project.status = req.body.status || project.status;
            project.phase = req.body.phase || project.phase;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.client.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this project' });
            }
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- ORCHESTRATION METHODS ---

const acknowledgeProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        project.freelancerReplied = true;
        project.phase = 'Requirements';
        
        const updatedProject = await project.save();
        
        await Notification.create({
            user: project.client,
            message: `Contract proposal acknowledged. Please specify your requirements to proceed.`
        });
        await Notification.create({
            user: project.freelancer,
            message: `Client acknowledged the contract proposal for "${project.title}". Requirements gathering is active.`
        });
        
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitRequirements = async (req, res) => {
    try {
        const { requirements, complexity } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        project.requirementsCollected = requirements;
        project.complexityLevel = complexity || 'Low';
        
        if (project.complexityLevel === 'High' || requirements.toLowerCase().includes('complex') || requirements.toLowerCase().includes('large')) {
            project.phase = 'Negotiation';
            project.negotiatedDuration = Math.ceil(project.estimatedDuration * 1.5);
            project.timelineApproved = false;
            
            await Notification.create({
                user: project.client,
                message: `Scope alert: Your requirements exceed the baseline quote. Please approve the extended timeline.`
            });
        } else {
            project.negotiatedDuration = project.estimatedDuration;
            project.timelineApproved = true;
            project.phase = 'Payment';
            
            project.commissionFee = Number((project.budget * 0.10).toFixed(2));
            project.totalAmount = Number((project.budget + project.commissionFee).toFixed(2));
            
            await Notification.create({
                user: project.client,
                message: `Requirements collected! Scope matches quote. Please proceed to agreement and payment.`
            });
        }
        
        const updatedProject = await project.save();
        
        await Notification.create({
            user: project.freelancer,
            message: `Client submitted requirements for project: ${project.title}. AI is evaluating.`
        });
        
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const negotiateTimeline = async (req, res) => {
    try {
        const { agree } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (agree) {
            project.timelineApproved = true;
            project.phase = 'Payment';
            project.commissionFee = Number((project.budget * 0.10).toFixed(2));
            project.totalAmount = Number((project.budget + project.commissionFee).toFixed(2));
            
            await Notification.create({
                user: project.client,
                message: `Timeline approved. Please proceed to agreement and payment.`
            });
        } else {
            project.timelineApproved = false;
            project.phase = 'Negotiation';
            
            await Notification.create({
                user: project.client,
                message: `Negotiation stalled: You rejected the timeline extension. Please reduce your requirements.`
            });
        }
        
        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProjectPayment = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        const commission = Number((project.budget * 0.10).toFixed(2));
        const total = Number((project.budget + commission).toFixed(2));
        
        const options = {
            amount: Math.round(total * 100),
            currency: 'INR',
            receipt: `receipt_project_${project._id}_${Date.now()}`
        };
        
        const order = await razorpay.orders.create(options);
        
        project.paymentStatus = 'Pending';
        project.commissionFee = commission;
        project.totalAmount = total;
        await project.save();
        
        const transaction = new Transaction({
            user: project.client,
            project: project._id,
            razorpayOrderId: order.id,
            amount: total
        });
        await transaction.save();
        
        res.json({ order, project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyProjectPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        const transaction = await Transaction.findOne({ razorpayOrderId });
        if (transaction) {
            transaction.status = 'Paid';
            transaction.razorpayPaymentId = razorpayPaymentId;
            await transaction.save();
        }
        
        project.paymentStatus = 'Paid';
        project.phase = 'Active';
        project.status = 'In Progress';
        project.freelancerContactRevealed = true;
        
        const updatedProject = await project.save();
        
        await Notification.create({
            user: project.client,
            message: `Payment verified! Freelancer's full contact details are now revealed. Workspace is active.`
        });
        await Notification.create({
            user: project.freelancer,
            message: `Client payment verified! Workspace is active for project: ${project.title}.`
        });
        
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    acknowledgeProject,
    submitRequirements,
    negotiateTimeline,
    createProjectPayment,
    verifyProjectPayment
};
