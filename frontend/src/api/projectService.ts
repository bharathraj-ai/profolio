import { apiClient } from './client';
import { ApiResponse, ProjectData } from '../types/api';

export async function getProjects(): Promise<ProjectData[]> {
  const res = await apiClient.get<ApiResponse<ProjectData[]>>('/api/public/projects');
  return res.data.data;
}

