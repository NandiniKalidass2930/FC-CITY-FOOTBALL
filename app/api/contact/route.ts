import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate and sanitize input
function validateInput(data: {
  name?: string
  email?: string
  subject?: string
  message?: string
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required')
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters long')
  }
  if (data.subject && data.subject.length > 200) {
    errors.push('Subject must be less than 200 characters')
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }
  if (data.message && data.message.length > 5000) {
    errors.push('Message must be less than 5000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if write token is configured
    const writeToken = process.env.SANITY_API_WRITE_TOKEN
    
    if (!writeToken || writeToken.trim() === '') {
      console.error('❌ SANITY_API_WRITE_TOKEN is not configured')
      console.error('📝 Please follow these steps:')
      console.error('   1. Open .env.local file in project root')
      console.error('   2. Add: SANITY_API_WRITE_TOKEN=your_token_here')
      console.error('   3. Get token from: https://sanity.io/manage → Your Project → API → Tokens')
      console.error('   4. Restart development server (stop and run npm run dev again)')
      
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'SANITY_API_WRITE_TOKEN is not configured. Please check SETUP_CONTACT_FORM.md for instructions.',
          hint: 'Visit /api/contact/test to verify your token configuration'
        },
        { status: 500 }
      )
    }
    
    // Log token status (without exposing the actual token)
    console.log('✅ SANITY_API_WRITE_TOKEN is configured (length:', writeToken.length, 'chars)')

    // Parse request body
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate input
    const validation = validateInput({ name, email, subject, message })
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Sanitize inputs (trim whitespace)
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }

    // Create document in Sanity
    const document = await writeClient.create({
      _type: 'contactMessage',
      ...sanitizedData,
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Contact message submitted successfully',
        id: document._id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error submitting contact form:', error)

    // Handle Sanity-specific errors
    if (error.statusCode === 401) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    if (error.statusCode === 400) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.message },
        { status: 400 }
      )
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
