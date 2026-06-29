import { z } from 'zod';

export const youtubeUrlSchema = z.object({
  videoUrl: z.string()
    .url({ message: 'Must be a valid web URL' })
    .refine(
      (url) => url.includes('youtube.com') || url.includes('youtu.be'),
      { message: 'URL must reference a valid YouTube video asset' }
    ),
});

export type YoutubeUrlInput = z.infer<typeof youtubeUrlSchema>;
