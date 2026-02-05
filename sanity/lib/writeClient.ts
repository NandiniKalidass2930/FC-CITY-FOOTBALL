import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const writeClient = createClient({
  projectId: projectId || 'vumt2wwt',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2026-02-02',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // Write token from environment
  perspective: 'published',
})
