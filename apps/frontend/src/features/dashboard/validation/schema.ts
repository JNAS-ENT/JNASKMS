import { z } from 'zod';

export const metricFilterSchema = z.object({
  timeRange: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
  category: z.string().optional()
});

export type MetricFilterInput = z.infer<typeof metricFilterSchema>;
