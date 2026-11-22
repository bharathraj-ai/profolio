import { apiClient } from './client';
import { ApiResponse } from '../types/api';

export interface AuthStatus {
  authenticated: boolean;
  email: string | null;
}

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<string>> {
    const res = await apiClient.post<ApiResponse<string>>('/api/auth/login', {
      email,
      password,
    });
    return res.data;
  },

  async checkStatus(): Promise<AuthStatus> {
    try {
      const res = await apiClient.get<ApiResponse<AuthStatus>>('/api/auth/status');
      return res.data.data;
    } catch {
      return { authenticated: false, email: null };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
  },
};

