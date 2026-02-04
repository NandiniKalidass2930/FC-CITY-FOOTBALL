# Sanity CMS Real-Time Updates Configuration

## Overview
This document describes the configuration for real-time content updates from Sanity CMS without requiring manual page refresh.

## Implementation Summary

### 1. Sanity Client Configuration (`sanity/lib/client.ts`)
- ✅ `useCdn: false` - Disables CDN caching for instant updates
- ✅ Always fetches fresh data directly from Sanity API
- ✅ No caching layer between Sanity and Next.js

### 2. All Client Fetch Calls Updated
All `client.fetch()` calls now include:
```typescript
client.fetch(query, {}, { 
  next: { revalidate: 0 },
  cache: 'no-store' as any 
})
```

**Updated Files:**
- ✅ `app/[lang]/page.tsx` - Home page (hero, sponsors)
- ✅ `app/[lang]/our-team/page.tsx` - Team page (players, coaches, highlights)
- ✅ `app/[lang]/contact/page.tsx` - Contact page
- ✅ `app/[lang]/faq/page.tsx` - FAQ page
- ✅ `app/[lang]/about/page.tsx` - About page
- ✅ `app/[lang]/training/page.tsx` - Training page
- ✅ `app/[lang]/gallery/page.tsx` - Gallery page
- ✅ `components/footer.tsx` - Footer component
- ✅ `lib/site-settings.ts` - Site settings

### 3. Refresh Mechanisms

#### Window Focus Listener (Our Team Page)
- Automatically refreshes data when user returns to the browser tab
- Uses `dataRefreshKey` state to force re-fetch

#### Route Change Detection
- All pages refetch data when route changes
- Uses `pathname` in `useEffect` dependencies

#### Language Change Detection
- All pages refetch data when language changes
- Uses `language` in `useEffect` dependencies

## How It Works

1. **Content Published in Sanity** → Content is immediately available via API
2. **User Visits Page** → Fresh data fetched (no cache)
3. **User Returns to Tab** → Data refreshes automatically (on some pages)
4. **User Navigates** → Data refetches on route change
5. **User Changes Language** → Data refetches with new language

## Testing Real-Time Updates

### Test Steps:
1. Open your website in a browser
2. Open Sanity Studio in another tab
3. Add or edit content in Sanity
4. Publish the changes
5. Return to the website tab
6. Navigate to the page or refresh the page
7. Content should appear immediately

### Expected Behavior:
- ✅ New content appears without manual refresh (on navigation)
- ✅ Edited content updates immediately
- ✅ No stale cached data
- ✅ Fast loading despite no cache (due to `useCdn: false`)

## Performance Notes

- **No CDN Cache**: Content loads directly from Sanity API (fast API response)
- **Client-Side Caching**: React may cache component state, but data is fresh on mount
- **Network Optimization**: Sanity API is optimized for fast responses
- **Image Optimization**: Sanity CDN handles image optimization separately

## Limitations

Since all pages are client components (`"use client"`):
- Cannot use `export const revalidate = 0` (server component only)
- Data fetches on component mount, not on server render
- Requires navigation or tab focus to refresh (on some pages)

## Future Enhancements

For true real-time updates without navigation:
1. Implement Sanity Live Preview API
2. Use WebSocket connections for instant updates
3. Add manual refresh buttons
4. Implement polling mechanism (not recommended for performance)

## Troubleshooting

### Content not updating?
1. Check browser console for errors
2. Verify Sanity content is published (not draft)
3. Check network tab to see if requests are being made
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. Navigate away and back to the page

### Slow loading?
1. Check Sanity API response times
2. Verify `useCdn: false` is set (it is)
3. Check network conditions
4. Verify image sizes are optimized

## Configuration Files

- `sanity/lib/client.ts` - Main Sanity client configuration
- All page components in `app/[lang]/` - Individual page fetch calls
- `components/footer.tsx` - Footer component
- `lib/site-settings.ts` - Site settings utility
