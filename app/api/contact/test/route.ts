import { NextResponse } from 'next/server'

/**
 * Test endpoint to check if SANITY_API_WRITE_TOKEN is configured
 * Access at: /api/contact/test
 */
export async function GET() {
  const hasToken = !!process.env.SANITY_API_WRITE_TOKEN
  const tokenLength = process.env.SANITY_API_WRITE_TOKEN?.length || 0
  const tokenPrefix = process.env.SANITY_API_WRITE_TOKEN?.substring(0, 5) || 'none'
  
  return NextResponse.json({
    configured: hasToken,
    tokenLength: tokenLength,
    tokenPrefix: hasToken ? `${tokenPrefix}...` : 'not set',
    message: hasToken 
      ? 'Token is configured correctly!' 
      : 'Token is NOT configured. Please add SANITY_API_WRITE_TOKEN to .env.local and restart the server.',
    instructions: [
      '1. Create/update .env.local in project root',
      '2. Add: SANITY_API_WRITE_TOKEN=your_token_here',
      '3. Restart development server (npm run dev)',
      '4. Visit this endpoint again to verify'
    ]
  })
}
