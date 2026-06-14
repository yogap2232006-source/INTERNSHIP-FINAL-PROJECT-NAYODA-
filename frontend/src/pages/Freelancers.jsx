import React, { useState, useEffect } from 'react';
import { api, useAuth } from '../context/AuthContext';

export default function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifyingId, setNotifyingId] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    async function fetchFreelancers() {
      try {
        setLoading(true);
        const response = await api.get('/profile/freelancers');
        setFreelancers(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load freelancers');
      } finally {
        setLoading(false);
      }
    }
    fetchFreelancers();
  }, []);

  const handleSelectFreelancer = async (freelancer) => {
    setNotifyingId(freelancer._id);
    try {
      const payload = {
        user: freelancer._id,
        message: `Client ${user?.name || 'A buyer'} is interested in collaborating with you. Please create a new project contract to begin discovery!`
      };
      await api.post('/notifications', payload);
      alert(`Interest successfully sent! ${freelancer.name} has been notified and will initiate the project contract soon.`);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to notify freelancer');
    } finally {
      setNotifyingId(null);
    }
  };

  const isClient = user?.role?.toLowerCase() === 'client';

  return (
    <main>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Freelancer Directory</h1>
            <p className="text-muted">Explore top freelance specialists and notify them to set up contracts.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-4">
            <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }}></div>
            <p className="mt-2 text-muted">Searching the network...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : freelancers.length === 0 ? (
          <div className="card text-center mt-4">
            <p className="text-muted">No freelancers found in the directory.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {freelancers.map((freelancer) => (
              <div 
                className="card" 
                key={freelancer._id}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{freelancer.name}</h3>
                      <span className="text-info" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {freelancer.profile?.title || 'Freelancer'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#10b981' }}>
                        ${freelancer.profile?.hourlyRate || '40'}/hr
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Turnaround: {freelancer.profile?.projectDuration || '10'} days
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted" style={{ fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '3.75rem' }}>
                    {freelancer.profile?.bio || 'No bio provided.'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
                    {freelancer.profile?.skills?.map((skill, index) => (
                      <span 
                        key={index} 
                        style={{ 
                          fontSize: '0.75rem', 
                          background: '#eff6ff', 
                          color: '#2563eb', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          fontWeight: 500
                        }}
                      >
                        {skill}
                      </span>
                    )) || <span className="text-muted" style={{ fontSize: '0.75rem' }}>No skills listed</span>}
                  </div>
                </div>
                
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', justifyItems: 'space-between', alignItems: 'center' }}>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                    📍 {freelancer.profile?.location || 'Remote'}
                  </span>
                  {isClient && (
                    <button 
                      className="btn btn-primary" 
                      style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      onClick={() => handleSelectFreelancer(freelancer)}
                      disabled={notifyingId === freelancer._id}
                    >
                      {notifyingId === freelancer._id ? 'Notifying...' : 'Select & Collaborate'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
