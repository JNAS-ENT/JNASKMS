import { ChatMessage } from '../../../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CONTEXTUAL_RESPONSES = [
  {
    keywords: ['microservice', 'microservices', 'architecture'],
    response: 'In microservices topologies, we enforce strict decoupled domain bounds. Each domain must maintain private data stores, executing cross-domain orchestration purely via async messaging buses (e.g., Kafka) or linear gRPC pathways to minimize latency.'
  },
  {
    keywords: ['auth', 'authentication', 'jwt', 'token'],
    response: 'Our platform recommends deploying JWT tokens inside HTTPOnly, SameSite strict cookies. Token refresh routines should execute via an decoupled iframe or background worker thread, shielding access keys from potential client-side script cross-site exposure (XSS).'
  },
  {
    keywords: ['database', 'postgresql', 'sql', 'firestore'],
    response: 'For high-write operational logs and real-time synchronizations, Firestore presents optimized document hierarchies. Relational databases like PostgreSQL are reserved for high-fidelity ledgers and multi-row ACID transactions.'
  },
  {
    keywords: ['route', 'routing', 'vite', 'next'],
    response: 'Single Page Applications (SPAs) achieve optimal load budgets by implementing Route-based Code Splitting. This ensures first-paint packets remain beneath 150KB, asynchronously pulling secondary pages only on active cursor hover.'
  }
];

const DEFAULT_RESPONSES = [
  "Interesting structural inquiry. For corporate compliance, we mandate that all state mutators execute through standardized hooks, safeguarding structural decoupling.",
  "Understood. To optimize response speeds, we advise establishing edge cached CDN layers (e.g. Cloudflare Workers) directly in front of resource pools.",
  "Excellent query. That aligns with our architectural vision of modular, single-responsibility components and robust, type-safe API boundaries."
];

export const chatApi = {
  sendMessage: async (text: string): Promise<ChatMessage> => {
    await sleep(1000); // simulated latency
    
    // Find contextual matching
    const matching = CONTEXTUAL_RESPONSES.find(r => 
      r.keywords.some(kw => text.toLowerCase().includes(kw))
    );

    const responseContent = matching 
      ? matching.response 
      : DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];

    return {
      id: `c-${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString()
    };
  }
};
