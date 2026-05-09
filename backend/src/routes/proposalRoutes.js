const express = require('express');
const router = express.Router();
const { getProposalsForProject, submitProposal, updateProposalStatus } = require('../controllers/proposalController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, authorize('Freelancer', 'Admin'), submitProposal);

router.route('/project/:projectId')
    .get(protect, getProposalsForProject);

router.route('/:id/status')
    .put(protect, authorize('Client', 'Admin'), updateProposalStatus);

module.exports = router;
