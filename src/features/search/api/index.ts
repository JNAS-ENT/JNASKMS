import { SearchResultItem } from '../types';
import { Note, ResearchPaper, YouTubeAnalysis, JournalEntry } from '../../../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchApi = {
  queryIndex: async (query: string, filterType: string = 'all'): Promise<SearchResultItem[]> => {
    await sleep(300);
    const results: SearchResultItem[] = [];
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return [];

    // Notes
    if (filterType === 'all' || filterType === 'note') {
      const notes: Note[] = JSON.parse(localStorage.getItem('ent_notes') || '[]');
      notes.forEach(n => {
        if (n.title.toLowerCase().includes(lowerQuery) || n.content.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: n.id,
            type: 'note',
            title: n.title,
            snippet: n.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
            categoryOrChannel: n.category,
            date: n.updatedAt
          });
        }
      });
    }

    // Research Papers
    if (filterType === 'all' || filterType === 'paper') {
      const papers: ResearchPaper[] = JSON.parse(localStorage.getItem('ent_papers') || '[]');
      papers.forEach(p => {
        if (p.title.toLowerCase().includes(lowerQuery) || p.abstract.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: p.id,
            type: 'paper',
            title: p.title,
            snippet: p.abstract.substring(0, 150) + '...',
            categoryOrChannel: p.journal,
            date: p.createdAt
          });
        }
      });
    }

    // YouTube Video Extractions
    if (filterType === 'all' || filterType === 'youtube') {
      const yt: YouTubeAnalysis[] = JSON.parse(localStorage.getItem('ent_yt') || '[]');
      yt.forEach(y => {
        if (y.title.toLowerCase().includes(lowerQuery) || y.summary.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: y.id,
            type: 'youtube',
            title: y.title,
            snippet: y.summary.substring(0, 150) + '...',
            categoryOrChannel: y.channelName,
            date: y.createdAt
          });
        }
      });
    }

    // Journals
    if (filterType === 'all' || filterType === 'journal') {
      const journal: JournalEntry[] = JSON.parse(localStorage.getItem('ent_journal') || '[]');
      journal.forEach(j => {
        if (j.title.toLowerCase().includes(lowerQuery) || j.content.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: j.id,
            type: 'journal',
            title: j.title,
            snippet: j.content.substring(0, 150) + '...',
            categoryOrChannel: `Mood: ${j.mood}`,
            date: j.createdAt
          });
        }
      });
    }

    return results;
  }
};
