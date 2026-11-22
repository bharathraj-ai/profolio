import { apiClient } from './client';
import { ApiResponse, ContactMessageData } from '../types/api';

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export async function submitContact(input: ContactFormInput): Promise<ContactMessageData> {
  const res = await apiClient.post<ApiResponse<ContactMessageData>>('/api/public/contact', input);
  return res.data.data;
}

