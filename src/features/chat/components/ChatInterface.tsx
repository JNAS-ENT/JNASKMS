import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChat } from '../hooks/useChat';
import { chatInputSchema, ChatInput } from '../validation/schema';
import { Send, Bot, User, Trash2, Cpu, MessageSquare, Terminal, RefreshCw, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ChatInterface() {
  const { messages, isSending, sendMessage, clearHistory } = useChat();
  const feedEndRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ChatInput>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: { message: '' }
  });

  const onSubmit = (data: ChatInput) => {
    sendMessage(data.message);
    setValue('message', '');
  };

  // Scroll to bottom when messages list expands
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const recommendedPrompts = [
    'How should we secure JWT corporate auth tokens?',
    'Review microservice messaging architecture.',
    'Explain route-based split strategies in Vite.'
  ];

  const handlePromptClick = (prompt: string) => {
    setValue('message', prompt);
    sendMessage(prompt);
  };

  return (
    <div id="ai-chat-module" className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[550px] items-stretch">
      {/* Suggestions Sidebar */}
      <div className="lg:col-span-1 bg-card border border-border rounded-xl p-5 flex flex-col justify-between h-full shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Cpu className="w-4 h-4 text-blue-500" />
            Co-Pilot Suggestion Index
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Utilize pre-indexed workspace query macros to evaluate enterprise system compliance and security parameters.
          </p>
          <div className="space-y-2 pt-2">
            {recommendedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`recommended-prompt-${idx}`}
                onClick={() => handlePromptClick(prompt)}
                disabled={isSending}
                className="w-full text-left p-3 bg-secondary hover:bg-opacity-80 rounded-lg text-xs font-semibold leading-snug border border-border/50 text-foreground block transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <button
          id="btn-clear-chat-history"
          onClick={clearHistory}
          className="w-full flex items-center justify-center gap-2 py-2 border border-border text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors mt-4"
        >
          <Trash2 className="w-4 h-4" />
          Retire History Buffers
        </button>
      </div>

      {/* Primary Conversational Console */}
      <div className="lg:col-span-3 bg-card border border-border rounded-xl flex flex-col overflow-hidden h-full shadow-sm">
        {/* Terminal Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/20">
          <div className="flex items-center gap-2">
            <Bot className="w-4.5 h-4.5 text-primary" />
            <span className="font-bold text-sm font-display tracking-tight">AI Developer Command Console</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              Ready
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">Channel: #architecture</span>
        </div>

        {/* Message Feed list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Profile Ring */}
              <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center h-8 w-8 ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
              }`}>
                {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Sparkles className="w-4.5 h-4.5 text-blue-500" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground border border-border/50'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
                <span className="block text-[9px] text-muted-foreground font-mono text-right px-1">
                  {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing state indicator */}
          {isSending && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="p-2 rounded-lg bg-secondary text-foreground shrink-0 flex items-center justify-center h-8 w-8">
                <Sparkles className="w-4.5 h-4.5 text-blue-500 animate-pulse" />
              </div>
              <div className="bg-secondary text-foreground border border-border/50 p-3 rounded-xl text-xs flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground font-mono animate-pulse">Consulting model context buffers...</span>
              </div>
            </div>
          )}

          <div ref={feedEndRef} />
        </div>

        {/* Console Input Bar */}
        <div className="p-4 border-t border-border bg-secondary/10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <input
              id="chat-console-input"
              type="text"
              {...register('message')}
              disabled={isSending}
              placeholder="Ask anything or request model compliance checks..."
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              id="btn-chat-submit"
              type="submit"
              disabled={isSending}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {errors.message && (
            <p className="text-[10px] text-destructive font-semibold mt-1 px-1">{errors.message.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
