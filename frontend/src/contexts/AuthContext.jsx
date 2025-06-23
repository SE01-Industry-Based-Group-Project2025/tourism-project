// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const API = 'http://localhost:8080/api/auth';

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

  // Security: Clear all auth data
  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // Also clear any other sensitive data
    localStorage.removeItem('user');
    sessionStorage.clear();
  };

  // 1) On mount, if token exists, verify it to get full user DTO
  useEffect(() => {
    (async () => {
      if (token) {
        // Check if token is expired before making API call
        if (isTokenExpired(token)) {
          clearAuthData();
        } else {
          await fetchAndSetUser(token);
        }
      }
      setLoading(false);
    })();
  }, [token]); // Include token in dependency array for security

  // Security: Auto-logout on token expiration
  useEffect(() => {
    if (token && !loading) {
      const checkTokenExpiration = () => {
        if (isTokenExpired(token)) {
          logout();
        }
      };

      // Check every minute
      const interval = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [token, loading]);
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
  };  // 4) Logout: hit endpoint, then clear and redirect with maximum security
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
      // Clear all authentication data
      clearAuthData();
      
      // Security: Clear all possible storage locations
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear IndexedDB if available
      if ('indexedDB' in window) {
        try {
          const dbs = await indexedDB.databases();
          dbs.forEach(db => indexedDB.deleteDatabase(db.name));
        } catch (e) {
          // ignore errors
        }
      }
      
      // Security: Clear browser cache and all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      // Clear service worker registration if any
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.unregister());
        });
      }
      
      // Clear navigation history completely
      const numEntries = window.history.length;
      for (let i = 0; i < numEntries - 1; i++) {
        window.history.back();
      }
      window.history.replaceState(null, '', '/login');
      
      // Broadcast logout to other tabs
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({ type: 'FORCE_LOGOUT' });
      channel.close();
      
      // Force complete page reload to ensure all state is cleared
      window.location.replace('/login');
    }
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

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