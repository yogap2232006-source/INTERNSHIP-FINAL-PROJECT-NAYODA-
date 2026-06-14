import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/dashboard" className="navbar-brand">Nayoda</Link>
        {user && (
          <ul className="navbar-menu">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/freelancers">Freelancers</Link></li>
            <li><Link to="/projects">Contracts</Link></li>
            <li><Link to="/profile">{user?.name || user?.fullName || 'Profile'}</Link></li>
            {isAdmin && <li><Link to="/admin">Admin</Link></li>}
            <li><a href="#" className="btn-logout" onClick={handleLogout}>Logout</a></li>
          </ul>
        )}
      </div>
    </nav>
  );
}
