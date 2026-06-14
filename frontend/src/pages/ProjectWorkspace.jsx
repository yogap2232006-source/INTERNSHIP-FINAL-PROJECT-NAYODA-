import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Requirement gathering form
  const [requirements, setRequirements] = useState('');
  const [complexity, setComplexity] = useState('Low');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [reqError, setReqError] = useState('');

  // Negotiation state
  const [submittingNegotiation, setSubmittingNegotiation] = useState(false);
  const [negotiationRejectedMsg, setNegotiationRejectedMsg] = useState(false);

  // Payment state
  const [agreeCheckbox, setAgreeCheckbox] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const loadProject = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
      // Pre-populate requirements if they exist
      if (response.data?.requirementsCollected) {
        setRequirements(response.data.requirementsCollected);
        setComplexity(response.data.complexityLevel || 'Low');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load project workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  // Phase 1: Acknowledge
  const handleAcknowledge = async () => {
    try {
      await api.post(`/projects/${id}/acknowledge`);
      await loadProject();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to acknowledge project');
    }
  };

  // Phase 2: Submit Requirements
  const handleSubRequirements = async (e) => {
    e.preventDefault();
    if (!requirements.trim()) {
      setReqError('Please specify your requirements.');
      return;
    }
    setSubmittingReq(true);
    setReqError('');
    setNegotiationRejectedMsg(false);

    try {
      await api.post(`/projects/${id}/requirements`, {
        requirements,
        complexity
      });
      await loadProject();
    } catch (err) {
      setReqError(err.response?.data?.message || err.message || 'Failed to submit requirements');
    } finally {
      setSubmittingReq(false);
    }
  };

  // Phase 3: Negotiate timeline
  const handleNegotiate = async (agree) => {
    setSubmittingNegotiation(true);
    try {
      await api.post(`/projects/${id}/negotiate`, { agree });
      if (!agree) {
        setNegotiationRejectedMsg(true);
      }
      await loadProject();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Negotiation failed');
    } finally {
      setSubmittingNegotiation(false);
    }
  };

  // Phase 4: Payment Simulation
  const handlePayment = async () => {
    if (!agreeCheckbox) {
      setPayError('You must agree to the marketplace terms to proceed.');
      return;
    }
    setPaying(true);
    setPayError('');

    try {
      // Create order in backend
      const response = await api.post(`/projects/${id}/pay`);
      const { order } = response.data;
      
      // Simulate verified checkout directly (or load Razorpay checkout)
      setTimeout(async () => {
        try {
          await api.post(`/projects/${id}/verify-payment`, {
            razorpayOrderId: order.id,
            razorpayPaymentId: `pay_sim_${Date.now()}`
          });
          await loadProject();
          setPaying(false);
        } catch (innerErr) {
          setPayError(innerErr.response?.data?.message || innerErr.message || 'Verification failed');
          setPaying(false);
        }
      }, 1500);

    } catch (err) {
      setPayError(err.response?.data?.message || err.message || 'Payment initiation failed');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container text-center mt-4">
          <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></div>
          <p className="mt-2 text-muted">Entering AI Workspace...</p>
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

  const isClient = user?._id?.toString() === project.client?._id?.toString();
  const isFreelancer = user?._id?.toString() === project.freelancer?._id?.toString();
  
  // Determine active stage classes
  const getStageClass = (stages) => {
    return stages.includes(project.phase) ? 'stage-active' : 'stage-pending';
  };

  return (
    <main style={{ background: '#f3f4f6', minHeight: 'calc(100vh - 70px)', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Workspace Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Contract Orchestrator Workspace</h1>
            <p className="text-muted" style={{ margin: 0 }}>
              Project: <span style={{ fontWeight: 600 }}>{project.title}</span> | AI Agent ID: <span style={{ fontFamily: 'monospace' }}>{project._id.substring(18)}</span>
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
            ← Back to List
          </button>
        </div>

        {/* Dynamic State Tracker (Sleek Pipeline) */}
        <div 
          className="card" 
          style={{ 
            padding: '1.25rem 2rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Stage 1: Discovery */}
            <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: '100px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 0.5rem auto',
                background: project.phase === 'Discovery' ? '#3b82f6' : '#10b981',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
              }}>
                1
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: project.phase === 'Discovery' ? 700 : 500 }}>Discovery</span>
            </div>

            {/* Stage 2: Requirements */}
            <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: '100px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 0.5rem auto',
                background: project.phase === 'Requirements' ? '#3b82f6' : (['Negotiation', 'Payment', 'Active'].includes(project.phase) ? '#10b981' : '#d1d5db'),
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
              }}>
                2
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: project.phase === 'Requirements' ? 700 : 500 }}>Requirements</span>
            </div>

            {/* Stage 3: Negotiation */}
            <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: '100px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 0.5rem auto',
                background: project.phase === 'Negotiation' ? '#3b82f6' : (['Payment', 'Active'].includes(project.phase) ? '#10b981' : '#d1d5db'),
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
              }}>
                3
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: project.phase === 'Negotiation' ? 700 : 500 }}>Negotiation</span>
            </div>

            {/* Stage 4: Payment */}
            <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: '100px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 0.5rem auto',
                background: project.phase === 'Payment' ? '#3b82f6' : (project.phase === 'Active' ? '#10b981' : '#d1d5db'),
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
              }}>
                4
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: project.phase === 'Payment' ? 700 : 500 }}>Payment Gateway</span>
            </div>

            {/* Stage 5: Active */}
            <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: '100px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 0.5rem auto',
                background: project.phase === 'Active' ? '#10b981' : '#d1d5db',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
              }}>
                5
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: project.phase === 'Active' ? 700 : 500 }}>Project Active</span>
            </div>

          </div>
        </div>

        {/* Workspace Body Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
          
          {/* Main Workspace Orchestration Card */}
          <div className="card" style={{ padding: '2rem', minHeight: '400px' }}>
            
            {/* CENTRAL AI AGENT AVATAR HEADER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }}>
                🤖
              </div>
              <div>
                <strong style={{ fontSize: '1.125rem', display: 'block', color: '#1f2937' }}>Nayoda central Orchestration AI</strong>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>AI Agent actively coordinating and enforcing project workflow.</span>
              </div>
            </div>

            {/* PHASE 1: DISCOVERY */}
            {project.phase === 'Discovery' && (
              <div>
                <div style={{ padding: '1.5rem', background: '#eff6ff', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', marginBottom: '2rem' }}>
                  <h4 style={{ color: '#1e3a8a', marginTop: 0 }}>Contract Proposal Awaiting Acknowledgment</h4>
                  <p style={{ margin: 0, fontSize: '0.975rem' }}>
                    The Freelancer has created this project contract proposal. The collaboration will begin once the Client acknowledges the contract details.
                  </p>
                </div>

                {isClient && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1.5rem', background: 'white', maxWidth: '500px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
                      <h4 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Proposed Contract Baseline</h4>
                      <p><strong>Title:</strong> {project.title}</p>
                      <p><strong>Proposed Budget:</strong> ${project.budget}</p>
                      <p><strong>Proposed Duration:</strong> {project.estimatedDuration} Days</p>
                      <p style={{ fontSize: '0.875rem', margin: 0 }} className="text-muted"><strong>Description:</strong> {project.description}</p>
                    </div>
                    <h3>Acknowledge Proposal</h3>
                    <p style={{ margin: '0.5rem 0 2rem 0', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
                      Please review the contract details. Once you acknowledge, the requirement gathering process will begin.
                    </p>
                    <button className="btn btn-primary" onClick={handleAcknowledge}>
                      Acknowledge Contract Proposal
                    </button>
                  </div>
                )}

                {isFreelancer && (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', marginBottom: '1rem' }}></div>
                    <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Awaiting Client's initial acknowledgment...</h3>
                    <p className="text-muted">The client must acknowledge your proposed contract. You will be notified instantly when they respond.</p>
                    
                    {/* Simulator Button */}
                    <div style={{ marginTop: '3rem', borderTop: '1px dashed #d1d5db', paddingTop: '2rem' }}>
                      <span className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '1rem' }}>Demo Helper: Simulate Client's acknowledgment</span>
                      <button className="btn btn-success" onClick={handleAcknowledge}>
                        Simulate Client Acknowledgment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 2: REQUIREMENT GATHERING */}
            {project.phase === 'Requirements' && (
              <div>
                <div style={{ padding: '1.5rem', background: '#ecfdf5', borderRadius: '0.75rem', borderLeft: '4px solid #10b981', marginBottom: '2rem' }}>
                  <h4 style={{ color: '#065f46', marginTop: 0 }}>Requirement Gathering Phase Active</h4>
                  <p style={{ margin: 0, fontSize: '0.975rem' }}>
                    The Freelancer is ready! The client must now input their detailed requirements. The Central AI will analyze complexity to check if it fits the quoted timeframe.
                  </p>
                </div>

                {isClient && (
                  <form onSubmit={handleSubRequirements}>
                    <div className="form-group">
                      <label htmlFor="complexity">Assess Project Complexity</label>
                      <select id="complexity" value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                        <option value="Low">Low Complexity (Fits Quoted {project.estimatedDuration} Days)</option>
                        <option value="Medium">Medium Complexity (Fits Quoted {project.estimatedDuration} Days)</option>
                        <option value="High">High Complexity (Triggers Scope & Timeline Negotiation)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="req-text">Project Specifications & Requirements</label>
                      <textarea
                        id="req-text"
                        rows="8"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        required
                        placeholder="Detail the technical specifications, requirements, features, and constraints of your project. Note: typing words like 'complex' or 'large' will trigger timeline evaluations."
                      ></textarea>
                    </div>

                    {reqError && <div className="alert alert-error">{reqError}</div>}
                    
                    <button type="submit" className="btn btn-primary" disabled={submittingReq}>
                      {submittingReq ? 'Forwarding to Freelancer...' : 'Submit Requirements to AI Orchestrator'}
                    </button>
                  </form>
                )}

                {isFreelancer && (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', marginBottom: '1rem' }}></div>
                    <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Client is specifying requirements...</h3>
                    <p className="text-muted">The AI Agent is guiding the Client to specify all project details. You will receive them shortly.</p>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 3: SCOPE & TIMELINE NEGOTIATION */}
            {project.phase === 'Negotiation' && (
              <div>
                <div style={{ padding: '1.5rem', background: '#fffbeb', borderRadius: '0.75rem', borderLeft: '4px solid #f59e0b', marginBottom: '2rem' }}>
                  <h4 style={{ color: '#78350f', marginTop: 0 }}>Scope & Timeline Negotiation Active</h4>
                  <p style={{ margin: 0, fontSize: '0.975rem' }}>
                    The Central AI Orchestrator has detected that the requested scope exceeds the initial quote. A timeline extension negotiation is required.
                  </p>
                </div>

                {isClient && (
                  <div style={{ padding: '1.5rem', border: '1px solid #f59e0b', borderRadius: '0.5rem', background: '#fffbeb', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                    <h3 style={{ color: '#78350f' }}>AI Scope Alert: Extension Requested</h3>
                    <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#451a03' }}>
                      <strong>"The requested scope exceeds the initially quoted duration. Do you agree to an extended timeline?"</strong>
                    </p>
                    
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '0.375rem', display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                      <div>
                        <span className="text-muted" style={{ display: 'block', fontSize: '0.875rem' }}>Original Quote</span>
                        <strong>{project.estimatedDuration} Days</strong>
                      </div>
                      <div style={{ fontSize: '1.5rem', color: '#9ca3af' }}>➔</div>
                      <div>
                        <span className="text-muted" style={{ display: 'block', fontSize: '0.875rem' }}>AI Suggested Extension</span>
                        <strong className="text-warning">{project.negotiatedDuration} Days</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleNegotiate(true)}
                        disabled={submittingNegotiation}
                      >
                        Accept Timeline Extension
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleNegotiate(false)}
                        disabled={submittingNegotiation}
                      >
                        Reject Timeline Extension
                      </button>
                    </div>

                    {negotiationRejectedMsg && (
                      <div className="alert alert-error mt-4" style={{ textAlign: 'left' }}>
                        <strong>Timeline extension rejected!</strong> Mismatch in scope and timeline. Under central AI instruction: Please edit/reduce your project specifications to fit the freelancer's original {project.estimatedDuration} days quote before proceeding.
                        <div style={{ marginTop: '1rem' }}>
                          <button className="btn btn-outline" onClick={() => {
                            // Let client edit requirements
                            api.post(`/projects/${id}/requirements`, {
                              requirements: project.requirementsCollected,
                              complexity: 'Low' // Auto reset to Low for edit
                            }).then(() => loadProject());
                          }}>
                            Modify & Reduce Requirements
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isFreelancer && (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', marginBottom: '1rem' }}></div>
                    <h3 style={{ margin: '1rem 0 0.5rem 0' }}>AI is negotiating scope with the client...</h3>
                    <p className="text-muted">
                      The client submitted heavy requirements. AI suggested extending the timeline to <strong>{project.negotiatedDuration} days</strong>. Waiting for client response.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 4: PAYMENT & AGREEMENT ENFORCEMENT */}
            {project.phase === 'Payment' && (
              <div>
                <div style={{ padding: '1.5rem', background: '#eff6ff', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', marginBottom: '2rem' }}>
                  <h4 style={{ color: '#1e3a8a', marginTop: 0 }}>Payment & Agreement Enforcement Active</h4>
                  <p style={{ margin: 0, fontSize: '0.975rem' }}>
                    Terms are locked and timeline is agreed! To begin implementation, the client must review the agreement, acknowledge the marketplace commission, and deposit the funds.
                  </p>
                </div>

                {isClient && (
                  <div>
                    {/* Contract Box */}
                    <div style={{ border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1.5rem', background: '#f9fafb', marginBottom: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        Agreement Contract details
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <span className="text-muted" style={{ fontSize: '0.875rem' }}>Freelancer Partner:</span>
                          <strong style={{ display: 'block' }}>{project.freelancer?.name}</strong>
                        </div>
                        <div>
                          <span className="text-muted" style={{ fontSize: '0.875rem' }}>Agreed Project Duration:</span>
                          <strong style={{ display: 'block' }}>{project.negotiatedDuration} Days</strong>
                        </div>
                        <div>
                          <span className="text-muted" style={{ fontSize: '0.875rem' }}>Project Base Cost:</span>
                          <strong style={{ display: 'block' }}>${project.budget}</strong>
                        </div>
                        <div>
                          <span className="text-muted" style={{ fontSize: '0.875rem' }}>Status:</span>
                          <strong className="text-success" style={{ display: 'block' }}>Pending Deposit</strong>
                        </div>
                      </div>

                      {/* Explicit Commission Highlights */}
                      <div style={{ padding: '1rem', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
                        <strong style={{ color: '#b45309', display: 'block', marginBottom: '0.25rem' }}>Marketplace Commission Highlight</strong>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.975rem' }}>
                          <span>Marketplace Orchestration Fee (10%):</span>
                          <strong>${project.commissionFee || (project.budget * 0.10).toFixed(2)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700, borderTop: '1px solid #f59e0b', marginTop: '0.5rem', paddingTop: '0.5rem', color: '#78350f' }}>
                          <span>Total Amount to Pay:</span>
                          <span>${project.totalAmount || (project.budget * 1.10).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Checkbox agreement */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id="agree-chk"
                          checked={agreeCheckbox}
                          onChange={(e) => setAgreeCheckbox(e.target.checked)}
                          style={{ width: 'auto', cursor: 'pointer' }}
                        />
                        <label htmlFor="agree-chk" style={{ margin: 0, cursor: 'pointer', fontSize: '0.925rem' }}>
                          I read and agree to the marketplace terms, timeline of {project.negotiatedDuration} days, and total fee of ${project.totalAmount}.
                        </label>
                      </div>
                    </div>

                    {payError && <div className="alert alert-error">{payError}</div>}

                    <button
                      className="btn btn-primary btn-block"
                      onClick={handlePayment}
                      disabled={paying}
                      style={{ padding: '1rem', fontSize: '1.125rem', fontWeight: 600 }}
                    >
                      {paying ? 'Verifying Gateway Transaction...' : 'Pay Deposit & Launch Project'}
                    </button>
                  </div>
                )}

                {isFreelancer && (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', marginBottom: '1rem' }}></div>
                    <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Awaiting Client payment deposit...</h3>
                    <p className="text-muted">
                      Timeline of <strong>{project.negotiatedDuration} days</strong> has been locked. The workspace will unlock for direct collaboration once payment clears.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 5: ACTIVE */}
            {project.phase === 'Active' && (
              <div>
                <div style={{ padding: '1.5rem', background: '#ecfdf5', borderRadius: '0.75rem', borderLeft: '4px solid #10b981', marginBottom: '2rem' }}>
                  <h4 style={{ color: '#065f46', marginTop: 0 }}>🎉 Project Active & Fully Orchestrated</h4>
                  <p style={{ margin: 0, fontSize: '0.975rem' }}>
                    Orchestration successfully completed. Payment verified and locked in escrow. Direct collaboration details have been unlocked.
                  </p>
                </div>

                <div className="grid grid-2" style={{ gap: '2rem' }}>
                  
                  {/* Client Details Box */}
                  <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '0.5rem', background: '#f9fafb' }}>
                    <strong className="text-muted" style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Client Details</strong>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{project.client?.name}</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>Email: {project.client?.email}</p>
                    <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>Location: {project.client?.profile?.location || 'Remote'}</p>
                  </div>

                  {/* Freelancer details (Unlocked) */}
                  <div style={{ border: '1px solid #10b981', padding: '1.5rem', borderRadius: '0.5rem', background: '#f0fdf4' }}>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', background: '#10b981', color: 'white', padding: '0.125rem 0.5rem', 
                        borderRadius: '0.25rem', fontWeight: 600, float: 'right' 
                      }}
                    >
                      UNLOCKED
                    </span>
                    <strong className="text-success" style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Freelancer Contact Details</strong>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{project.freelancer?.name}</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>Email: {project.freelancer?.email}</p>
                    <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>Phone: {project.freelancer?.profile?.phoneNumber || 'Not provided'}</p>
                  </div>

                </div>

                <div className="card mt-4" style={{ border: '1px dashed #d1d5db', background: '#fafafa', textAlign: 'center', padding: '2rem' }}>
                  <h3>Requirement Handover Document</h3>
                  <div style={{ textAlign: 'left', background: 'white', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', marginTop: '1rem' }}>
                    <strong>Agreed Scope Timeline:</strong> {project.negotiatedDuration} Days <br />
                    <strong>Complexity Level:</strong> {project.complexityLevel} <br />
                    <strong>Deposited Budget:</strong> ${project.budget} <br /><br />
                    <strong>Handed Over Specifications:</strong>
                    <p className="text-muted" style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontSize: '0.925rem' }}>
                      {project.requirementsCollected}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Project Summary */}
          <div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                Summary Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>FREELANCER</span>
                  <strong>{project.freelancer?.name}</strong>
                  <span style={{ fontSize: '0.875rem', display: 'block' }} className="text-info">{project.freelancer?.profile?.title}</span>
                </div>

                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>CLIENT</span>
                  <strong>{project.client?.name}</strong>
                </div>

                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>INITIAL QUOTED TIMELINE</span>
                  <strong>{project.estimatedDuration} Days</strong>
                </div>

                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>AGREED BUDGET</span>
                  <strong>${project.budget}</strong>
                </div>

                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>ORCHESTRATION PHASE</span>
                  <span 
                    style={{ 
                      fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '0.25rem',
                      background: project.phase === 'Active' ? '#d1fae5' : '#eff6ff',
                      color: project.phase === 'Active' ? '#065f46' : '#2563eb',
                      display: 'inline-block', marginTop: '0.25rem'
                    }}
                  >
                    {project.phase}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
