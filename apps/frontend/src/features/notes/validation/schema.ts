import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  content: z.string().min(1, { message: 'Content cannot be empty' }),
  category: z.string().min(1, { message: 'Please select a workspace category' }),
  tags: z.array(z.string()).default([]),
});

export type NoteInput = z.infer<typeof noteSchema>;
