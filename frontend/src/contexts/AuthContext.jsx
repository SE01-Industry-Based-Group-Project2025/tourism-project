// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8080';
  const API = `${API_BASE}/api/auth`;

  // Security: Check token expiration
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Clear auth data without touching caches or history
  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const location = useLocation();

  // Check token on mount and whenever token changes
  useEffect(() => {
    const verify = async () => {
      if (token) {
        if (isTokenExpired(token)) {
          clearAuthData();
        } else {
          await fetchAndSetUser(token);
        }
      }
      setLoading(false);
    };
    verify();
  }, [token]);

  // Check for expiration on navigation changes
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      clearAuthData();
    }
  }, [location.pathname, token]);
  // Helper: fetch /verify, set user or clear on failure
  const fetchAndSetUser = async (jwt) => {
    try {
      const res = await fetch(`${API}/verify`, {
        headers: { 
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Invalid token');
      const dto = await res.json();
      // dto: { id, email, firstName, lastName, phone, enabled, roles: [...] }
      setUser(dto);
      setToken(jwt);
      localStorage.setItem('token', jwt);
      return true;
    } catch {
      clearAuthData();
      return false;
    }
  };

  // 2) Login: POST /login, then verify
  const login = async (email, password) => {
    console.log(token)
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        // data may be {message} or plain text
        return { success: false, error: data.message || data || 'Login failed' };
      }
      // data.token should exist
      const ok = await fetchAndSetUser(data.token);
      // Get the updated user state after fetchAndSetUser completes
      return ok ? { success: true } : { success: false, error: 'Token verification failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  // 3) Register: POST /register, then verify
  const register = async (userData) => {
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || data || 'Registration failed' };
      }
      const ok = await fetchAndSetUser(data.token);
      return ok ? { success: true } : { success: false, error: 'Token verification failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };  // 4) Logout: hit endpoint and clear auth state
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore server errors during logout
    } finally {
      clearAuthData();
    }
  };

  const getAuthHeaders = () => {
    console.log('getAuthHeaders called - token:', token);
    if (!token) {
      console.warn('No token available for auth headers');
      return {
        'Content-Type': 'application/json',
      };
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isUser  = user?.roles?.includes('ROLE_USER');

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      isAdmin,
      isUser,
      login,
      register,
      logout,
      getAuthHeaders,
    }}>
      {children}
    </AuthContext.Provider>
  );
};