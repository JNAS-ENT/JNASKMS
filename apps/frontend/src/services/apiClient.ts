import { Note, ResearchPaper, YouTubeAnalysis, ChatMessage, JournalEntry, Project } from '../types';

/**
 * Enterprise Simulated API Service
 * Mocking a real backend controller with standard REST patterns and network delay.
 */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  // Notes API
  notes: {
    getAll: async (): Promise<Note[]> => {
      await sleep(400);
      return JSON.parse(localStorage.getItem('ent_notes') || '[]');
    },
    create: async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
      await sleep(500);
      const list = JSON.parse(localStorage.getItem('ent_notes') || '[]');
      const newNote: Note = {
        ...note,
        id: `n-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('ent_notes', JSON.stringify([newNote, ...list]));
      return newNote;
    },
    update: async (id: string, note: Partial<Note>): Promise<Note> => {
      await sleep(300);
      const list = JSON.parse(localStorage.getItem('ent_notes') || '[]');
      let updatedNote!: Note;
      const newList = list.map((item: Note) => {
        if (item.id === id) {
          updatedNote = { ...item, ...note, updatedAt: new Date().toISOString() };
          return updatedNote;
        }
        return item;
      });
      localStorage.setItem('ent_notes', JSON.stringify(newList));
      return updatedNote;
    },
    delete: async (id: string): Promise<boolean> => {
      await sleep(300);
      const list = JSON.parse(localStorage.getItem('ent_notes') || '[]');
      localStorage.setItem('ent_notes', JSON.stringify(list.filter((item: Note) => item.id !== id)));
      return true;
    }
  },

  // Research Papers API
  papers: {
    getAll: async (): Promise<ResearchPaper[]> => {
      await sleep(500);
      return JSON.parse(localStorage.getItem('ent_papers') || '[]');
    },
    create: async (paper: Omit<ResearchPaper, 'id' | 'createdAt'>): Promise<ResearchPaper> => {
      await sleep(600);
      const list = JSON.parse(localStorage.getItem('ent_papers') || '[]');
      const newPaper: ResearchPaper = {
        ...paper,
        id: `p-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ent_papers', JSON.stringify([newPaper, ...list]));
      return newPaper;
    },
    updateStatus: async (id: string, status: ResearchPaper['status']): Promise<ResearchPaper> => {
      await sleep(300);
      const list = JSON.parse(localStorage.getItem('ent_papers') || '[]');
      let updatedPaper!: ResearchPaper;
      const newList = list.map((item: ResearchPaper) => {
        if (item.id === id) {
          updatedPaper = { ...item, status };
          return updatedPaper;
        }
        return item;
      });
      localStorage.setItem('ent_papers', JSON.stringify(newList));
      return updatedPaper;
    }
  },

  // YouTube Analysis API
  youtube: {
    getAll: async (): Promise<YouTubeAnalysis[]> => {
      await sleep(400);
      return JSON.parse(localStorage.getItem('ent_yt') || '[]');
    },
    analyzeUrl: async (url: string): Promise<YouTubeAnalysis> => {
      await sleep(1500); // longer delay for simulated heavy AI generation
      const list = JSON.parse(localStorage.getItem('ent_yt') || '[]');
      
      const newAnalysis: YouTubeAnalysis = {
        id: `yt-${Date.now()}`,
        videoUrl: url,
        title: 'Understanding Multi-Modal LLMs & Attention Vectors',
        channelName: 'MIT CSAIL',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&h=225&q=80',
        duration: '15:30',
        summary: 'This session explores how modern deep learning networks unify video, audio, and language inputs into a single semantic token stream, optimizing projection mappings for cross-modal queries.',
        keyTakeaways: [
          'Unifying attention layers directly over raw image vectors yields higher accuracy than late-fusion architectures.',
          'Projection bottlenecks are significantly mitigated by deploying linear transformers.'
        ],
        actionItems: [
          'Review team guidelines for multimodal tensor projections.',
          'Schedule deep dive study on lightweight attention mappings.'
        ],
        transcript: '[00:15] Welcome back. Today we map vectors across modes. [05:20] We utilize unified token vocabularies to skip traditional parsing steps, achieving low-latency processing.',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('ent_yt', JSON.stringify([newAnalysis, ...list]));
      return newAnalysis;
    }
  },

  // Projects API
  projects: {
    getAll: async (): Promise<Project[]> => {
      await sleep(400);
      return JSON.parse(localStorage.getItem('ent_projects') || '[]');
    },
    create: async (name: string, description: string): Promise<Project> => {
      await sleep(500);
      const list = JSON.parse(localStorage.getItem('ent_projects') || '[]');
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name,
        description,
        status: 'planning',
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('ent_projects', JSON.stringify([newProject, ...list]));
      return newProject;
    },
    addTask: async (projectId: string, task: Omit<Project['tasks'][0], 'id'>): Promise<Project> => {
      await sleep(300);
      const list = JSON.parse(localStorage.getItem('ent_projects') || '[]');
      let updatedProject!: Project;
      const newList = list.map((proj: Project) => {
        if (proj.id === projectId) {
          const newTask = { ...task, id: `t-${Date.now()}` };
          updatedProject = {
            ...proj,
            tasks: [...proj.tasks, newTask],
            updatedAt: new Date().toISOString()
          };
          return updatedProject;
        }
        return proj;
      });
      localStorage.setItem('ent_projects', JSON.stringify(newList));
      return updatedProject;
    },
    updateTaskStatus: async (projectId: string, taskId: string, status: Project['tasks'][0]['status']): Promise<Project> => {
      await sleep(200);
      const list = JSON.parse(localStorage.getItem('ent_projects') || '[]');
      let updatedProject!: Project;
      const newList = list.map((proj: Project) => {
        if (proj.id === projectId) {
          const updatedTasks = proj.tasks.map(t => t.id === taskId ? { ...t, status } : t);
          updatedProject = {
            ...proj,
            tasks: updatedTasks,
            updatedAt: new Date().toISOString()
          };
          return updatedProject;
        }
        return proj;
      });
      localStorage.setItem('ent_projects', JSON.stringify(newList));
      return updatedProject;
    }
  },

  // Journal API
  journal: {
    getAll: async (): Promise<JournalEntry[]> => {
      await sleep(400);
      return JSON.parse(localStorage.getItem('ent_journal') || '[]');
    },
    create: async (entry: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<JournalEntry> => {
      await sleep(500);
      const list = JSON.parse(localStorage.getItem('ent_journal') || '[]');
      const newEntry: JournalEntry = {
        ...entry,
        id: `j-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ent_journal', JSON.stringify([newEntry, ...list]));
      return newEntry;
    }
  }
};
