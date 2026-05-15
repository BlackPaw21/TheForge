import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writeups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writeups' }),
  schema: z.object({
    title:        z.string(),
    date:         z.date(),
    tags:         z.array(z.string()),
    difficulty:   z.enum(['easy', 'medium', 'hard']).optional(),
    source:       z.enum(['local', 'htb', 'medium', 'github']).default('local'),
    external_url: z.string().url().optional(),
    excerpt:      z.string(),
  }),
});

export const collections = { writeups };
