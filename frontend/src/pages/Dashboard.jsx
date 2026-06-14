import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main>
      <div className="container">
        <h1>Dashboard</h1>
        <div className="dashboard">
          <div className="stat-card">
            <div className="stat-label">Active Projects</div>
            <div className="stat-number">12</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Proposals</div>
            <div className="stat-number">5</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed Projects</div>
            <div className="stat-number">28</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Reviews</div>
            <div className="stat-number">4.8</div>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="card-body">
            <p>No recent activity yet.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
