import { z } from 'zod';

export const journalSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  content: z.string().min(5, { message: 'Write a slightly longer reflection to capture thoughts' }),
  mood: z.enum(['excellent', 'good', 'neutral', 'anxious', 'tired']).default('neutral'),
  productivityRating: z.number().int().min(1).max(5),
  tags: z.array(z.string()).default([]),
});

export type JournalInput = z.infer<typeof journalSchema>;
