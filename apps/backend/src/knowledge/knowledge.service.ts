import { Injectable, Inject } from '@nestjs/common';
import { SystemService } from '../system/system.service';

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: string;
  source: string;
  status: 'INDEXED' | 'INGESTING' | 'FAILED';
  sizeKb: number;
  lastUpdated: string;
}

export interface GraphNode {
  id: string;
  label: string;
  group: 'project' | 'document' | 'tech' | 'person' | 'task';
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

@Injectable()
export class KnowledgeService {
  private documents: KnowledgeDocument[] = [
    { id: 'doc-1', title: 'Attention Is All You Need', type: 'Research Paper', source: 'arXiv Upload', status: 'INDEXED', sizeKb: 1240, lastUpdated: new Date(Date.now() - 1000 * 3600 * 240).toISOString() },
    { id: 'doc-2', title: 'Enterprise NestJS Architecture Blueprints', type: 'Technical Plan', source: 'Wiki Sync', status: 'INDEXED', sizeKb: 340, lastUpdated: new Date(Date.now() - 1000 * 3600 * 12).toISOString() },
    { id: 'doc-3', title: 'Prisma schema state persistence mapping', type: 'Source Code', source: 'GitHub Repositories', status: 'INDEXED', sizeKb: 120, lastUpdated: new Date(Date.now() - 1000 * 3600 * 3).toISOString() },
    { id: 'doc-4', title: 'Multi-Modal LLM Vector attention maps', type: 'YouTube Analysis', source: 'MIT CSAIL Video', status: 'INDEXED', sizeKb: 840, lastUpdated: new Date(Date.now() - 1000 * 3600 * 48).toISOString() }
  ];

  private nodes: GraphNode[] = [
    { id: 'n-p1', label: 'Knowledge Operating System', group: 'project' },
    { id: 'n-d1', label: 'Attention Is All You Need', group: 'document' },
    { id: 'n-d2', label: 'NestJS Blueprints Plan', group: 'document' },
    { id: 'n-t1', label: 'TypeScript', group: 'tech' },
    { id: 'n-t2', label: 'NestJS Framework', group: 'tech' },
    { id: 'n-t3', label: 'Prisma Client', group: 'tech' },
    { id: 'n-u1', label: 'Shaikh JNAS', group: 'person' },
  ];

  private edges: GraphEdge[] = [
    { from: 'n-u1', to: 'n-p1', label: 'leads' },
    { from: 'n-p1', to: 'n-t1', label: 'built_with' },
    { from: 'n-p1', to: 'n-t2', label: 'built_with' },
    { from: 'n-p1', to: 'n-t3', label: 'persisted_with' },
    { from: 'n-d2', to: 'n-t2', label: 'references' },
    { from: 'n-d1', to: 'n-p1', label: 'inspired' },
  ];

  constructor(@Inject(SystemService) private readonly systemService: SystemService) {}

  getDocuments(): KnowledgeDocument[] {
    return this.documents;
  }

  ingestDocument(title: string, type: string, source: string): KnowledgeDocument {
    const doc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      title,
      type,
      source,
      status: 'INGESTING',
      sizeKb: Math.round(Math.random() * 500) + 50,
      lastUpdated: new Date().toISOString(),
    };
    this.documents.unshift(doc);
    this.systemService.addLog('Knowledge', 'INFO', `Started ingestion of ${title} (${type})`);
    
    // Simulate async success index
    setTimeout(() => {
      doc.status = 'INDEXED';
      this.systemService.addLog('Knowledge', 'SUCCESS', `Ingested and indexed: ${title}`);
    }, 4000);

    return doc;
  }

  getGraph() {
    return {
      nodes: this.nodes,
      edges: this.edges,
    };
  }

  getSearchHistory() {
    return [
      { id: 's-1', query: 'NestJS architecture plans', timestamp: new Date().toISOString() },
      { id: 's-2', query: 'Attention vector projections', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ];
  }

  getInsights() {
    return {
      mostActiveProjects: [
        { name: 'Knowledge Operating System', score: 98 },
        { name: 'Core Infrastructure Sentry', score: 45 },
      ],
      mostReferencedDocuments: [
        { title: 'Attention Is All You Need', count: 42 },
        { title: 'NestJS Architecture Blueprints', count: 28 },
      ],
      knowledgeGrowth: [
        { name: 'May', sizeMb: 120 },
        { name: 'Jun', sizeMb: 245 },
        { name: 'Jul', sizeMb: 410 },
      ],
      trendingTopics: ['Vector Embeddings', 'Prisma Schema', 'TypeScript Decorators'],
      knowledgeGaps: ['Ollama Offline Setup Docs', 'Oracle Web Handshake'],
    };
  }

  askAssistant(query: string) {
    this.systemService.addLog('RAG', 'INFO', `Retrieval Augmented Generation initiated for query: ${query}`);
    
    let answer = 'Here is what I found about your workspace:\n\n';
    let citations: string[] = [];

    if (query.toLowerCase().includes('nest') || query.toLowerCase().includes('architecture')) {
      answer += 'Your workspace is structured around a **NestJS framework** backend in `/apps/backend` and a **Vite/React frontend** in `/apps/frontend` (integrated cleanly via a workspace symlink). The database layer is structured around **Prisma Client** for schema synchronization and database persistence.';
      citations = ['Enterprise NestJS Architecture Blueprints (doc-2)', 'Prisma schema state persistence mapping (doc-3)'];
    } else if (query.toLowerCase().includes('prisma') || query.toLowerCase().includes('database')) {
      answer += 'The PostgreSQL relational database is monitored continuously and uses **Prisma** for active state schema migrations. The query latencies are currently averaging **1.2ms**, and connection pools are active.';
      citations = ['Prisma schema state persistence mapping (doc-3)', 'Postgres Telemetry (SystemStatus)'];
    } else {
      answer += 'The Knowledge Intelligence Pipeline indexes multiple corporate files, research papers, YouTube videos (like MIT CSAIL), and GitHub source repositories to create vector representations. These models are loaded on demand by Google Gemini to provide contextual citations.';
      citations = ['Attention Is All You Need (doc-1)', 'Multi-Modal LLM Vector attention maps (doc-4)'];
    }

    return {
      answer,
      citations,
      timestamp: new Date().toISOString(),
    };
  }
}
