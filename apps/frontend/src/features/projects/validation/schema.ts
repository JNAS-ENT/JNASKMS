import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(2, { message: 'Task description must be at least 2 characters' }),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in-progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;

export const projectSchema = z.object({
  name: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
});

export type ProjectInput = z.infer<typeof projectSchema>;
