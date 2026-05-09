const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, authorize('Client', 'Admin'), createProject);

router.route('/:id')
    .get(getProjectById)
    .put(protect, authorize('Client', 'Admin'), updateProject)
    .delete(protect, authorize('Client', 'Admin'), deleteProject);

module.exports = router;
