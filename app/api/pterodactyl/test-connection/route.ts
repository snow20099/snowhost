import { NextRequest, NextResponse } from "next/server"

// Pterodactyl Configuration
const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

// GET: Test Pterodactyl connection and discover API endpoints
export async function GET(req: NextRequest) {
  try {
    console.log(`Testing Pterodactyl connection to: ${PTERODACTYL_URL}`)
    console.log(`Using API Key: ${PTERODACTYL_API_KEY ? 'Present' : 'Missing'}`)

    // Test 1: Basic connection and check HTML content
    const basicResponse = await fetch(`${PTERODACTYL_URL}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/json'
      }
    })

    console.log(`Basic connection status: ${basicResponse.status}`)
    
    let htmlContent = ''
    let isPterodactylFromHTML = false
    
    if (basicResponse.ok) {
      try {
        htmlContent = await basicResponse.text()
        
        // Check if it's Pterodactyl by looking for common indicators
        isPterodactylFromHTML = htmlContent.includes('Pterodactyl') || 
                                htmlContent.includes('pterodactyl') ||
                                htmlContent.includes('panel') ||
                                htmlContent.includes('server') ||
                                htmlContent.includes('minecraft')
        
        console.log(`HTML contains Pterodactyl indicators: ${isPterodactylFromHTML}`)
        console.log(`HTML length: ${htmlContent.length}`)
        console.log(`HTML preview: ${htmlContent.substring(0, 500)}...`)
      } catch (e) {
        console.log('Could not read HTML content')
      }
    }

    // Test 2: Try different API endpoints with more variations
    const endpoints = [
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
      '/panel/servers'
    ]

    const results: any = {
      url: PTERODACTYL_URL,
      apiKeyPresent: !!PTERODACTYL_API_KEY,
      basicConnection: basicResponse.status,
      htmlContentLength: htmlContent.length,
      isPterodactylFromHTML: isPterodactylFromHTML,
      endpoints: {}
    }

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${PTERODACTYL_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Accept': 'application/json,text/html'
          }
        })

        results.endpoints[endpoint] = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          contentType: response.headers.get('content-type')
        }

        if (response.ok) {
          try {
            const data = await response.json()
            results.endpoints[endpoint].data = data
            results.endpoints[endpoint].isJson = true
          } catch (e) {
            try {
              const textData = await response.text()
              results.endpoints[endpoint].data = textData.substring(0, 200) + '...'
              results.endpoints[endpoint].isJson = false
            } catch (e2) {
              results.endpoints[endpoint].data = 'Could not read response'
            }
          }
        }
      } catch (error) {
        results.endpoints[endpoint] = {
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'ERROR'
        }
      }
    }

    // Test 3: Check if it's actually Pterodactyl by trying multiple approaches
    let isPterodactyl = false
    let panelInfo = null
    let workingEndpoints: string[] = []

    // Check which endpoints work
    for (const [endpoint, result] of Object.entries(results.endpoints)) {
      if (result && typeof result === 'object' && 'ok' in result && result.ok && 'status' in result && result.status === 200) {
        workingEndpoints.push(endpoint)
      }
    }

    // Try to get panel info from working endpoints
    for (const endpoint of workingEndpoints) {
      try {
        const panelResponse = await fetch(`${PTERODACTYL_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
            'Accept': 'application/json'
          }
        })

        if (panelResponse.ok) {
          try {
            const panelData = await panelResponse.json()
            
            // Check if response looks like Pterodactyl
            if (panelData.data || panelData.meta || panelData.links || 
                (Array.isArray(panelData) && panelData.length > 0)) {
              isPterodactyl = true
              panelInfo = {
                endpoint: endpoint,
                data: panelData
              }
              break
            }
          } catch (e) {
            // Not JSON, continue
          }
        }
      } catch (error) {
        // Continue to next endpoint
      }
    }

    // Test 4: Try to get server info from working endpoints
    let serversTest = null
    for (const endpoint of workingEndpoints) {
      if (endpoint.includes('servers')) {
        try {
          const serverResponse = await fetch(`${PTERODACTYL_URL}${endpoint}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
              'Accept': 'application/json'
            }
          })

          if (serverResponse.ok) {
            try {
              const serverData = await serverResponse.json()
              serversTest = {
                endpoint: endpoint,
                status: serverResponse.status,
                count: serverData.data?.length || serverData.length || 0,
                sample: serverData.data?.[0] || serverData[0] || null,
                structure: Object.keys(serverData)
              }
              break
            } catch (e) {
              serversTest = {
                endpoint: endpoint,
                status: serverResponse.status,
                error: 'Non-JSON response'
              }
            }
          }
        } catch (error) {
          // Continue to next endpoint
        }
      }
    }

    results.isPterodactyl = isPterodactyl
    results.panelInfo = panelInfo
    results.workingEndpoints = workingEndpoints
    results.serversTest = serversTest

    console.log('Pterodactyl connection test results:', JSON.stringify(results, null, 2))

    return NextResponse.json({
      success: true,
      message: "تم اختبار الاتصال بـ Pterodactyl",
      results
    })

  } catch (error) {
    console.error('Pterodactyl connection test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير معروف',
      message: "فشل في اختبار الاتصال بـ Pterodactyl"
    }, { status: 500 })
  }
} 