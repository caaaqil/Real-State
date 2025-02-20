import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    try {
      // Clear all session data
      localStorage.clear();
      // Force redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback logout method
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const linkStyle = {
    transition: 'all 0.2s ease-in-out',
    fontSize: '0.95rem',
    letterSpacing: '0.3px'
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.color = '#ffffff';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-building me-2"></i>
          Haldoor Real Estate
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item px-1">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
                style={linkStyle}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <i className="bi bi-house-door me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item px-1">
              <Link 
                className={`nav-link ${location.pathname === '/all-properties' ? 'active' : ''}`}
                to="/all-properties"
                style={linkStyle}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <i className="bi bi-grid me-1"></i>
                All Properties
              </Link>
            </li>
            <li className="nav-item px-1">
              <Link 
                className={`nav-link ${location.pathname === '/properties' ? 'active' : ''}`}
                to="/properties"
                style={linkStyle}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <i className="bi bi-gear me-1"></i>
                Manage Properties
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item px-1">
                <Link 
                  className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
                  to="/users"
                  style={linkStyle}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <i className="bi bi-people me-1"></i>
                  Users
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item px-1">
              {/* <button 
                onClick={() => navigate('/change-password')}
                className="btn btn-link nav-link d-flex align-items-center"
                style={{ 
                  ...linkStyle,
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer'
                }}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <i className="bi bi-key me-1"></i>
                Change Password
              </button> */}
            </li>
            <li className="nav-item px-1">
              <button 
                onClick={handleLogout}
                className="btn btn-link nav-link d-flex align-items-center"
                style={{ 
                  ...linkStyle,
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer'
                }}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 