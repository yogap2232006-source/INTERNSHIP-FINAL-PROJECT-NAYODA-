const Proposal = require('../models/Proposal');
const Project = require('../models/Project');

const getProposalsForProject = async (req, res) => {
    const proposals = await Proposal.find({ project: req.params.projectId }).populate('freelancer', 'name profile');
    res.json(proposals);
};

const submitProposal = async (req, res) => {
    const projectId = req.body.projectId || req.body.project_id;
    const coverLetter = req.body.coverLetter || req.body.proposal_text || req.body.cover_letter;
    const bidAmount = req.body.bidAmount || req.body.bid_amount;
    const estimatedDays = req.body.estimatedDays || req.body.estimated_days;
    
    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const existingProposal = await Proposal.findOne({ project: projectId, freelancer: req.user._id });
    if (existingProposal) {
        return res.status(400).json({ message: 'You have already submitted a proposal for this project' });
    }

    const proposal = new Proposal({
        project: projectId,
        freelancer: req.user._id,
        coverLetter,
        bidAmount,
        estimatedDays
    });

    const createdProposal = await proposal.save();
    res.status(201).json(createdProposal);
};

const updateProposalStatus = async (req, res) => {
    const { status } = req.body; 
    
    const proposal = await Proposal.findById(req.params.id).populate('project');

    if (proposal) {
        if (proposal.project.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this proposal' });
        }

        proposal.status = status;
        const updatedProposal = await proposal.save();
        res.json(updatedProposal);
    } else {
        res.status(404).json({ message: 'Proposal not found' });
    }
};

module.exports = {
    getProposalsForProject,
    submitProposal,
    updateProposalStatus
};
