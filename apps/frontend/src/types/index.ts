/**
 * Enterprise Common Data Models
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user' | 'editor';
  avatarUrl?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // TipTap JSON or HTML string
  category: string;
  tags: string[];
  updatedAt: string;
  createdAt: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  publishYear: number;
  pdfUrl?: string;
  doi?: string;
  status: 'to-read' | 'reading' | 'completed';
  tags: string[];
  summary?: string;
  createdAt: string;
}

export interface YouTubeAnalysis {
  id: string;
  videoUrl: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  duration: string;
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  transcript?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'excellent' | 'good' | 'neutral' | 'anxious' | 'tired';
  productivityRating: number; // 1-5
  tags: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfig {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
  aiModelPreference: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  enterpriseApiKey?: string;
}
