import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectById, getProposalsForProject, createProposal } from '../utils/api';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Proposal Form States
  const [bidAmount, setBidAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProjectAndProposals = async () => {
    try {
      setLoading(true);
      setError('');
      const projectData = await getProjectById(id);
      setProject(projectData);
      
      const proposalsData = await getProposalsForProject(id);
      setProposals(proposalsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectAndProposals();
  }, [id]);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        projectId: id,
        bidAmount: parseFloat(bidAmount),
        coverLetter,
        estimatedDays: parseInt(estimatedDays, 10),
      };

      await createProposal(payload);
      
      // Reset form
      setBidAmount('');
      setCoverLetter('');
      setEstimatedDays('');
      
      // Reload proposals
      const updatedProposals = await getProposalsForProject(id);
      setProposals(updatedProposals || []);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container text-center mt-4">
          <div className="spinner"></div> Loading project details...
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main>
        <div className="container mt-4">
          <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="alert alert-error">{error || 'Project not found'}</div>
        </div>
      </main>
    );
  }

  const isFreelancer = user?.role?.toLowerCase() === 'freelancer';

  return (
    <main>
      <div className="container">
        <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div id="project-content">
          <div className="card">
            <div className="card-header">
              <h1>{project.title}</h1>
            </div>
            <div className="card-body">
              <p>{project.description}</p>
              <div className="grid grid-2 mt-4">
                <div>
                  <strong>Budget:</strong> ${project.budget}
                </div>
                <div>
                  <strong>Status:</strong> {project.status}
                </div>
                <div>
                  <strong>Client:</strong> {project.client?.name || 'Unknown'}
                </div>
                <div>
                  <strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                </div>
              </div>

              <h3 className="mt-4">Proposals</h3>
              <div id="proposals-list" className="mt-2">
                {proposals.length === 0 ? (
                  <p>No proposals yet.</p>
                ) : (
                  proposals.map((proposal) => (
                    <div className="card mb-2" key={proposal._id}>
                      <div className="flex justify-between">
                        <div>
                          <strong>{proposal.freelancer?.name || 'Anonymous'}</strong>
                          <p className="text-muted">
                            Bid: ${proposal.bidAmount} | Delivery in {proposal.estimatedDays} days
                          </p>
                          <p>{proposal.coverLetter}</p>
                        </div>
                        <div className="text-right">
                          <span className="badge">{proposal.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isFreelancer && (
                <>
                  <h3 className="mt-4">Submit Proposal</h3>
                  <form id="proposal-form" className="mt-2" onSubmit={handleProposalSubmit}>
                    <div className="form-group">
                      <label htmlFor="bidAmount">Bid Amount ($)</label>
                      <input
                        type="number"
                        id="bidAmount"
                        name="bidAmount"
                        step="0.01"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="estimatedDays">Estimated Days</label>
                      <input
                        type="number"
                        id="estimatedDays"
                        name="estimatedDays"
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="coverLetter">Your Cover Letter</label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows="4"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Proposal'}
                    </button>
                    {formError && (
                      <div className="alert alert-error mt-2">
                        {formError}
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
