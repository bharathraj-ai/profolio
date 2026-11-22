export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProfileData {
  id: number;
  fullName: string;
  roleTitle: string;
  tagline: string;
  introText: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  avatarUrl?: string;
  resumeUrl?: string;
}

export interface EducationData {
  id: number;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear?: number;
  endYear?: number;
  isCurrent: boolean;
  description?: string;
  sortOrder?: number;
}

export interface SkillData {
  id: number;
  name: string;
  sortOrder: number;
}

export interface SkillCategoryData {
  id: number;
  name: string;
  iconText: string;
  skills: SkillData[];
}

export interface ProjectData {
  id: number;
  name: string;
  tagline: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  isFeatured: boolean;
  sortOrder: number;
  technologies: string[];
  features: string[];
}

export interface AchievementData {
  id: number;
  placeLabel: string;
  medalType: 'gold' | 'silver' | 'other';
  title: string;
  eventName: string;
  sortOrder: number;
}

export interface CertificationData {
  id: number;
  name: string;
  issuer?: string;
  issuedYear?: number;
  certUrl?: string;
  sortOrder?: number;
}

export interface CodingProfileData {
  id: number;
  platformName: string;
  iconText: string;
  description?: string;
  profileUrl: string;
  sortOrder?: number;
}

export interface ContactMessageData {
  id: number;
  senderName: string;
  senderEmail: string;
  message: string;
  submittedAt: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
}
