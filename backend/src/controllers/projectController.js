const Project = require('../models/Project');

const getProjects = async (req, res) => {
    const { skills, minBudget, location } = req.query;
    
    let query = {};
    if (skills) query.skillsRequired = { $in: skills.split(',') };
    if (minBudget) query.budget = { $gte: Number(minBudget) };
    if (location) query.location = new RegExp(location, 'i');
    
    const projects = await Project.find(query).populate('client', 'name profile.location');
    res.json(projects);
};

const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id).populate('client', 'name profile.location');
    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

const createProject = async (req, res) => {
    const { title, description, budget, skillsRequired, location } = req.body;
    
    const project = new Project({
        title,
        description,
        budget,
        skillsRequired,
        location,
        client: req.user._id
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
};

const updateProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        if (project.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.budget = req.body.budget || project.budget;
        project.skillsRequired = req.body.skillsRequired || project.skillsRequired;
        project.location = req.body.location || project.location;
        project.status = req.body.status || project.status;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

const deleteProject = async (req, res) => {
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
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
