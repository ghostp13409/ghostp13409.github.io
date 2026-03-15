export interface Institution {
  name: string;
  location: string;
  logo: string;
  website: string;
}

export interface Program {
  title: string;
  type: string;
  duration: string;
  gpa: string;
  status: string;
  totalSemesters: number;
  completedSemesters: number;
  description: string;
}

export interface TimelineEntry {
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

export interface ProgressStats {
  completedSemesters: number;
  currentSemester: number;
  totalSemesters: number;
  completedPercentage: number;
  academicSemestersCompleted: number;
  totalAcademicSemesters: number;
}

export interface EducationData {
  institution: Institution;
  program: Program;
  timeline: TimelineEntry[];
  achievements: Achievement[];
  progressStats: ProgressStats;
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
  iconName: string; 
  url: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string; // Optional image
  videoUrl?: string; // Optional video
  tags: string[];
  contentUrl?: string;
  completionDate: string;
  setup?: string[];
  webUrl?: string;
  thumbnailUrl?: string; 
  challenges?: string[];
  learnings?: string[];
  impact?: string; 
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

export interface SkillCategory {
  id: number;
  title: string;
  tags: string[];
  color: string;
}

export interface Hobby {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}

export interface DSAPlatform {
  name: string;
  url: string;
  logo: string;
}
