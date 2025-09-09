import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking Pterodactyl account for email:', email)

    // Get Pterodactyl API configuration from environment
    const pterodactylUrl = process.env.PTERODACTYL_URL
    const pterodactylKey = process.env.PTERODACTYL_API_KEY

    if (!pterodactylUrl || !pterodactylKey) {
      console.error('❌ Pterodactyl configuration missing')
      return NextResponse.json(
        { error: 'Pterodactyl configuration not available' },
        { status: 500 }
      )
    }

    // Search for existing user by email
    const searchUrl = `${pterodactylUrl}/api/application/users?filter[email]=${encodeURIComponent(email)}`
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${pterodactylKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('❌ Failed to search Pterodactyl users:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to search Pterodactyl users' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('🔍 Pterodactyl search response:', data)

    // Check if user exists
    if (data.data && data.data.length > 0) {
      const existingUser = data.data[0]
      console.log('✅ Found existing Pterodactyl user:', existingUser.attributes)

      return NextResponse.json({
        exists: true,
        userId: existingUser.attributes.id,
        username: existingUser.attributes.username,
        email: existingUser.attributes.email,
        firstName: existingUser.attributes.first_name,
        lastName: existingUser.attributes.last_name,
        panelUrl: `${pterodactylUrl}/auth/login`
      })
    } else {
      console.log('ℹ️ No existing Pterodactyl user found for email:', email)
      return NextResponse.json({
        exists: false
      })
    }

  } catch (error) {
    console.error('❌ Error checking Pterodactyl account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 