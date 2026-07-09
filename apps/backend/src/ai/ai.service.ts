import { Injectable, Inject } from '@nestjs/common';
import { SystemService } from '../system/system.service';

export interface AiProvider {
  id: string;
  name: string;
  enabled: boolean;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  defaultModel: string;
  availableModels: string[];
  totalRequests: number;
  totalTokens: number;
  averageLatencyMs: number;
  errorRate: number;
  rateLimitStatus: string;
  lastRequestTime: string | null;
}

export interface AiModel {
  id: string;
  providerId: string;
  name: string;
  contextWindow: number;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  capabilities: {
    vision: boolean;
    audio: boolean;
    toolCalling: boolean;
    reasoning: boolean;
    streaming: boolean;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  folder: string | null;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  template: string;
  variables: string[];
  version: string;
  favorite: boolean;
}

export interface ExecutionLog {
  id: string;
  provider: string;
  model: string;
  promptLength: number;
  responseLength: number;
  executionTimeMs: number;
  tokens: number;
  estimatedCost: number;
  status: 'SUCCESS' | 'ERROR';
  timestamp: string;
  errorMessage: string | null;
}

export interface AiAgent {
  id: string;
  name: string;
  role: string;
  status: 'RUNNING' | 'IDLE' | 'FAILED';
  currentTask: string | null;
  memoryUsageMb: number;
  toolUsage: string[];
}

@Injectable()
export class AiService {
  private providers: AiProvider[] = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      enabled: true,
      status: 'ONLINE',
      defaultModel: 'gemini-2.5-flash',
      availableModels: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash'],
      totalRequests: 1250,
      totalTokens: 2450000,
      averageLatencyMs: 120,
      errorRate: 0.01,
      rateLimitStatus: '15RPM / 1500RPD Remaining',
      lastRequestTime: new Date(Date.now() - 1000 * 60).toISOString(),
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      enabled: true,
      status: 'ONLINE',
      defaultModel: 'gpt-4o',
      availableModels: ['gpt-4o', 'gpt-4o-mini', 'o1-preview'],
      totalRequests: 840,
      totalTokens: 1850000,
      averageLatencyMs: 380,
      errorRate: 0.02,
      rateLimitStatus: 'Tier 4 Active',
      lastRequestTime: new Date(Date.now() - 1000 * 300).toISOString(),
    },
    {
      id: 'openrouter',
      name: 'OpenRouter API',
      enabled: false,
      status: 'OFFLINE',
      defaultModel: 'anthropic/claude-3.5-sonnet',
      availableModels: ['anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.1-70b-instruct'],
      totalRequests: 0,
      totalTokens: 0,
      averageLatencyMs: 0,
      errorRate: 0,
      rateLimitStatus: 'Unlimited',
      lastRequestTime: null,
    },
    {
      id: 'grok',
      name: 'xAI Grok',
      enabled: true,
      status: 'ONLINE',
      defaultModel: 'grok-beta',
      availableModels: ['grok-beta', 'grok-vision-beta'],
      totalRequests: 320,
      totalTokens: 680000,
      averageLatencyMs: 250,
      errorRate: 0.03,
      rateLimitStatus: 'Normal',
      lastRequestTime: new Date(Date.now() - 1000 * 120).toISOString(),
    },
    {
      id: 'ollama',
      name: 'Ollama (Local)',
      enabled: false,
      status: 'OFFLINE',
      defaultModel: 'llama3:8b',
      availableModels: ['llama3:8b', 'mistral', 'phi3'],
      totalRequests: 0,
      totalTokens: 0,
      averageLatencyMs: 0,
      errorRate: 0,
      rateLimitStatus: 'Local Host Only',
      lastRequestTime: null,
    }
  ];

  private models: AiModel[] = [
    {
      id: 'gemini-2.5-flash',
      providerId: 'gemini',
      name: 'Gemini 2.5 Flash',
      contextWindow: 1048576,
      inputCostPerMillion: 0.075,
      outputCostPerMillion: 0.3,
      capabilities: { vision: true, audio: true, toolCalling: true, reasoning: false, streaming: true },
    },
    {
      id: 'gemini-2.5-pro',
      providerId: 'gemini',
      name: 'Gemini 2.5 Pro',
      contextWindow: 2097152,
      inputCostPerMillion: 1.25,
      outputCostPerMillion: 5.0,
      capabilities: { vision: true, audio: true, toolCalling: true, reasoning: true, streaming: true },
    },
    {
      id: 'gpt-4o',
      providerId: 'openai',
      name: 'GPT-4o',
      contextWindow: 128000,
      inputCostPerMillion: 2.5,
      outputCostPerMillion: 10.0,
      capabilities: { vision: true, audio: false, toolCalling: true, reasoning: false, streaming: true },
    },
    {
      id: 'gpt-4o-mini',
      providerId: 'openai',
      name: 'GPT-4o Mini',
      contextWindow: 128000,
      inputCostPerMillion: 0.15,
      outputCostPerMillion: 0.6,
      capabilities: { vision: true, audio: false, toolCalling: true, reasoning: false, streaming: true },
    },
    {
      id: 'grok-beta',
      providerId: 'grok',
      name: 'Grok Beta',
      contextWindow: 131072,
      inputCostPerMillion: 5.0,
      outputCostPerMillion: 15.0,
      capabilities: { vision: false, audio: false, toolCalling: true, reasoning: true, streaming: true },
    }
  ];

  private chats: ChatSession[] = [
    { id: 'chat-1', title: 'Designing NestJS Microservices', folder: 'Work', tags: ['nest', 'architecture'], pinned: true, archived: false, createdAt: new Date(Date.now() - 1000 * 3600 * 24).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'chat-2', title: 'Prisma Migration Troubleshooting', folder: 'Work', tags: ['database', 'prisma'], pinned: false, archived: false, createdAt: new Date(Date.now() - 1000 * 3600 * 12).toISOString(), updatedAt: new Date(Date.now() - 1000 * 3600 * 11).toISOString() },
    { id: 'chat-3', title: 'Personal Journal Summary Generator', folder: 'Ideas', tags: ['ai', 'journal'], pinned: false, archived: false, createdAt: new Date(Date.now() - 1000 * 3600 * 4).toISOString(), updatedAt: new Date(Date.now() - 1000 * 3600 * 4).toISOString() },
  ];

  private prompts: PromptTemplate[] = [
    { id: 'p-1', title: 'Clean Architecture Explainer', category: 'Coding', template: 'Analyze the following {{lang}} code for adherence to Hexagonal / Clean Architecture principles:\n\n{{code}}', variables: ['lang', 'code'], version: '1.2.0', favorite: true },
    { id: 'p-2', title: 'Meeting Actions Ingestion', category: 'Business', template: 'Extract action items, assignees, and deadlines from the following notes:\n\n{{notes}}', variables: ['notes'], version: '2.0.1', favorite: false },
    { id: 'p-3', title: 'Technical Plan Outline', category: 'Planning', template: 'Create a comprehensive step-by-step implementation outline for: {{plan}}', variables: ['plan'], version: '1.0.0', favorite: true }
  ];

  private executionLogs: ExecutionLog[] = [
    { id: 'log-1', provider: 'Google Gemini', model: 'gemini-2.5-flash', promptLength: 450, responseLength: 1200, executionTimeMs: 140, tokens: 1650, estimatedCost: 0.0003, status: 'SUCCESS', timestamp: new Date(Date.now() - 1000 * 300).toISOString(), errorMessage: null },
    { id: 'log-2', provider: 'OpenAI GPT', model: 'gpt-4o', promptLength: 800, responseLength: 2200, executionTimeMs: 410, tokens: 3000, estimatedCost: 0.024, status: 'SUCCESS', timestamp: new Date(Date.now() - 1000 * 600).toISOString(), errorMessage: null },
    { id: 'log-3', provider: 'Google Gemini', model: 'gemini-2.5-pro', promptLength: 5000, responseLength: 0, executionTimeMs: 820, tokens: 5000, estimatedCost: 0.006, status: 'ERROR', timestamp: new Date(Date.now() - 1000 * 1200).toISOString(), errorMessage: 'API rate limit exceeded. Retry in 45 seconds.' }
  ];

  private agents: AiAgent[] = [
    { id: 'ag-1', name: 'Software Architect Agent', role: 'System Architecture & Modeling', status: 'RUNNING', currentTask: 'Refactoring EnterpriseSystemStatus.tsx modules', memoryUsageMb: 142.5, toolUsage: ['file_writer', 'code_analyzer'] },
    { id: 'ag-2', name: 'RAG Knowledge Indexer', role: 'Chunking & Vector Store Sync', status: 'IDLE', currentTask: null, memoryUsageMb: 95.2, toolUsage: ['text_splitter', 'embedding_generator'] },
    { id: 'ag-3', name: 'Site Reliability Sentry', role: 'Continuous Health Check Coordinator', status: 'RUNNING', currentTask: 'Sweeping microservice endpoints', memoryUsageMb: 84.1, toolUsage: ['http_ping', 'alert_dispatcher'] },
  ];

  constructor(@Inject(SystemService) private readonly systemService: SystemService) {}

  getProviders(): AiProvider[] {
    return this.providers;
  }

  toggleProvider(id: string): AiProvider | undefined {
    const provider = this.providers.find(p => p.id === id);
    if (provider) {
      provider.enabled = !provider.enabled;
      provider.status = provider.enabled ? 'ONLINE' : 'OFFLINE';
      this.systemService.addLog('AIConfig', 'SUCCESS', `Provider ${provider.name} status updated: ${provider.status}`);
    }
    return provider;
  }

  testProvider(id: string) {
    const provider = this.providers.find(p => p.id === id);
    if (!provider) return { success: false, message: 'Provider not found.' };

    this.systemService.addLog('AIConfig', 'INFO', `Running validation test for ${provider.name}...`);
    
    if (id === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        provider.status = 'DEGRADED';
        return { success: false, message: 'GEMINI_API_KEY environment variable is not defined.' };
      }
      provider.status = 'ONLINE';
      return { success: true, message: 'Successfully connected and verified Gemini API Key with Google Cloud brokerage.' };
    }

    provider.status = provider.enabled ? 'ONLINE' : 'OFFLINE';
    return { success: true, message: `Successfully simulated connection handshake with ${provider.name}.` };
  }

  getModels(): AiModel[] {
    return this.models;
  }

  getChats(): ChatSession[] {
    return this.chats;
  }

  getPrompts(): PromptTemplate[] {
    return this.prompts;
  }

  getLogs(): ExecutionLog[] {
    return this.executionLogs;
  }

  getAgents(): AiAgent[] {
    return this.agents;
  }

  restartAgent(id: string): AiAgent | undefined {
    const agent = this.agents.find(a => a.id === id);
    if (agent) {
      agent.status = 'RUNNING';
      agent.memoryUsageMb = 12.0; // starts fresh
      this.systemService.addLog('AIAgent', 'SUCCESS', `Successfully re-initialized ${agent.name}.`);
    }
    return agent;
  }

  getMemoryUsage() {
    return {
      shortTermMemory: { allocatedMb: 512, usedMb: 142.5, itemsCount: 4250 },
      longTermMemory: { allocatedMb: 2048, usedMb: 350.2, itemsCount: 15400 },
      projectMemory: { allocatedMb: 1024, usedMb: 120.4, itemsCount: 320 },
      researchMemory: { allocatedMb: 2048, usedMb: 450.8, itemsCount: 125 },
      agentMemory: { allocatedMb: 1024, usedMb: 321.8, itemsCount: 890 },
      conversationMemory: { allocatedMb: 512, usedMb: 85.1, itemsCount: 220 },
    };
  }

  getAnalytics() {
    return {
      dailyRequests: [
        { date: 'Mon', requests: 450, cost: 1.25 },
        { date: 'Tue', requests: 520, cost: 2.1 },
        { date: 'Wed', requests: 490, cost: 1.8 },
        { date: 'Thu', requests: 620, cost: 3.4 },
        { date: 'Fri', requests: 580, cost: 2.9 },
        { date: 'Sat', requests: 310, cost: 0.95 },
        { date: 'Sun', requests: 350, cost: 1.1 },
      ],
      tokensConsumed: [
        { name: 'Gemini', value: 2450000 },
        { name: 'GPT', value: 1850000 },
        { name: 'Grok', value: 680000 },
      ],
      avgLatency: [
        { name: 'Gemini', value: 120 },
        { name: 'Grok', value: 250 },
        { name: 'GPT', value: 380 },
      ],
      successRate: 98.6,
      errorRate: 1.4,
    };
  }
}
