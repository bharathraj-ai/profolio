import { apiClient } from './client';
import { ApiResponse, ProfileData } from '../types/api';

export async function getProfile(): Promise<ProfileData> {
  const res = await apiClient.get<ApiResponse<ProfileData>>('/api/public/profile');
  return res.data.data;
}

