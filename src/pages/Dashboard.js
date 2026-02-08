import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchStudentResults, fetchAllResults } from '../services/api';

const Dashboard = () => {
  const { user, logout, changePassword, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchRollNo, setSearchRollNo] = useState('');
  
  // Admin password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  // Admin view state
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    // Auto-load user's results if they have a roll number
    const autoLoadResults = async (rollNo) => {
      setSearchRollNo(rollNo);
      setLoading(true);
      setError('');
      setSuccess('');
      setResults(null);

      try {
        const response = await fetchStudentResults(rollNo);
        
        if (response.success && response.data) {
          setResults(response.data);
          setError('');
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Error fetching results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.rollNo) {
      autoLoadResults(user.rollNo);
    }

    // Load all users if admin
    if (user && user.role === 'admin') {
      const users = getAllUsers();
      setAllUsers(users);
      
      const loadAll = async () => {
        try {
          const response = await fetchAllResults();
          if (response.success) {
            setAllResults(response.data);
          }
        } catch (err) {
          console.error('Error loading all results:', err);
        }
      };
      loadAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadAllUsers = () => {
    const users = getAllUsers();
    setAllUsers(users);
  };

  // const loadAllResults = async () => {
  //   try {
  //     const response = await fetchAllResults();
  //     if (response.success) {
  //       setAllResults(response.data);
  //     }
  //   } catch (err) {
  //     console.error('Error loading all results:', err);
  //   }
  // };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loadResults = async (rollNo = searchRollNo) => {
    if (!rollNo.trim()) {
      setError('Please enter a roll number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResults(null);

    try {
      const response = await fetchStudentResults(rollNo);
      
      if (response.success && response.data) {
        setResults(response.data);
        setError('');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadResults();
  };

  const openPasswordModal = (userToChange) => {
    setSelectedUser(userToChange);
    setNewPassword('');
    setShowPasswordModal(true);
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await changePassword(selectedUser.email, newPassword);
    
    if (result.success) {
      setSuccess(result.message);
      setShowPasswordModal(false);
      loadAllUsers(); // Refresh user list
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message);
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A': 'grade-A',
      'B': 'grade-B',
      'C': 'grade-C',
      'D': 'grade-D',
      'F': 'grade-F',
    };
    return gradeColors[grade] || 'grade-F';
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <div className="dashboard-title">
             <h1> Radiant Coaching Centre (RCC)</h1>
            <h1>🎓 Student Portal</h1>
            <p>Welcome, {user?.name}</p>
          </div>
          <div className="dashboard-user">
            <span className="user-role" style={{
              background: user?.role === 'admin' ? '#d32f2f' : '#1976d2',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 ' + user?.role}
            </span>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Welcome Card */}
        <div className="welcome-card">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>
            {user?.role === 'admin' 
              ? 'You have full access to all student records and can manage passwords.' 
              : 'Search for any student result using their roll number.'}
          </p>
        </div>

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            {success}
          </div>
        )}

        {/* Admin Tabs */}
        {user?.role === 'admin' && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e0e0e0', marginBottom: '20px' }}>
              <button
                onClick={() => setActiveTab('search')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'search' ? '#1976d2' : 'transparent',
                  color: activeTab === 'search' ? 'white' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'search' ? '3px solid #1976d2' : 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔍 Search Results
              </button>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'all' ? '#1976d2' : 'transparent',
                  color: activeTab === 'all' ? 'white' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'all' ? '3px solid #1976d2' : 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📊 All Results
              </button>
              <button
                onClick={() => setActiveTab('users')}
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'users' ? '#1976d2' : 'transparent',
                  color: activeTab === 'users' ? 'white' : '#666',
                  border: 'none',
                  borderBottom: activeTab === 'users' ? '3px solid #1976d2' : 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                👥 Manage Users
              </button>
            </div>
          </div>
        )}

        {/* User Info Card (for students) */}
        {user?.role !== 'admin' && (
          <div className="card">
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Your Account Information</h3>
            <div className="student-info-grid">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Class</span>
                <span className="info-value">{user?.class}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Roll Number</span>
                <span className="info-value">{user?.rollNo}</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Section - shown for all users and when admin selects 'search' tab */}
        {(user?.role !== 'admin' || activeTab === 'search') && (
          <>
            <div className="search-section">
              <h3>Search Student Results</h3>
              <form onSubmit={handleSearchSubmit} style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Enter Roll Number
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={searchRollNo}
                      onChange={(e) => setSearchRollNo(e.target.value)}
                      placeholder="e.g., 2024-001"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="btn-search"
                    disabled={loading}
                    style={{ height: '45px' }}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="alert alert-error" style={{ marginTop: '15px' }}>
                  {error}
                </div>
              )}

              <div className="info-box" style={{ marginTop: '20px' }}>
                <p>🔓 Open Access:</p>
                <div style={{ fontSize: '13px', color: '#1976d2', marginTop: '5px' }}>
                  Any registered student can search for results using any roll number.
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div>
                {/* Student Info */}
                <div className="student-info">
                  <h3>Student Information</h3>
                  <div className="student-info-grid">
                    <div className="info-item">
                      <span className="info-label">Roll Number</span>
                      <span className="info-value">{results.rollNo}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Student Name</span>
                      <span className="info-value">{results.studentName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Class</span>
                      <span className="info-value">{results.class}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Father's Name</span>
                      <span className="info-value">{results.fatherName}</span>
                    </div>
                  </div>
                </div>

                {/* Results Table */}
                <div className="results-table-container">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Total Marks</th>
                        <th>Obtained Marks</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.subjects.map((subject, index) => (
                        <tr key={index}>
                          <td>{subject.name}</td>
                          <td>{subject.total}</td>
                          <td>{subject.obtained}</td>
                          <td>{subject.percentage}%</td>
                          <td>
                            <span className={`grade-badge ${getGradeColor(subject.grade)}`}>
                              {subject.grade}
                            </span>
                          </td>
                          <td>{subject.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Admin: All Results View */}
        {user?.role === 'admin' && activeTab === 'all' && (
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>All Student Results</h3>
            {allResults.map((studentResult, idx) => (
              <div key={idx} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0 }}>{studentResult.studentName} - {studentResult.rollNo}</h4>
                  <span style={{ color: '#666', fontSize: '14px' }}>{studentResult.class}</span>
                </div>
                <div className="results-table-container">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Total</th>
                        <th>Obtained</th>
                        <th>%</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentResult.subjects.map((subject, index) => (
                        <tr key={index}>
                          <td>{subject.name}</td>
                          <td>{subject.total}</td>
                          <td>{subject.obtained}</td>
                          <td>{subject.percentage}%</td>
                          <td>
                            <span className={`grade-badge ${getGradeColor(subject.grade)}`}>
                              {subject.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admin: User Management */}
        {user?.role === 'admin' && activeTab === 'users' && (
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>User Management</h3>
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((userData, index) => (
                    <tr key={index}>
                      <td>{userData.name}</td>
                      <td>{userData.email}</td>
                      <td>{userData.rollNo}</td>
                      <td>{userData.class}</td>
                      <td>
                        <span style={{
                          background: userData.role === 'admin' ? '#d32f2f' : '#1976d2',
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {userData.role}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => openPasswordModal(userData)}
                          style={{
                            background: '#ff9800',
                            color: 'white',
                            border: 'none',
                            padding: '5px 15px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          🔑 Change Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading && (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '20px', color: '#666' }}>Loading...</p>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginTop: 0 }}>Change Password</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              User: <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
            </p>
            
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
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
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginTop: '15px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handlePasswordChange}
                style={{
                  flex: 1,
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setError('');
                }}
                style={{
                  flex: 1,
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
