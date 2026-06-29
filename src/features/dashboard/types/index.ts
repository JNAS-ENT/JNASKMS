export interface DashboardMetrics {
  totalNotes: number;
  totalPapers: number;
  totalAnalyses: number;
  totalProjects: number;
  completedTasks: number;
  totalJournalEntries: number;
  productivityAverage: number;
}

export interface ActivityItem {
  id: string;
  type: 'note' | 'paper' | 'youtube' | 'journal' | 'task';
  action: string;
  title: string;
  timestamp: string;
}
