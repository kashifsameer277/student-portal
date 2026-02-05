import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        {user && (
          <p>
            Current role: <span className="role">{user.role}</span>
          </p>
        )}
        <div className="button-group">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
