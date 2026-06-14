import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('10');
  const [deadline, setDeadline] = useState('');
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();
  const isFreelancer = user?.role?.toLowerCase() === 'freelancer';

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/projects');
      setProjects(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await api.get('/profile/clients');
      setClients(response.data || []);
    } catch (err) {
      console.error('Failed to load client directory', err);
    }
  };

  useEffect(() => {
    loadProjects();
    if (isFreelancer) {
      loadClients();
    }
  }, [isFreelancer]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!selectedClientId) {
      setFormError('Please select a client partner.');
      return;
    }
    setFormError('');
    setCreating(true);

    try {
      const payload = {
        title,
        description,
        budget: parseFloat(budget),
        estimatedDuration: parseInt(duration, 10),
        client: selectedClientId,
        deadline: deadline ? new Date(deadline) : undefined,
      };

      await api.post('/projects', payload);
      
      // Reset form & close modal
      setTitle('');
      setDescription('');
      setBudget('');
      setDuration('10');
      setDeadline('');
      setSelectedClientId('');
      setIsModalOpen(false);
      
      // Reload list
      loadProjects();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <main>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Project Contracts</h1>
            <p className="text-muted">Manage active marketplace contracts and orchestration workflows.</p>
          </div>
          {isFreelancer && (
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Initiate New Contract
            </button>
          )}
        </div>

        {isModalOpen && (
          <div
            id="new-project-modal"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '95vh', overflowY: 'auto' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Create Contract</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
                >
                  &times;
                </button>
              </div>
              <form id="create-project-form" className="card-body" onSubmit={handleCreateProject} style={{ padding: '1rem 0' }}>
                
                <div className="form-group">
                  <label htmlFor="client-select">Select Client Partner</label>
                  <select 
                    id="client-select" 
                    value={selectedClientId} 
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Contract Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Full Stack E-commerce website"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Initial Baseline Scope</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Provide a high-level summary of the baseline scope..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Escrow Budget ($)</label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Quoted Duration (Days)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">Target Delivery Date (Optional)</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                {formError && (
                  <div className="alert alert-error mt-2">
                    {formError}
                  </div>
                )}
              </form>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormError('');
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-project-form"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Contract Proposal'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center mt-4">
            <div className="spinner"></div> Loading contracts...
          </div>
        ) : error ? (
          <div className="alert alert-error mt-4">{error}</div>
        ) : projects.length === 0 ? (
          <div className="text-center mt-4" style={{ padding: '3rem 0', background: 'white', borderRadius: '0.5rem', border: '1px dashed #d1d5db' }}>
            <p className="text-muted">No contracts initiated yet.</p>
            {isFreelancer ? (
              <button className="btn btn-primary mt-2" onClick={() => setIsModalOpen(true)}>
                Create First Contract Proposal
              </button>
            ) : (
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Go to the Freelancers Directory to notify a freelancer to start a project.</p>
            )}
          </div>
        ) : (
          <div id="projects-list" className="grid grid-2">
            {projects.map((project) => (
              <div className="card" key={project._id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem', height: '3rem', overflow: 'hidden' }}>{project.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '1rem 0', fontSize: '0.875rem' }}>
                    <div>
                      <strong>Partner:</strong> {isFreelancer ? project.client?.name : project.freelancer?.name}
                    </div>
                    <div>
                      <strong>Budget:</strong> ${project.budget}
                    </div>
                    <div>
                      <strong>Phase:</strong> <span style={{ fontWeight: 600, color: '#2563eb' }}>{project.phase}</span>
                    </div>
                    <div>
                      <strong>Agreed Duration:</strong> {project.negotiatedDuration} Days
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginTop: '1rem' }}>
                  <Link to={`/projects/${project._id}/workspace`} className="btn btn-primary btn-block">
                    Open Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
