import { api } from '../context/AuthContext.jsx';

export async function getProjects() {
    const response = await api.get('/projects');
    return response.data;
}

export async function getProjectById(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
}

export async function createProject(data) {
    const response = await api.post('/projects', data);
    return response.data;
}

export async function updateProject(id, data) {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
}

export async function deleteProject(id) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
}

export async function getProposalsForProject(projectId) {
    const response = await api.get(`/proposals/project/${projectId}`);
    return response.data;
}

export async function createProposal(data) {
    const response = await api.post('/proposals', data);
    return response.data;
}

export async function getProfile() {
    const response = await api.get('/profile');
    return response.data;
}

export async function updateProfile(data) {
    const response = await api.put('/profile', data);
    return response.data;
}

export async function getReviews() {
    const response = await api.get('/reviews');
    return response.data;
}

export async function createReview(data) {
    const response = await api.post('/reviews', data);
    return response.data;
}
