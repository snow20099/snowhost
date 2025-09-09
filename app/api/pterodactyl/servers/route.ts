import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production"

// Pterodactyl Configuration
const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// GET: Get all servers from Pterodactyl
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    // Check if Pterodactyl is configured
    if (!PTERODACTYL_API_KEY || !PTERODACTYL_URL) {
      console.warn("Pterodactyl not configured, returning empty server list")
      return NextResponse.json({
        success: true,
        servers: [],
        total: 0,
        message: "Pterodactyl غير مثبت - سيتم عرض الخوادم بعد التثبيت"
      })
    }

    // Get servers from Pterodactyl
    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers`, {
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Pterodactyl API endpoint not found - check if panel is running")
        return NextResponse.json({
          success: true,
          servers: [],
          total: 0,
          message: "Pterodactyl Panel غير متاح - تأكد من تشغيل الخادم"
        })
      }
      throw new Error(`Pterodactyl API error: ${response.status}`)
    }

    const servers = await response.json()
    
    // Get user's Pterodactyl user ID from MongoDB by username
    await connectToDatabase()
    const user = await User.findOne({ username: token.username || token.name })
    const pterodactylUserId = user?.pterodactylAccount?.userId
    
    // Filter servers for the current user only
    let userServers = []
    if (pterodactylUserId) {
      userServers = servers.data.filter((server: any) => {
        return server.attributes.user === pterodactylUserId
      })
      console.log(`Found ${userServers.length} servers for user ${pterodactylUserId} (${token.username || token.name})`)
    } else {
      console.log('No Pterodactyl account found for username:', token.username || token.name)
      userServers = []
    }

    return NextResponse.json({
      success: true,
      servers: userServers,
      total: userServers.length,
      userPterodactylId: pterodactylUserId
    })

  } catch (error) {
    console.error("Pterodactyl API Error:", error)
    
    // Return empty list instead of error for better UX
    return NextResponse.json({
      success: true,
      servers: [],
      total: 0,
      message: "خطأ في الاتصال مع Pterodactyl - تأكد من الإعدادات"
    })
  }
}

// POST: Create a new server in Pterodactyl
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    
    if (!token?.email) {
      return NextResponse.json({ error: "غير مصرح - يرجى تسجيل الدخول مرة أخرى" }, { status: 401 })
    }

    // فحص أن Pterodactyl مثبت
    if (!PTERODACTYL_API_KEY || !PTERODACTYL_URL) {
      console.error('❌ Pterodactyl not configured')
      return NextResponse.json({ 
        error: "Pterodactyl غير مثبت - يرجى إعداد الخادم أولاً" 
      }, { status: 500 })
    }
    
    // فحص أن API Key صحيح
    if (PTERODACTYL_API_KEY === 'ptla_qbqI0lLV4WQiHIPRAb9UVkVXPazZ9fst5MajCSyr1LJ') {
      console.warn('⚠️ Using default API key - this might cause issues')
    }
    
    // فحص أن URL صحيح
    if (!PTERODACTYL_URL.endsWith('/')) {
      console.warn('⚠️ Pterodactyl URL should end with /')
    }

    const body = await req.json()
    console.log('📥 Request body:', JSON.stringify(body, null, 2))
    
    // فحص أن البيانات المطلوبة موجودة
    const { name, description, plan, price, limits } = body
    
    if (!name || !plan) {
      console.error('❌ Missing required fields:', { name, plan })
      return NextResponse.json({ 
        error: "البيانات المطلوبة غير مكتملة - يرجى التأكد من اسم الخادم والخطة" 
      }, { status: 400 })
    }
    
    // فحص أن limits صحيحة
    if (!limits || typeof limits !== 'object') {
      console.error('❌ Invalid limits:', limits)
      return NextResponse.json({ 
        error: "حدود الموارد غير صحيحة" 
      }, { status: 400 })
    }
    
    // فحص القيم الفردية
    if (!limits.memory || !limits.disk || !limits.cpu) {
      console.error('❌ Missing required limits:', limits)
      return NextResponse.json({ 
        error: "الحدود المطلوبة غير مكتملة (memory, disk, cpu)" 
      }, { status: 400 })
    }
    
    console.log('✅ Required fields validation passed')
    console.log('✅ Limits validation passed:', limits)

    // Set default values for Pterodactyl
    const egg = "1" // Minecraft Java egg (as string)
    const docker_image = "ghcr.io/pterodactyl/games:java"
    const startup = "java -Xms128M -Xmx2048M -jar server.jar"
    const feature_limits = {
      databases: 0,
      allocations: 1,
      backups: 0
    }

    // Get user ID from MongoDB (faster than searching Pterodactyl)
    let userId: number | null = null
    
    try {
      await connectToDatabase()
      const user = await User.findOne({ email: token.email })
      
      if (user?.pterodactylAccount?.userId) {
        userId = user.pterodactylAccount.userId
        console.log(`Found Pterodactyl user ID from MongoDB: ${userId} for email: ${token.email}`)
      } else {
        // Fallback: search in Pterodactyl if not found in MongoDB
        console.log('User not found in MongoDB, searching Pterodactyl...')
        const userResponse = await fetch(`${PTERODACTYL_URL}/api/application/users?filter[email]=${encodeURIComponent(token.email)}`, {
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Accept': 'application/json'
          }
        })

        console.log('Pterodactyl user search response status:', userResponse.status)
        console.log('Pterodactyl user search response ok:', userResponse.ok)

        if (userResponse.ok) {
          const userData = await userResponse.json()
          console.log('Pterodactyl user search response data:', userData)
          
          if (userData.data && userData.data.length > 0) {
            const pterodactylUser = userData.data[0]
            console.log('Found Pterodactyl user:', pterodactylUser)
            console.log('User ID from response:', pterodactylUser.id)
            console.log('User attributes:', pterodactylUser.attributes)
            
            // Handle both response structures (with and without 'data' wrapper)
            let actualUserId = pterodactylUser.id
            if (pterodactylUser.attributes && pterodactylUser.attributes.id) {
              actualUserId = pterodactylUser.attributes.id
            }
            
            if (actualUserId) {
              userId = actualUserId
              console.log(`Found Pterodactyl user ID from API: ${userId} for email: ${token.email}`)
            } else {
              console.error('User ID not found in Pterodactyl response:', pterodactylUser)
            }
          } else {
            console.log('No users found in Pterodactyl response')
          }
        } else {
          console.error('Pterodactyl user search failed:', userResponse.status, userResponse.statusText)
        }
      }
    } catch (error) {
      console.error('Error getting user ID:', error)
    }

    if (!userId) {
      console.error('No valid user ID found for email:', token.email)
      return NextResponse.json({ 
        error: "لم يتم العثور على معرف مستخدم صحيح في Pterodactyl - يرجى إنشاء الحساب أولاً",
        details: "User ID is undefined or null"
      }, { status: 400 })
    }
    
    // فحص أن user ID صحيح
    if (typeof userId !== 'number' || userId <= 0) {
      console.error('❌ Invalid user ID:', userId)
      throw new Error('معرف المستخدم غير صحيح')
    }
    
    console.log('✅ User ID validation passed:', userId)
    console.log('Proceeding with server creation using user ID:', userId)

    // Get available allocations from Pterodactyl
    let allocationId: number | null = null
    
    try {
      // First try to get allocations from the node
      const nodeResponse = await fetch(`${PTERODACTYL_URL}/api/application/nodes`, {
        headers: {
          'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
          'Accept': 'application/json'
        }
      })

      if (nodeResponse.ok) {
        const nodeData = await nodeResponse.json()
        console.log('Available nodes:', nodeData)
        
        if (nodeData.data && nodeData.data.length > 0) {
          const firstNode = nodeData.data[0]
          console.log('First node object:', firstNode)
          console.log('First node id (direct):', firstNode.id)
          console.log('First node attributes.id:', firstNode.attributes?.id)
          
          // Extract node ID from attributes or direct id
          let firstNodeId: number | null = null
          if (firstNode.attributes?.id) {
            firstNodeId = firstNode.attributes.id
          } else if (firstNode.id) {
            firstNodeId = firstNode.id
          }
          
          if (firstNodeId) {
            console.log('Using first node ID:', firstNodeId)
            
            // Get allocations from the first node
            const allocationResponse = await fetch(`${PTERODACTYL_URL}/api/application/nodes/${firstNodeId}/allocations`, {
              headers: {
                'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
                'Accept': 'application/json'
              }
            })

            if (allocationResponse.ok) {
              const allocationData = await allocationResponse.json()
              console.log('Available allocations from node:', allocationData)
              
              if (allocationData.data && allocationData.data.length > 0) {
                console.log('First allocation object:', allocationData.data[0])
                console.log('First allocation id (direct):', allocationData.data[0].id)
                console.log('First allocation attributes.id:', allocationData.data[0].attributes?.id)
                
                // Find an available allocation (not assigned to any server)
                const availableAllocation = allocationData.data.find((alloc: any) => !alloc.attributes.assigned)
                if (availableAllocation) {
                  // Extract allocation ID from attributes or direct id
                  if (availableAllocation.attributes?.id) {
                    allocationId = availableAllocation.attributes.id
                  } else if (availableAllocation.id) {
                    allocationId = availableAllocation.id
                  }
                  console.log('Selected available allocation ID:', allocationId)
                } else {
                  console.log('No available allocations found, using first allocation')
                  // Extract allocation ID from first allocation
                  if (allocationData.data[0].attributes?.id) {
                    allocationId = allocationData.data[0].attributes.id
                  } else if (allocationData.data[0].id) {
                    allocationId = allocationData.data[0].id
                  }
                  console.log('Using first allocation ID:', allocationId)
                }
              }
            } else {
              console.error('Failed to fetch allocations:', allocationResponse.status, allocationResponse.statusText)
            }
          } else {
            console.error('Could not extract node ID from first node:', firstNode)
          }
        }
      } else {
        console.error('Failed to fetch nodes:', nodeResponse.status, nodeResponse.statusText)
      }
    } catch (error) {
      console.error('Error fetching allocations:', error)
    }

    if (!allocationId) {
      console.warn('No allocation ID found, using default allocation ID 1')
      // Pterodactyl requires allocation.default, so we'll use a default value
      allocationId = 1
    }
    
    // فحص أن allocation ID صحيح
    if (typeof allocationId !== 'number' || allocationId <= 0) {
      console.error('❌ Invalid allocation ID:', allocationId)
      throw new Error('معرف التخصيص غير صحيح')
    }
    
    console.log('✅ Allocation ID validation passed:', allocationId)

    // Create server in Pterodactyl
    const serverData: any = {
      name,
      description: description || `Gaming server for ${token.email}`,
      user: userId, // This makes the user the server owner
      egg: parseInt(egg),
      docker_image,
      startup,
      environment: {
        // Required Minecraft Java variables
        SERVER_JARFILE: "server.jar",
        STARTUP: "java -Xms128M -Xmx2048M -jar server.jar",
        BUILD_NUMBER: "latest",
        MINECRAFT_VERSION: "1.20.4",
        // Additional Minecraft variables
        EULA: "true",
        SERVER_IP: "0.0.0.0",
        SERVER_PORT: "25565",
        MAX_PLAYERS: "20",
        VIEW_DISTANCE: "10",
        SPAWN_PROTECTION: "16",
        // Override with any custom environment variables
      },
      limits: {
        memory: limits?.memory || 512,
        swap: limits?.swap || 0,
        disk: limits?.disk || 1024,
        io: limits?.io || 500,
        cpu: limits?.cpu || 100
      },
      feature_limits: feature_limits || {
        databases: 0,
        allocations: 1,
        backups: 0
      },
      allocation: {
        default: allocationId
      },
      // إضافة هذا الحقل لجعل الخادم يبدأ تلقائياً بعد الإنشاء
      start_on_completion: true
    }

    console.log('Server will be created with allocation:', allocationId)
    console.log('🚀 Server will start automatically after creation (start_on_completion: true)')
    console.log('Creating server with data:', JSON.stringify(serverData, null, 2))
    console.log('User ID being used:', userId)
    console.log('Pterodactyl URL:', PTERODACTYL_URL)
    console.log('API Key present:', !!PTERODACTYL_API_KEY)
    
    // فحص أن البيانات صحيحة قبل الإرسال
    if (!serverData.name || !serverData.user || !serverData.egg || !serverData.allocation.default) {
      console.error('❌ Invalid server data before sending:', {
        name: serverData.name,
        user: serverData.user,
        egg: serverData.egg,
        allocation: serverData.allocation
      })
      throw new Error('بيانات الخادم غير صحيحة قبل الإرسال')
    }
    
    console.log('✅ Server data validation passed')

    const response = await fetch(`${PTERODACTYL_URL}/api/application/servers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(serverData)
    })

    console.log('📡 Pterodactyl response status:', response.status)
    console.log('📡 Pterodactyl response ok:', response.ok)
    console.log('📡 Pterodactyl response headers:', Object.fromEntries(response.headers.entries()))
    
    // فحص أن الاستجابة ليست redirect
    if (response.redirected) {
      console.warn('⚠️ Response was redirected:', response.url)
    }

    if (!response.ok) {
      // فحص نوع المحتوى أولاً
      const contentType = response.headers.get('content-type')
      console.log('📡 Response content-type:', contentType)
      
      let errorData: any = {}
      let errorText = ''
      
      try {
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json()
          console.error('❌ Pterodactyl server creation error (JSON):', errorData)
        } else {
          // إذا كان HTML، نقرأ النص أولاً
          errorText = await response.text()
          console.error('❌ Pterodactyl server creation error (HTML):', errorText.substring(0, 500))
          
          // نحاول استخراج رسالة الخطأ من HTML
          if (errorText.includes('<title>')) {
            const titleMatch = errorText.match(/<title[^>]*>([^<]+)<\/title>/i)
            if (titleMatch) {
              errorData = { error: titleMatch[1] }
            }
          }
          
          if (!errorData.error) {
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
          }
        }
      } catch (parseError) {
        console.error('❌ Error parsing response:', parseError)
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
      }
      
      throw new Error(`Pterodactyl API error: ${errorData.error || errorData.errors?.[0]?.detail || response.statusText}`)
    }

    const newServer = await response.json()
    
    console.log('📡 Pterodactyl response:', JSON.stringify(newServer, null, 2))
    
    // فحص أن البيانات موجودة وصحيحة - Pterodactyl يعيد البيانات في attributes
    if (!newServer || !newServer.attributes || !newServer.attributes.id) {
      console.error('❌ Invalid response from Pterodactyl:', newServer)
      throw new Error('استجابة غير صحيحة من Pterodactyl - لم يتم إنشاء الخادم')
    }
    
    console.log('✅ Server created successfully in Pterodactyl with ID:', newServer.attributes.id)
    console.log('📊 Server details:', {
      id: newServer.attributes.id,
      name: newServer.attributes.name,
      status: newServer.attributes.status,
      uuid: newServer.attributes.uuid,
      identifier: newServer.attributes.identifier
    })

    // حفظ الخادم في MongoDB
    try {
      console.log('🔄 Starting MongoDB save process...')
      await connectToDatabase()
      console.log('✅ Database connected successfully')
      
      // البحث عن المستخدم
      const user = await User.findOne({ email: token.email })
      console.log('🔍 User found in MongoDB:', user ? 'YES' : 'NO')
      
      if (user) {
        console.log('📝 Creating server data object...')
        // إنشاء كائن الخادم - استخدام attributes بدلاً من data
        const serverData = {
          id: newServer.attributes.id.toString(), // تحويل إلى String
          pterodactylId: newServer.attributes.id,
          name: name,
          plan: plan, // String فقط - اسم الخطة
          price: price || 0, // Number
          specs: {  // المواصفات في specs
            ram: limits?.memory || 512,
            disk: limits?.disk || 1024,
            cpu: limits?.cpu || 100
          },
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          // إضافة التواريخ المطلوبة
          expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 يوم من الآن
          autoRenewal: false, // تجديد تلقائي معطل افتراضياً
          lastBillingDate: new Date(), // تاريخ آخر فاتورة
          nextBillingDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // تاريخ الفاتورة القادمة
          isExpired: false, // لم تنته الصلاحية بعد
          daysUntilExpiry: 30 // 30 يوم متبقية
        }
        
        console.log('📊 Server data object created:', JSON.stringify(serverData, null, 2))
        
        // فحص أن البيانات صحيحة قبل الحفظ
        if (!serverData.id || !serverData.name) {
          console.error('❌ Invalid server data:', serverData)
          throw new Error('بيانات الخادم غير صحيحة')
        }
        
        // إضافة الخادم للمستخدم
        const updateResult = await User.findOneAndUpdate(
          { email: token.email },
          { $push: { servers: serverData } },
          { new: true }
        )
        
        if (!updateResult) {
          console.error('❌ Failed to update user with server data')
          throw new Error('فشل في حفظ بيانات الخادم في قاعدة البيانات')
        }
        
        console.log('✅ Server added to MongoDB successfully')
        console.log('📈 User now has servers count:', updateResult?.servers?.length || 0)
        
        // فحص أن الخادم تم إضافته بنجاح
        const addedServer = updateResult.servers[updateResult.servers.length - 1]
        if (addedServer) {
          console.log('🎯 Latest server added:', {
            id: addedServer.id,
            name: addedServer.name,
            plan: addedServer.plan,
            price: addedServer.price,
            status: addedServer.status
          })
        }
        
        // تحديث معلومات الخادم (IP، الموقع)
        try {
          console.log('🔄 Updating server information...')
          // الحصول على معلومات الخادم من Pterodactyl
          const serverInfoResponse = await fetch(`${PTERODACTYL_URL}/api/application/servers/${newServer.attributes.id}`, {
            headers: {
              'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
              'Accept': 'application/json'
            }
          })
          
          if (serverInfoResponse.ok) {
            const serverInfo = await serverInfoResponse.json()
            console.log('📡 Server info from Pterodactyl:', serverInfo.attributes?.id)
            
            // فحص أن البيانات صحيحة - Pterodactyl يعيد البيانات في attributes
            if (!serverInfo || !serverInfo.attributes || !serverInfo.attributes.id) {
              console.warn('⚠️ Invalid server info response:', serverInfo)
            } else {
              // تحديث معلومات الخادم في MongoDB
              const updateData: any = {
                'servers.$.ip': serverInfo.attributes.relationships?.allocations?.data?.[0]?.attributes?.ip || 'pending',
                'servers.$.location': serverInfo.attributes.relationships?.node?.data?.attributes?.location || 'auto',
                'servers.$.port': serverInfo.attributes.relationships?.allocations?.data?.[0]?.attributes?.port || 25565
              }
              
              console.log('🔄 Updating server details in MongoDB:', updateData)
              
              await User.findOneAndUpdate(
                { 
                  email: token.email,
                  'servers.id': newServer.attributes.id.toString() // تحويل إلى String
                },
                { $set: updateData }
              )
              
              console.log('✅ Server information updated in MongoDB')
            }
          } else {
            console.warn('⚠️ Failed to fetch server info:', serverInfoResponse.status, serverInfoResponse.statusText)
          }
        } catch (error) {
          console.error('❌ Error updating server information:', error)
          // لا نوقف العملية إذا فشل تحديث المعلومات
        }
        
        console.log('🎉 MongoDB save process completed successfully!')
        console.log('🚀 Server creation process completed successfully!')
        console.log('📋 Summary:', {
          pterodactylId: newServer.attributes.id,
          name: newServer.attributes.name,
          status: newServer.attributes.status,
          user: token.email,
          plan: plan,
          price: price,
          mongoDBId: addedServer?.id
        })
        
        // إرجاع response نجاح
        return NextResponse.json({
          success: true,
          server: {
            id: newServer.attributes.id,
            name: newServer.attributes.name,
            status: newServer.attributes.status,
            plan: plan,
            price: price,
            mongoDBId: addedServer?.id
          },
          message: "تم إنشاء الخادم بنجاح"
        })
      } else {
        console.error('❌ User not found in MongoDB for email:', token.email)
        return NextResponse.json({ 
          error: "لم يتم العثور على المستخدم في قاعدة البيانات" 
        }, { status: 404 })
      }
    } catch (error) {
      console.error('❌ Error saving server to MongoDB:', error)
      console.error('❌ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      
      // إرجاع response خطأ مع تفاصيل
      return NextResponse.json({ 
        error: "فشل في حفظ بيانات الخادم في قاعدة البيانات",
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
      }, { status: 500 })
    }

    // إرجاع response نجاح (في حالة عدم وجود أخطاء)
    return NextResponse.json({
      success: true,
      server: {
        id: newServer.attributes.id,
        name: newServer.attributes.name,
        status: newServer.attributes.status,
        plan: plan,
        price: price
      },
      message: "تم إنشاء الخادم بنجاح"
    })

  } catch (error) {
    console.error("Create Server Error:", error)
    return NextResponse.json({ 
      error: "فشل في إنشاء الخادم", 
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'خطأ غير معروف' : undefined
    }, { status: 500 })
  }
} 