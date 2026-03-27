// src/services/authService.js
import apiClient from '../utils/apiClient';

const extractTokenAndUser = (payload) => {
  // Backend commonly responds with: { success, message, data: { token, user } }
  const token = payload?.data?.access_token ?? null;
  const user = payload?.data?.user ?? payload?.user ?? null;
  return { token, user };
};

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') return user;
  const role =
    user.role ??
    user.roleName ??
    user.roleId?.name ??
    user.role?.name ??
    'user';
  return { ...user, role };
};

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  const { token, user } = extractTokenAndUser(response.data);  
  if (token) localStorage.setItem('accessToken', token);
  return normalizeUser(user);
};

export const register = async (registerData) => {
  const response = await apiClient.post('/auth/register', registerData);
  const { token, user } = extractTokenAndUser(response.data);
  if (token) localStorage.setItem('accessToken', token);
  return normalizeUser(user);
};

export const onboardVendor = async (vendorData) => {
  const response = await apiClient.post('/vendors/onboard', vendorData);
  const { token, user } = extractTokenAndUser(response.data);
  if (token) localStorage.setItem('accessToken', token);
  return normalizeUser(user);
};

export const logout = async () => {
  // If backend supports token revocation, call endpoint
  await apiClient.post('/auth/logout');
  localStorage.removeItem('accessToken');
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/auth/profile');
  const user = response.data?.data?.user ?? response.data?.user ?? response.data?.data ?? response.data;
  return normalizeUser(user);
};
