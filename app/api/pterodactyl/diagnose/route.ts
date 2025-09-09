import { NextRequest, NextResponse } from "next/server"

// Pterodactyl Configuration
const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// GET: Comprehensive Pterodactyl diagnosis
export async function GET(req: NextRequest) {
  try {
    console.log(`🔍 Starting comprehensive Pterodactyl diagnosis for: ${PTERODACTYL_URL}`)
    
    const diagnosis: any = {
      timestamp: new Date().toISOString(),
      url: PTERODACTYL_URL,
      apiKey: {
        present: !!PTERODACTYL_API_KEY,
        length: PTERODACTYL_API_KEY?.length || 0,
        startsWith: PTERODACTYL_API_KEY?.substring(0, 5) || 'N/A'
      },
      tests: {}
    }

    // Test 1: Basic connectivity
    console.log('📡 Testing basic connectivity...')
    try {
      const basicResponse = await fetch(`${PTERODACTYL_URL}`, {
        method: 'GET',
        headers: { 'Accept': 'text/html,application/json' }
      })
      
      diagnosis.tests.basicConnectivity = {
        status: basicResponse.status,
        ok: basicResponse.ok,
        statusText: basicResponse.statusText,
        headers: Object.fromEntries(basicResponse.headers.entries())
      }

      if (basicResponse.ok) {
        const htmlContent = await basicResponse.text()
        diagnosis.tests.basicConnectivity.htmlLength = htmlContent.length
        diagnosis.tests.basicConnectivity.htmlPreview = htmlContent.substring(0, 1000)
        
        // Check for Pterodactyl indicators
        const indicators = {
          pterodactyl: htmlContent.toLowerCase().includes('pterodactyl'),
          panel: htmlContent.toLowerCase().includes('panel'),
          server: htmlContent.toLowerCase().includes('server'),
          minecraft: htmlContent.toLowerCase().includes('minecraft'),
          admin: htmlContent.toLowerCase().includes('admin'),
          dashboard: htmlContent.toLowerCase().includes('dashboard')
        }
        diagnosis.tests.basicConnectivity.indicators = indicators
      }
    } catch (error) {
      diagnosis.tests.basicConnectivity.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Test 2: API endpoint discovery
    console.log('🔍 Discovering API endpoints...')
    const apiEndpoints = [
      '/api/application/users',
      '/api/application/servers',
      '/api/application/nodes',
      '/api/application/eggs',
      '/api/application',
      '/api/users',
      '/api/servers',
      '/api/nodes',
      '/api/eggs',
      '/api',
      '/admin/api/users',
      '/admin/api/servers',
      '/admin/users',
      '/admin/servers',
      '/panel/api/users',
      '/panel/api/servers',
      '/panel/users',
      '/panel/servers',
      '/v1/users',
      '/v1/servers',
      '/v1/nodes'
    ]

    diagnosis.tests.apiEndpoints = {}
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(`${PTERODACTYL_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Accept': 'application/json,text/html'
          }
        })

        diagnosis.tests.apiEndpoints[endpoint] = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        }

        if (response.ok) {
          try {
            const data = await response.json()
            diagnosis.tests.apiEndpoints[endpoint].data = data
            diagnosis.tests.apiEndpoints[endpoint].isJson = true
            diagnosis.tests.apiEndpoints[endpoint].dataKeys = Object.keys(data)
          } catch (e) {
            try {
              const textData = await response.text()
              diagnosis.tests.apiEndpoints[endpoint].data = textData.substring(0, 300)
              diagnosis.tests.apiEndpoints[endpoint].isJson = false
            } catch (e2) {
              diagnosis.tests.apiEndpoints[endpoint].data = 'Could not read response'
            }
          }
        }
      } catch (error) {
        diagnosis.tests.apiEndpoints[endpoint] = {
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'ERROR'
        }
      }
    }

    // Test 3: Working endpoints analysis
    console.log('✅ Analyzing working endpoints...')
    const workingEndpoints = Object.entries(diagnosis.tests.apiEndpoints)
      .filter(([_, result]) => {
        const typedResult = result as any
        return typedResult.ok && typedResult.status === 200
      })
      .map(([endpoint, _]) => endpoint)

    diagnosis.tests.workingEndpoints = workingEndpoints

    // Test 4: Pterodactyl detection
    console.log('🎯 Detecting Pterodactyl...')
    let isPterodactyl = false
    let detectedStructure = null

    for (const endpoint of workingEndpoints) {
      const result = diagnosis.tests.apiEndpoints[endpoint] as any
      if (result && result.isJson && result.data) {
        const data = result.data
        
        // Check for Pterodactyl data structure
        if (data.data || data.meta || data.links || 
            (Array.isArray(data) && data.length > 0) ||
            (data.users || data.servers || data.nodes)) {
          isPterodactyl = true
          detectedStructure = {
            endpoint: endpoint,
            structure: Object.keys(data),
            hasData: !!data.data,
            hasMeta: !!data.meta,
            hasLinks: !!data.links,
            isArray: Array.isArray(data),
            arrayLength: Array.isArray(data) ? data.length : 0
          }
          break
        }
      }
    }

    diagnosis.tests.pterodactylDetection = {
      isPterodactyl,
      detectedStructure,
      confidence: isPterodactyl ? 'HIGH' : 'LOW'
    }

    // Test 5: Environment check
    console.log('🔧 Checking environment configuration...')
    diagnosis.tests.environment = {
      nodeEnv: process.env.NODE_ENV,
      pterodactylUrl: process.env.PTERODACTYL_URL,
      pterodactylApiKey: process.env.PTERODACTYL_API_KEY ? 'Present' : 'Missing',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
      mongodbUri: process.env.MONGODB_URI ? 'Present' : 'Missing'
    }

    // Generate recommendations
    console.log('💡 Generating recommendations...')
    const recommendations = []

    if (!isPterodactyl) {
      recommendations.push('Pterodactyl panel not detected - check installation')
    }

    if (workingEndpoints.length === 0) {
      recommendations.push('No working API endpoints found - check API key and permissions')
    }

    if (!PTERODACTYL_API_KEY) {
      recommendations.push('PTERODACTYL_API_KEY environment variable is missing')
    }

    if (workingEndpoints.length > 0 && !workingEndpoints.some(e => e.includes('users'))) {
      recommendations.push('User management endpoint not found - check API structure')
    }

    if (workingEndpoints.length > 0 && !workingEndpoints.some(e => e.includes('servers'))) {
      recommendations.push('Server management endpoint not found - check API structure')
    }

    diagnosis.recommendations = recommendations
    diagnosis.summary = {
      status: isPterodactyl ? 'READY' : 'NOT_READY',
      workingEndpoints: workingEndpoints.length,
      totalEndpoints: apiEndpoints.length,
      isPterodactyl,
      hasApiKey: !!PTERODACTYL_API_KEY
    }

    console.log('✅ Diagnosis completed successfully')
    console.log('📊 Summary:', diagnosis.summary)

    return NextResponse.json({
      success: true,
      message: "تم إكمال التشخيص الشامل",
      diagnosis
    })

  } catch (error) {
    console.error('❌ Diagnosis failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير معروف',
      message: "فشل في إكمال التشخيص"
    }, { status: 500 })
  }
} 