import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Sanity client configured for real-time updates
 * - useCdn: false - Disables CDN caching for instant updates
 * - Always fetches fresh data from Sanity API
 * - No caching layer between Sanity and Next.js
 */
export const client = createClient({
  projectId:"vumt2wwt",
  dataset:'production',
  apiVersion:'2026-02-02',
  useCdn: false, // Disable CDN for instant updates after publish - CRITICAL for real-time updates
  perspective: 'published',
  stega: {
    enabled: false,
  },
  // Force fresh data on every request
  token: undefined, // Read-only client, no token needed
})
