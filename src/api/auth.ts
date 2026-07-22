import axiosInstance from './axios';
import type { AdminUser } from '../types';

export interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  refreshToken: string;
  user: AdminUser;
  role: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
  return data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await axiosInstance.post('/auth/logout', { refreshToken });
};
