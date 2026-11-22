import { apiClient } from './client';
import { ApiResponse, CodingProfileData } from '../types/api';

export async function getCodingProfiles(): Promise<CodingProfileData[]> {
  const res = await apiClient.get<ApiResponse<CodingProfileData[]>>('/api/public/coding-profiles');
  return res.data.data;
}

