import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    class: '',
    email: '',
    password: '',
    rollNo: '',
    role: 'student',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup, loginWithGoogle, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if passwords match
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    const result = await signup(formData);
    
    if (result.success) {
      setSuccess(result.message + ' Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    // Simulate Google OAuth (in real app, this would use Google OAuth)
    const googleEmail = prompt('Enter your Google email:');
    
    if (googleEmail) {
      const googleName = prompt('Enter your name:') || 'Google User';
      
      const result = await loginWithGoogle({
        email: googleEmail,
        name: googleName,
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '700px' }}>
        <div className="auth-header">
        <h1> Radiant coaching Centre (RCC)</h1>
          <h1>🎓 Student Portal</h1>
          <p>Create your account</p>
        </div>

        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  className="form-input"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  placeholder="Enter father's name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Class *</label>
                <input
                  type="text"
                  name="class"
                  className="form-input"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 10th Grade"
                />
              </div>

              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  name="rollNo"
                  className="form-input"
                  value={formData.rollNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2024-001"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Create a password (min 6 characters)"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666',
                    padding: '5px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  placeholder="Re-enter your password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666',
                    padding: '5px'
                  }}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '20px 0',
            gap: '10px'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
            <span style={{ color: '#666', fontSize: '14px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'white',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="toggle-link" style={{ marginTop: '20px' }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>

          <div className="info-box" style={{ marginTop: '20px' }}>
            <p style={{ color: '#1565c0', fontSize: '13px' }}>
              ℹ️ All students can view any result using roll number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
