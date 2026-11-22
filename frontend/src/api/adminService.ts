import { apiClient } from './client';
import {
  AchievementData,
  ApiResponse,
  CertificationData,
  CodingProfileData,
  ContactMessageData,
  EducationData,
  ProfileData,
  ProjectData,
  SkillCategoryData,
  SkillData
} from '../types/api';

export const adminService = {
  // File Upload
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<string>>('/api/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async uploadAvatar(file: File): Promise<ProfileData> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<ProfileData>>('/api/admin/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  // Profile
  async getProfile(): Promise<ProfileData> {
    const res = await apiClient.get<ApiResponse<ProfileData>>('/api/admin/profile');
    return res.data.data;
  },

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    const res = await apiClient.put<ApiResponse<ProfileData>>('/api/admin/profile', data);
    return res.data.data;
  },

  // Education
  async getEducation(): Promise<EducationData[]> {
    const res = await apiClient.get<ApiResponse<EducationData[]>>('/api/admin/education');
    return res.data.data;
  },

  async createEducation(data: Partial<EducationData>): Promise<EducationData> {
    const res = await apiClient.post<ApiResponse<EducationData>>('/api/admin/education', data);
    return res.data.data;
  },

  async updateEducation(id: number, data: Partial<EducationData>): Promise<EducationData> {
    const res = await apiClient.put<ApiResponse<EducationData>>(`/api/admin/education/${id}`, data);
    return res.data.data;
  },

  async deleteEducation(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/admin/education/${id}`);
  },

  // Skills
  async getSkills(): Promise<SkillCategoryData[]> {
    const res = await apiClient.get<ApiResponse<SkillCategoryData[]>>('/api/admin/skills');
    return res.data.data;
  },

  async createSkillCategory(data: { name: string; iconText?: string; sortOrder?: number }): Promise<SkillCategoryData> {
    const res = await apiClient.post<ApiResponse<SkillCategoryData>>('/api/admin/skills/categories', data);
    return res.data.data;
  },

  async updateSkillCategory(id: number, data: { name: string; iconText?: string; sortOrder?: number }): Promise<SkillCategoryData> {
    const res = await apiClient.put<ApiResponse<SkillCategoryData>>(`/api/admin/skills/categories/${id}`, data);
    return res.data.data;
  },

  async deleteSkillCategory(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/admin/skills/categories/${id}`);
  },

  async createSkill(data: { name: string; categoryId: number; sortOrder?: number }): Promise<SkillData> {
    const res = await apiClient.post<ApiResponse<SkillData>>('/api/admin/skills', data);
    return res.data.data;
  },

  async updateSkill(id: number, data: { name: string; categoryId?: number; sortOrder?: number }): Promise<SkillData> {
    const res = await apiClient.put<ApiResponse<SkillData>>(`/api/admin/skills/${id}`, data);
    return res.data.data;
  },

  async deleteSkill(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/admin/skills/${id}`);
  },

  // Projects
  async getProjects(): Promise<ProjectData[]> {
    const res = await apiClient.get<ApiResponse<ProjectData[]>>('/api/admin/projects');
    return res.data.data;
  },

  async createProject(data: Partial<ProjectData>): Promise<ProjectData> {
    const res = await apiClient.post<ApiResponse<ProjectData>>('/api/admin/projects', data);
    return res.data.data;
  },

  async updateProject(id: number, data: Partial<ProjectData>): Promise<ProjectData> {
    const res = await apiClient.put<ApiResponse<ProjectData>>(`/api/admin/projects/${id}`, data);
    return res.data.data;
  },

  async deleteProject(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/admin/projects/${id}`);
  },

  // Achievements
  async getAchievements(): Promise<AchievementData[]> {
    const res = await apiClient.get<ApiResponse<AchievementData[]>>('/api/admin/achievements');
    return res.data.data;
  },

  async createAchievement(data: Partial<AchievementData>): Promise<AchievementData> {
    const res = await apiClient.post<ApiResponse<AchievementData>>('/api/admin/achievements', data);
    return res.data.data;
  },

  async updateAchievement(id: number, data: Partial<AchievementData>): Promise<AchievementData> {
    const res = await apiClient.put<ApiResponse<AchievementData>>(`/api/admin/achievements/${id}`, data);
    return res.data.data;
  },

  async deleteAchievement(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/admin/achievements/${id}`);
  },

  // Certifications
  async getCertifications(): Promise<CertificationData[]> {
    const res = await apiClient.get<ApiResponse<CertificationData[]>>('/api/admin/certifications');
    return res.data.data;
  },

  async createCertification(data: Partial<CertificationData>): Promise<CertificationData> {
    const res = await apiClient.post<ApiResponse<CertificationData>>('/api/admin/certifications', data);
    return res.data.data;
  },

  async updateCertification(id: number, data: Partial<CertificationData>): Promise<CertificationData> {
    const res = await apiClient.put<ApiResponse<CertificationData>>(`/api/admin/certifications/${id}`, data);
    return res.data.data;
  },

  async deleteCertification(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/admin/certifications/${id}`);
  },

  // Coding Profiles
  async getCodingProfiles(): Promise<CodingProfileData[]> {
    const res = await apiClient.get<ApiResponse<CodingProfileData[]>>('/api/admin/coding-profiles');
    return res.data.data;
  },

  async createCodingProfile(data: Partial<CodingProfileData>): Promise<CodingProfileData> {
    const res = await apiClient.post<ApiResponse<CodingProfileData>>('/api/admin/coding-profiles', data);
    return res.data.data;
  },

  async updateCodingProfile(id: number, data: Partial<CodingProfileData>): Promise<CodingProfileData> {
    const res = await apiClient.put<ApiResponse<CodingProfileData>>(`/api/admin/coding-profiles/${id}`, data);
    return res.data.data;
  },

  async deleteCodingProfile(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/api/admin/coding-profiles/${id}`);
  },

  // Messages
  async getMessages(status?: string): Promise<ContactMessageData[]> {
    const url = status ? `/api/admin/messages?status=${status}` : '/api/admin/messages';
    const res = await apiClient.get<ApiResponse<ContactMessageData[]>>(url);
    return res.data.data;
  },

  async updateMessageStatus(id: number, status: string): Promise<ContactMessageData> {
    const res = await apiClient.put<ApiResponse<ContactMessageData>>(`/api/admin/messages/${id}/status`, { status });
    return res.data.data;
  }
};
