import { apiClient } from './client';
import { ApiResponse, EducationData } from '../types/api';

export async function getEducation(): Promise<EducationData[]> {
  const res = await apiClient.get<ApiResponse<EducationData[]>>('/api/public/education');
  return res.data.data;
}

