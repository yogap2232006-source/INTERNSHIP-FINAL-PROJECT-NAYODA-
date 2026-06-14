const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getProjects)
    .post(protect, authorize('Client', 'Freelancer', 'Admin'), createProject);

router.post('/:id/acknowledge', protect, acknowledgeProject);
router.post('/:id/requirements', protect, submitRequirements);
router.post('/:id/negotiate', protect, negotiateTimeline);
router.post('/:id/pay', protect, createProjectPayment);
router.post('/:id/verify-payment', protect, verifyProjectPayment);

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, authorize('Client', 'Freelancer', 'Admin'), updateProject)
    .delete(protect, authorize('Client', 'Freelancer', 'Admin'), deleteProject);

module.exports = router;
