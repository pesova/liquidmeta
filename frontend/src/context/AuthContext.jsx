// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount (if token exists)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          const fetchedUser = await authService.fetchCurrentUser();
          setUser(fetchedUser);
        }
      } catch (err) {
        console.error('Auth init failed', err);
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (data) => {
    const newUser = await authService.register(data);
    setUser(newUser);
    return newUser;
  }, []);

  const onboardVendor = useCallback(async (data) => {
    const vendorUser = await authService.onboardVendor(data);
    setUser(vendorUser);
    return vendorUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, onboardVendor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
