// src/hooks/useSecurityMonitor.js
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useSecurityMonitor = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const lastActivity = useRef(Date.now());
  const inactivityTimer = useRef(null);

  useEffect(() => {
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const resetInactivityTimer = () => {
      lastActivity.current = Date.now();
      
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      if (isAuthenticated) {
        inactivityTimer.current = setTimeout(() => {
          // Auto-logout after inactivity
          logout();
        }, INACTIVITY_TIMEOUT);
      }
    };

    const handleActivity = () => {
      resetInactivityTimer();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - record time
        lastActivity.current = Date.now();
      } else {
        // Tab is visible again - check if auth is still valid
        if (isAuthenticated) {
          const timeSinceHidden = Date.now() - lastActivity.current;
          if (timeSinceHidden > INACTIVITY_TIMEOUT) {
            logout();
          }
        }
      }
    };    const handleStorageChange = (event) => {
      // Monitor localStorage changes from other tabs
      if (event.key === 'token' && !event.newValue && isAuthenticated) {
        // Token was removed in another tab - logout this tab too
        window.location.replace('/login');
      }
    };

    const handleBroadcastMessage = (event) => {
      // Handle messages from other tabs
      if (event.data && event.data.type === 'FORCE_LOGOUT') {
        window.location.replace('/login');
      }
    };

    const handleFocus = () => {
      // When window gets focus, verify auth is still valid
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.replace('/login');
        }
      }
    };

    const handleBeforeUnload = () => {
      // Clean up timers and resources
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };    // Add event listeners for security monitoring
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Set up broadcast channel for cross-tab communication
    const channel = new BroadcastChannel('auth_channel');
    channel.addEventListener('message', handleBroadcastMessage);

    // Initialize timer
    resetInactivityTimer();

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (channel) {
        channel.removeEventListener('message', handleBroadcastMessage);
        channel.close();
      }
      
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [isAuthenticated, logout]);

  return null;
};
