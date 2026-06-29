import { z } from 'zod';

export const chatInputSchema = z.object({
  message: z.string().min(1, { message: 'Message content cannot be blank' }),
});

export type ChatInput = z.infer<typeof chatInputSchema>;
