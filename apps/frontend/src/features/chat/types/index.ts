import { ChatMessage } from '../../../types';

export interface ChatSessionState {
  messages: ChatMessage[];
  isStreaming: boolean;
  activeContextId?: string;
}
