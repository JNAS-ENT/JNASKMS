import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid enterprise email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid enterprise email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['admin', 'user', 'editor']).default('user'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
