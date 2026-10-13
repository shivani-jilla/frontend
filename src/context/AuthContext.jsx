import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('learnhub_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session verification failed, logging out', err);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const getErrorMessage = (err, fallback) => {
    if (err.response?.data?.details) {
      const details = err.response.data.details;
      if (typeof details === 'object') {
        const first = Object.values(details)[0];
        if (first) return first;
      }
    }
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err.code === 'ERR_NETWORK' || !err.response) {
      return 'Unable to reach backend server. Please verify the API is running and reachable.';
    }
    return fallback;
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      addToast(`Welcome back, ${data.user.name}!`, 'success');
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Login failed. Please check your credentials.');
      addToast(errorMsg, 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);
      addToast('Registration successful! Welcome to LearnHub.', 'success');
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Registration failed. Please check your input.');
      addToast(errorMsg, 'error');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    addToast('You have been logged out safely.', 'info');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    addToast,
    showToast: addToast,
    removeToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Toast Notification Floating Area */}
      <div className="toast-floating-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert alert-${
              toast.type === 'error'
                ? 'danger'
                : toast.type === 'success'
                ? 'success'
                : toast.type === 'warning'
                ? 'warning'
                : 'primary'
            } alert-dismissible fade show shadow-lg d-flex align-items-center mb-0`}
            role="alert"
            style={{ minWidth: '320px', borderRadius: '12px' }}
          >
            <i
              className={`bi ${
                toast.type === 'success'
                  ? 'bi-check-circle-fill text-success'
                  : toast.type === 'error'
                  ? 'bi-exclamation-triangle-fill text-danger'
                  : 'bi-info-circle-fill text-primary'
              } me-2 fs-5`}
            ></i>
            <div className="flex-grow-1 fw-medium">{toast.message}</div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
