import { DashboardMetrics, ActivityItem } from '../types';
import { Note, ResearchPaper, YouTubeAnalysis, JournalEntry, Project } from '../../../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    await sleep(300);
    const notes: Note[] = JSON.parse(localStorage.getItem('ent_notes') || '[]');
    const papers: ResearchPaper[] = JSON.parse(localStorage.getItem('ent_papers') || '[]');
    const yt: YouTubeAnalysis[] = JSON.parse(localStorage.getItem('ent_yt') || '[]');
    const journal: JournalEntry[] = JSON.parse(localStorage.getItem('ent_journal') || '[]');
    const projects: Project[] = JSON.parse(localStorage.getItem('ent_projects') || '[]');

    let completed = 0;
    projects.forEach(p => {
      p.tasks.forEach(t => {
        if (t.status === 'completed') completed++;
      });
    });

    const sumProd = journal.reduce((sum, j) => sum + j.productivityRating, 0);
    const avgProd = journal.length > 0 ? Number((sumProd / journal.length).toFixed(1)) : 0;

    return {
      totalNotes: notes.length,
      totalPapers: papers.length,
      totalAnalyses: yt.length,
      totalProjects: projects.length,
      completedTasks: completed,
      totalJournalEntries: journal.length,
      productivityAverage: avgProd
    };
  },

  getRecentActivity: async (): Promise<ActivityItem[]> => {
    await sleep(200);
    // Combine logs dynamically
    const notes: Note[] = JSON.parse(localStorage.getItem('ent_notes') || '[]');
    const papers: ResearchPaper[] = JSON.parse(localStorage.getItem('ent_papers') || '[]');
    const yt: YouTubeAnalysis[] = JSON.parse(localStorage.getItem('ent_yt') || '[]');
    const journal: JournalEntry[] = JSON.parse(localStorage.getItem('ent_journal') || '[]');

    const activities: ActivityItem[] = [];

    notes.slice(0, 3).forEach(n => {
      activities.push({
        id: `act-${n.id}`,
        type: 'note',
        action: 'Updated file asset',
        title: n.title,
        timestamp: n.updatedAt
      });
    });

    papers.slice(0, 3).forEach(p => {
      activities.push({
        id: `act-${p.id}`,
        type: 'paper',
        action: `Began reading (${p.status})`,
        title: p.title,
        timestamp: p.createdAt
      });
    });

    yt.slice(0, 3).forEach(y => {
      activities.push({
        id: `act-${y.id}`,
        type: 'youtube',
        action: 'Extracted semantic core',
        title: y.title,
        timestamp: y.createdAt
      });
    });

    journal.slice(0, 3).forEach(j => {
      activities.push({
        id: `act-${j.id}`,
        type: 'journal',
        action: 'Logged focus reflection',
        title: j.title,
        timestamp: j.createdAt
      });
    });

    // Sort by descending timestamp
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
  }
};
