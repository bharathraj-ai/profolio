import { apiClient } from './client';
import { AchievementData, ApiResponse, CertificationData } from '../types/api';

export async function getAchievements(): Promise<AchievementData[]> {
  const res = await apiClient.get<ApiResponse<AchievementData[]>>('/api/public/achievements');
  return res.data.data;
}

export async function getCertifications(): Promise<CertificationData[]> {
  const res = await apiClient.get<ApiResponse<CertificationData[]>>('/api/public/certifications');
  return res.data.data;
}

