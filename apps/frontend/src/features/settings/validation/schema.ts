import { z } from 'zod';

export const configSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  aiModelPreference: z.enum(['gemini-2.5-flash', 'gemini-2.5-pro']).default('gemini-2.5-flash'),
  enterpriseApiKey: z.string().optional(),
});

export type ConfigInput = z.infer<typeof configSchema>;
