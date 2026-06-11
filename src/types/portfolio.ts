import type { ReactNode } from "react";

export interface Course {
  id: number;
  phase: string;
  period: string;
  status: "completed" | "upcoming";
  courses: string[];
  keySkills: string[];
  grade: string;
  gpa: number | null;
  highlights: string[];
  projects: string[];
}

export interface Achievement {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
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
  timeline: Course[];
  achievements: Achievement[];
  progressStats: {
    completedSemesters: number;
    currentSemester: number;
    totalSemesters: number;
    completedPercentage: number;
    coopTermsCompleted: number;
    totalCoopTerms: number;
    academicSemestersCompleted: number;
    totalAcademicSemesters: number;
  };
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  link: string;
}

export interface InProgressLearning {
  id: number;
  title: string;
  source: string;
  sourceUrl: string;
  sourcePlatform: string;
  progress: string;
}

export interface Social {
  title: string;
  Icon: ReactNode;
  url: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  role: string;
  location: string;
  period: string;
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
  imageUrl: string;
  tags: string[];
  thumbnailUrl: string;
  year: number;
}

export interface Hobby {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}
