import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

const scriptDataSchema = z.object({
  title: z.string(),
  slug: z.string(),
  desc: z.string(),
  showcase: z.string(),
  tags: z.array(z.string()),
  features: z.array(
    z.object({
      name: z.string(),
      desc: z.string(),
      icon: z.string(),
    })
  ),
  dependencies: z.array(
    z.object({
      name: z.string(),
      link: z.string().optional(),
    })
  ),
})

export type ScriptData = z.infer<typeof scriptDataSchema>

export default defineContentConfig({
  collections: {
    scripts: defineCollection({
      type: 'data',
      source: 'scripts/*.json',
      schema: scriptDataSchema,
    }),
  },
})
