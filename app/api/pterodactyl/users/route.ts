import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

// Pterodactyl Configuration
const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// GET: Check if Pterodactyl user account exists
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    // Check if user already has a Pterodactyl account in MongoDB
    await connectToDatabase()
    const user = await User.findOne({ email: token.email })
    
    if (user?.pterodactylAccount?.userId) {
      return NextResponse.json({
        exists: true,
        account: user.pterodactylAccount,
        message: "لديك حساب Pterodactyl موجود بالفعل"
      })
    }

    // Check if user exists in Pterodactyl
    try {
      const response = await fetch(`${PTERODACTYL_URL}/api/application/users?filter[email]=${encodeURIComponent(token.email)}`, {
        headers: {
          'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        if (userData.data && userData.data.length > 0) {
          const pterodactylUser = userData.data[0]
          
          // Save to MongoDB if not already saved
          if (user && !user.pterodactylAccount?.userId) {
            user.pterodactylAccount = {
              userId: pterodactylUser.id,
              username: pterodactylUser.attributes.username,
              email: pterodactylUser.attributes.email,
              password: '', // We don't store the password from Pterodactyl
              panelUrl: `${PTERODACTYL_URL}/auth/login`,
              createdAt: new Date(),
              lastUsed: new Date()
            }
            await user.save()
          }

          return NextResponse.json({
            exists: true,
            account: {
              userId: pterodactylUser.id,
              username: pterodactylUser.attributes.username,
              email: pterodactylUser.attributes.email,
              panelUrl: `${PTERODACTYL_URL}/auth/login`
            },
            message: "تم العثور على حساب Pterodactyl موجود"
          })
        }
      }
    } catch (error) {
      console.error('Error checking Pterodactyl user:', error)
    }

    return NextResponse.json({
      exists: false,
      message: "لم يتم العثور على حساب Pterodactyl"
    })

  } catch (error) {
    console.error('Error checking Pterodactyl user:', error)
    return NextResponse.json({ 
      error: "خطأ في فحص حساب Pterodactyl" 
    }, { status: 500 })
  }
}

// POST: Create user account in Pterodactyl
export async function POST(req: NextRequest) {
  try {
    // Allow creation without authentication for new user registration
    const token = await getToken({ req, secret })
    const isNewUser = !token?.email // If no token, it's a new user registration
    
    const { username, first_name, last_name, email, password } = await req.json()

    if (!username || !first_name || !last_name || !email || !password) {
      return NextResponse.json({ 
        error: "جميع الحقول مطلوبة: username, first_name, last_name, email, password" 
      }, { status: 400 })
    }

    console.log('Creating Pterodactyl user for:', email)
    console.log('Pterodactyl URL:', PTERODACTYL_URL)
    console.log('API Key:', PTERODACTYL_API_KEY ? 'Present' : 'Missing')
    console.log('User data:', { username, first_name, last_name, email, password: password ? '***' : 'empty' })
    console.log('Is new user registration:', isNewUser)

    // Check if user already has a Pterodactyl account
    await connectToDatabase()
    const user = await User.findOne({ email: token?.email || email }) // Use token email or new user email
    
    if (user?.pterodactylAccount?.userId) {
      return NextResponse.json({
        success: true,
        user: user.pterodactylAccount,
        message: "لديك حساب Pterodactyl موجود بالفعل",
        isExisting: true,
        credentials: {
          email: user.pterodactylAccount.email,
          password: user.pterodactylAccount.password,
          panelUrl: user.pterodactylAccount.panelUrl
        }
      })
    }

    // Use the password provided by the user instead of generating a random one
    const pterodactylPassword = password

    // Create user in Pterodactyl
    const requestData = {
      username: username || token?.email?.split('@')[0] || email.split('@')[0], // Use token email or new user email
      email: email || token?.email || email.split('@')[0] + '@pterodactyl.test', // Use token email or new user email
      first_name: first_name || token?.name?.split(' ')[0] || 'User',
      last_name: last_name || token?.name?.split(' ').slice(1).join(' ') || 'Account',
      password: pterodactylPassword, // Use user's password
      root_admin: false, // Regular user, not admin
      language: 'en'
    }

    const response = await fetch(`${PTERODACTYL_URL}/api/application/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    console.log(`Pterodactyl API response status: ${response.status}`)
    console.log(`Pterodactyl API response ok: ${response.ok}`)

    if (!response.ok) {
      const errorData = await response.json()
      console.log(`Pterodactyl API error response:`, errorData)
      
      // If user already exists, try to get their info
      if (response.status === 422 && errorData.errors?.[0]?.detail?.includes('already exists')) {
        console.log(`User ${email} already exists in Pterodactyl, fetching info...`)
        
        // Get existing user info
        const getUserResponse = await fetch(`${PTERODACTYL_URL}/api/application/users?filter[email]=${encodeURIComponent(email)}`, {
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Accept': 'application/json'
          }
        })

        if (getUserResponse.ok) {
          const userInfo = await getUserResponse.json()
          if (userInfo.data && userInfo.data.length > 0) {
            const pterodactylUser = userInfo.data[0]
            
            // Save to MongoDB
            if (user) {
              user.pterodactylAccount = {
                userId: pterodactylUser.id,
                username: pterodactylUser.attributes.username,
                email: pterodactylUser.attributes.email,
                password: pterodactylPassword, // Store the generated password
                panelUrl: `${PTERODACTYL_URL}/auth/login`,
                createdAt: new Date(),
                lastUsed: new Date()
              }
              await user.save()
            }

            return NextResponse.json({
              success: true,
              user: pterodactylUser,
              message: "المستخدم موجود بالفعل في Pterodactyl",
              isExisting: true,
              credentials: {
                email: pterodactylUser.attributes.email,
                password: pterodactylPassword,
                panelUrl: `${PTERODACTYL_URL}/auth/login`
              }
            })
          }
        }
      }
      
      const errorMessage = `Pterodactyl API error: ${errorData.errors?.[0]?.detail || response.statusText}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    const responseData = await response.json()
    console.log('Pterodactyl API response data:', responseData)
    
    // Handle both response structures (with and without 'data' wrapper)
    let userData = responseData
    if (responseData.data) {
      userData = responseData.data
    }
    
    console.log('Processed user data:', userData)
    console.log('User ID from attributes:', userData?.attributes?.id)

    // Validate response structure
    if (!userData || !userData.attributes?.id) {
      console.error('Invalid Pterodactyl API response structure:', responseData)
      throw new Error('استجابة Pterodactyl API غير صحيحة - معرف المستخدم مفقود')
    }

    // Save to MongoDB
    if (user) {
      user.pterodactylAccount = {
        userId: userData.attributes.id,
        username: userData.attributes.username || username,
        email: userData.attributes.email || email,
        password: pterodactylPassword,
        panelUrl: `${PTERODACTYL_URL}/auth/login`,
        createdAt: new Date(),
        lastUsed: new Date()
      }
      // Also save username to main user document
      user.username = userData.attributes.username || username
      await user.save()
      console.log('Saved Pterodactyl account to MongoDB:', user.pterodactylAccount)
    }

    console.log(`Successfully created Pterodactyl user: ${email}`)

    return NextResponse.json({
      success: true,
      user: {
        id: userData.attributes.id,
        username: userData.attributes.username,
        email: userData.attributes.email
      },
      message: "تم إنشاء حساب Pterodactyl بنجاح",
      isExisting: false,
      credentials: {
        email: userData.attributes.email,
        password: pterodactylPassword,
        panelUrl: `${PTERODACTYL_URL}/auth/login`
      }
    })

  } catch (error) {
    console.error('Create Pterodactyl User Error:', error)
    return NextResponse.json({ 
      error: "فشل في إنشاء حساب Pterodactyl",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 