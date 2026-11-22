import { apiClient } from './client';
import { ApiResponse, PortfolioBundleData } from '../types/api';

export async function getPortfolioBundle(): Promise<PortfolioBundleData> {
  const res = await apiClient.get<ApiResponse<PortfolioBundleData>>('/api/public/bundle');
  return res.data.data;
}

