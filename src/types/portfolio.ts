import type { ReactNode } from "react";

export interface Achievement {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
}

export interface Education {
  institution: {
    name: string;
    location: string;
    logo: string;
    website: string;
  };
  program: {
    title: string;
    type: string;
    duration: string;
    gpa: string;
    status: string;
    totalSemesters: number;
    completedSemesters: number;
  };
  description: string;
  achievements: Achievement[];
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  /** Verification URL. Omit when no public credential link exists. */
  link?: string;
}

export interface InProgressLearning {
  id: number;
  title: string;
  source: string;
  sourceUrl: string;
  sourcePlatform: string;
  /** Whole-number percentage, 0-100. */
  progress: number;
}

export interface Social {
  title: string;
  Icon: ReactNode;
  url: string;
}

export interface ExperienceHighlight {
  title: string;
  text: string;
  stack?: string[];
}

export interface WorkExperience {
  id: number;
  company: string;
  /** One-line description of the employer, shown under the company name. */
  companyNote?: string;
  companyUrl?: string;
  role: string;
  location: string;
  period: string;
  /** Short paragraph introducing the role. */
  summary?: string;
  /** Named accomplishments, rendered as a grid of cards. */
  highlights?: ExperienceHighlight[];
  /** Plain bullet points. */
  description: string[];
  skills: string[];
  isCurrent?: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  tags: string[];
  contentUrl?: string;
  completionDate: string;
  setup: string[];
  /** Larger preview image shown in the project modal. Falls back to imageUrl. */
  webUrl?: string;
  learnings?: string[];
  impact?: string;
  keyFeatures?: string[];
  challenges?: string;
  platform?: string;
  liveAppUrl?: string;
  isMobileApp?: boolean;
  screenshots?: string[];
}

export interface Skill {
  id: number;
  title: string;
  tags: string[];
  color: string;
}

export interface CollageProject {
  id: number;
  title: string;
  description: string;
  /** Video demo path. */
  imageUrl: string;
  tags: string[];
  thumbnailUrl: string;
  year: number;
}

export interface Hobby {
  id: number;
  title: string;
  description: string;
}
