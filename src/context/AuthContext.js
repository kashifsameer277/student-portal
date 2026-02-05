import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Your admin email - change this to your email
const ADMIN_EMAIL = 'admin@studentportal.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Always ensure admin account exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if admin already exists
      const adminExists = existingUsers.some(u => u.email === ADMIN_EMAIL);
      
      if (!adminExists) {
        // Create default admin account
        const defaultAdmin = {
          id: 'admin-default',
          name: 'Admin User',
          fatherName: 'System',
          class: 'Administration',
          email: ADMIN_EMAIL,
          password: 'admin123',
          rollNo: 'ADMIN-001',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        existingUsers.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        console.log('Admin account created successfully!');
      }

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        // Check if user is admin
        if (parsedUser.email === ADMIN_EMAIL) {
          parsedUser.role = 'admin';
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      const emailExists = existingUsers.some(u => u.email === userData.email);
      if (emailExists) {
        return { success: false, message: 'Email already registered!' };
      }

      // Determine role - admin if email matches, otherwise student
      let userRole = 'student';
      if (userData.email === ADMIN_EMAIL) {
        userRole = 'admin';
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: userRole,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Error creating account' };
    }
  };

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user
      const foundUser = users.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        // Check if user is admin
        if (foundUser.email === ADMIN_EMAIL) {
          foundUser.role = 'admin';
        }
        
        // Create token
        const token = btoa(`${foundUser.id}:${Date.now()}`);
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(foundUser));
        
        setUser(foundUser);
        return { success: true };
      }
      
      return { success: false, message: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error logging in' };
    }
  };

  const loginWithGoogle = async (googleUser) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      let foundUser = users.find(u => u.email === googleUser.email);
      
      if (!foundUser) {
        // Auto-register Google user
        const newUser = {
          id: `google-${Date.now()}`,
          name: googleUser.name,
          fatherName: 'Google User',
          class: 'Not Specified',
          email: googleUser.email,
          password: `google-${googleUser.email}`, // Google users don't need password
          rollNo: `GOOGLE-${users.length + 1}`,
          role: googleUser.email === ADMIN_EMAIL ? 'admin' : 'student',
          createdAt: new Date().toISOString(),
          isGoogleUser: true,
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        foundUser = newUser;
      }
      
      // Check if user is admin
      if (foundUser.email === ADMIN_EMAIL) {
        foundUser.role = 'admin';
      }
      
      // Create token
      const token = btoa(`${foundUser.id}:${Date.now()}`);
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      setUser(foundUser);
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: 'Error logging in with Google' };
    }
  };

  const changePassword = async (targetEmail, newPassword) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const userIndex = users.findIndex(u => u.email === targetEmail);
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, message: 'Password changed successfully!' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Error changing password' };
    }
  };

  const getAllUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        signup,
        logout,
        changePassword,
        getAllUsers,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
