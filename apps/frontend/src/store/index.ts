import { useState, useEffect } from 'react';
import { User, Note, ResearchPaper, YouTubeAnalysis, ChatMessage, JournalEntry, Project, SystemConfig } from '../types';

// Initial Mock Data
const DEFAULT_NOTES: Note[] = [
  {
    id: 'n-1',
    title: 'Enterprise Architecture Overview',
    content: '<h1>Architecture Strategy</h1><p>Our microfrontend strategy leverages decoupled container apps running with Module Federation. Key priorities include optimized performance budgets and robust type sharing.</p><ul><li>Strict modular boundaries</li><li>Shared layout assets</li><li>Federated state hydration</li></ul>',
    category: 'Architecture',
    tags: ['Tech', 'Enterprise'],
    createdAt: '2026-06-25T10:00:00Z',
    updatedAt: '2026-06-28T14:30:00Z'
  },
  {
    id: 'n-2',
    title: 'Q3 Product Milestones',
    content: '<h2>Product Roadmap & OKRs</h2><p>Focusing heavily on generative AI integrations and secure client workspaces.</p><ol><li>Complete developer preview for integrations</li><li>Scale API ingress to handle 50k concurrent requests</li><li>Optimize first-contentful paint to < 1.2s</li></ol>',
    category: 'Product',
    tags: ['Strategy', 'Roadmap'],
    createdAt: '2026-06-27T09:15:00Z',
    updatedAt: '2026-06-27T09:15:00Z'
  }
];

const DEFAULT_PAPERS: ResearchPaper[] = [
  {
    id: 'p-1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
    abstract: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.',
    journal: 'Advances in Neural Information Processing Systems',
    publishYear: 2017,
    doi: '10.5555/3295222.3295349',
    status: 'completed',
    tags: ['AI', 'Transformers', 'NLP'],
    summary: 'Introduced the Transformer architecture which replaces recurrence with self-attention mechanism, dramatically speeding up training and serving as the foundation for modern LLMs.',
    createdAt: '2026-06-20T08:00:00Z'
  },
  {
    id: 'p-2',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: ['Edward J. Hu', 'Yuxin Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu'],
    abstract: 'An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to particular tasks. We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters.',
    journal: 'arXiv preprint',
    publishYear: 2021,
    status: 'reading',
    tags: ['AI', 'Fine-Tuning', 'Efficiency'],
    summary: 'A highly efficient adaptation technique that freezes pre-trained model weights and injects low-rank trainable matrices, decreasing parameter load by up to 10,000x.',
    createdAt: '2026-06-26T11:20:00Z'
  }
];

const DEFAULT_YOUTUBE: YouTubeAnalysis[] = [
  {
    id: 'yt-1',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Generative AI Developer Day 2026 Keynote',
    channelName: 'Google Developers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&h=225&q=80',
    duration: '22:45',
    summary: 'An exploration of state-of-the-art developments in generative AI tools, native multi-modal model architectures, developer productivity environments, and low-latency API access frameworks.',
    keyTakeaways: [
      'Multi-modal processing is now native, lowering costs by 40% and reducing latency.',
      'Edge deployment of lightweight models is now standard for mobile-first applications.',
      'Agentic structures are replacing standard chat windows for complex task planning.'
    ],
    actionItems: [
      'Evaluate Edge API kits for our upcoming mobile dashboard rewrite.',
      'Conduct a team training session on Agentic prompt patterns.'
    ],
    transcript: '[00:01] Welcome everyone to Developer Day 2026. [03:15] Today we are unveiling native multi-modal agent structures. [10:42] This reduces context parsing latency by over half, making real-time interactive voice bots fully responsive.',
    createdAt: '2026-06-28T16:00:00Z'
  }
];

const DEFAULT_CHAT: ChatMessage[] = [
  {
    id: 'c-1',
    role: 'assistant',
    content: 'Welcome to the enterprise command center! I am your AI architect agent. How can I assist with your design reviews, notes analysis, or project planning today?',
    timestamp: '2026-06-29T11:00:00Z'
  }
];

const DEFAULT_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    title: 'Reflections on Modular Systems Design',
    content: 'Spent the morning designing decoupled folder frameworks. A structured module layout like feature/components/api speeds up team onboards and minimizes file overlap conflicts.',
    mood: 'excellent',
    productivityRating: 5,
    tags: ['Architecture', 'Mentoring'],
    createdAt: '2026-06-28T18:00:00Z'
  },
  {
    id: 'j-2',
    title: 'Midweek Architecture Alignment',
    content: 'Met with the platform leads to review API schemas. Decided to consolidate all authentication structures under a clean provider to prevent multiple concurrent token refresh sweeps.',
    mood: 'neutral',
    productivityRating: 3,
    tags: ['Alignment', 'Meetings'],
    createdAt: '2026-06-24T17:30:00Z'
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Enterprise Client Workspace',
    description: 'Rebuilding our core client-facing application interface with responsive design and durable real-time integrations.',
    status: 'active',
    tasks: [
      {
        id: 't-1',
        title: 'Draft architecture schema documentation',
        description: 'Document feature-based folder structures and state hydration patterns.',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-07-02',
        assignedTo: 'Shaikh J.'
      },
      {
        id: 't-2',
        title: 'Integrate TipTap rich text editor',
        description: 'Set up modular components for note editing with standard formatting capabilities.',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2026-07-05',
        assignedTo: 'Sarah L.'
      },
      {
        id: 't-3',
        title: 'Configure Jest & Playwright environments',
        description: 'Implement rigorous automated regression tests across major visual layouts.',
        status: 'todo',
        priority: 'low',
        dueDate: '2026-07-15'
      }
    ],
    createdAt: '2026-06-25T08:00:00Z',
    updatedAt: '2026-06-28T10:00:00Z'
  },
  {
    id: 'proj-2',
    name: 'Unified Search Engine Integration',
    description: 'An AI-powered indexing platform indexing research papers, videos, and private notes.',
    status: 'planning',
    tasks: [
      {
        id: 't-4',
        title: 'Define Elasticsearch index definitions',
        description: 'Map paper fields, metadata, tags, and transcripts for precise scoring.',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-07-10'
      }
    ],
    createdAt: '2026-06-28T09:00:00Z',
    updatedAt: '2026-06-28T09:00:00Z'
  }
];

const DEFAULT_CONFIG: SystemConfig = {
  theme: 'dark',
  emailNotifications: true,
  pushNotifications: false,
  aiModelPreference: 'gemini-2.5-flash',
  enterpriseApiKey: '••••••••••••••••••••••••'
};

const DEFAULT_USER: User = {
  id: 'u-1',
  email: 'shaikh.jnas@gmail.com',
  fullName: 'Shaikh Jnas',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  createdAt: '2026-01-15T08:00:00Z'
};

// Local storage helper
const getStored = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving state', e);
  }
};

export function useEnterpriseStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored<User | null>('ent_user', DEFAULT_USER));
  const [currentScreen, setCurrentScreen] = useState<string>(() => getStored<string>('ent_screen', 'dashboard'));
  const [notes, setNotes] = useState<Note[]>(() => getStored<Note[]>('ent_notes', DEFAULT_NOTES));
  const [papers, setPapers] = useState<ResearchPaper[]>(() => getStored<ResearchPaper[]>('ent_papers', DEFAULT_PAPERS));
  const [youtubeAnalyses, setYoutubeAnalyses] = useState<YouTubeAnalysis[]>(() => getStored<YouTubeAnalysis[]>('ent_yt', DEFAULT_YOUTUBE));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getStored<ChatMessage[]>('ent_chat', DEFAULT_CHAT));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => getStored<JournalEntry[]>('ent_journal', DEFAULT_JOURNAL));
  const [projects, setProjects] = useState<Project[]>(() => getStored<Project[]>('ent_projects', DEFAULT_PROJECTS));
  const [config, setConfig] = useState<SystemConfig>(() => getStored<SystemConfig>('ent_config', DEFAULT_CONFIG));

  // Sync with localStorage
  useEffect(() => { setStored('ent_user', currentUser); }, [currentUser]);
  useEffect(() => { setStored('ent_screen', currentScreen); }, [currentScreen]);
  useEffect(() => { setStored('ent_notes', notes); }, [notes]);
  useEffect(() => { setStored('ent_papers', papers); }, [papers]);
  useEffect(() => { setStored('ent_yt', youtubeAnalyses); }, [youtubeAnalyses]);
  useEffect(() => { setStored('ent_chat', chatMessages); }, [chatMessages]);
  useEffect(() => { setStored('ent_journal', journalEntries); }, [journalEntries]);
  useEffect(() => { setStored('ent_projects', projects); }, [projects]);
  useEffect(() => { setStored('ent_config', config); }, [config]);

  // Screen layout helpers
  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  // Dark mode trigger
  useEffect(() => {
    const root = window.document.documentElement;
    if (config.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config.theme]);

  const toggleTheme = () => {
    setConfig(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  return {
    currentUser,
    setCurrentUser,
    currentScreen,
    navigateTo,
    notes,
    setNotes,
    papers,
    setPapers,
    youtubeAnalyses,
    setYoutubeAnalyses,
    chatMessages,
    setChatMessages,
    journalEntries,
    setJournalEntries,
    projects,
    setProjects,
    config,
    setConfig,
    toggleTheme
  };
}
