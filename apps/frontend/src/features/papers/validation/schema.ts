import { z } from 'zod';

export const paperSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  authors: z.string().min(2, { message: 'Please specify at least one author' }),
  abstract: z.string().min(10, { message: 'Abstract must provide at least a brief summary of the paper' }),
  journal: z.string().min(2, { message: 'Journal name is required' }),
  publishYear: z.number().int().min(1900).max(new Date().getFullYear()),
  doi: z.string().optional(),
  status: z.enum(['to-read', 'reading', 'completed']).default('to-read'),
  tags: z.array(z.string()).default([]),
});

export type PaperInput = z.infer<typeof paperSchema>;
