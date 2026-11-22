import { apiClient } from './client';
import { ApiResponse } from '../types/api';

export interface AuthStatus {
  authenticated: boolean;
  email: string | null;
}

export interface LoginResult {
  token: string;
  email: string;
  message: string;
}

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<LoginResult | string>> {
    const res = await apiClient.post<ApiResponse<LoginResult | string>>('/api/auth/login', {
      email,
      password,
    });
    if (res.data.success && res.data.data) {
      if (typeof res.data.data === 'object' && 'token' in res.data.data) {
        localStorage.setItem('admin_token', res.data.data.token);
      }
    }
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
    } finally {
      localStorage.removeItem('admin_token');
    }
  },
};
