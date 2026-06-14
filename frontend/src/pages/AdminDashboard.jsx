import React from 'react';

export default function AdminDashboard() {
  return (
    <main>
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="dashboard">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-number">156</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Projects</div>
            <div className="stat-number">42</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-number">$125,430</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Reviews</div>
            <div className="stat-number">8</div>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-header">
            <h2>Admin Functions</h2>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2">
                <a href="#" className="btn btn-secondary">Manage Users</a>
              </li>
              <li className="mb-2">
                <a href="#" className="btn btn-secondary">View Reports</a>
              </li>
              <li className="mb-2">
                <a href="#" className="btn btn-secondary">System Settings</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
