import { apiClient } from './client';
import { ApiResponse, SkillCategoryData } from '../types/api';

export async function getSkills(): Promise<SkillCategoryData[]> {
  const res = await apiClient.get<ApiResponse<SkillCategoryData[]>>('/api/public/skills');
  return res.data.data;
}

