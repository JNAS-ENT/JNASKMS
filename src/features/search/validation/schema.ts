import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string().min(1, { message: 'Specify at least one character' }),
  filterType: z.enum(['all', 'note', 'paper', 'youtube', 'journal']).default('all'),
});

export type SearchInput = z.infer<typeof searchSchema>;
