import { NextRequest, NextResponse } from "next/server"

// PATCH: Update user password in Pterodactyl
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { password } = await req.json()
    
    if (!password) {
      return NextResponse.json({ 
        error: "كلمة المرور مطلوبة" 
      }, { status: 400 })
    }

    const { id: userId } = await params
    console.log('🔄 Updating Pterodactyl user password:', userId)

    // Pterodactyl Configuration
    const PTERODACTYL_URL = process.env.PTERODACTYL_URL || ""
    const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || ""

    // First, get user details from Pterodactyl to get email
    const getUserResponse = await fetch(`${PTERODACTYL_URL}/api/application/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Accept': 'application/json'
      }
    })

    if (!getUserResponse.ok) {
      console.error('❌ Failed to get user details from Pterodactyl:', getUserResponse.status)
      return NextResponse.json({ 
        error: "فشل في الحصول على تفاصيل المستخدم من Pterodactyl" 
      }, { status: getUserResponse.status })
    }

    const userDetails = await getUserResponse.json()
    const userEmail = userDetails.attributes?.email
    const userUsername = userDetails.attributes?.username
    const userFirstName = userDetails.attributes?.first_name
    const userLastName = userDetails.attributes?.last_name

    console.log('🔍 User details from Pterodactyl:', {
      userId: userId,
      email: userEmail,
      username: userUsername,
      first_name: userFirstName,
      last_name: userLastName,
      allAttributes: userDetails.attributes
    });

    if (!userEmail) {
      console.error('❌ User email not found in Pterodactyl response')
      return NextResponse.json({ 
        error: "لم يتم العثور على بريد المستخدم في Pterodactyl" 
      }, { status: 400 })
    }

    if (!userUsername) {
      console.error('❌ User username not found in Pterodactyl response')
      return NextResponse.json({ 
        error: "لم يتم العثور على اسم المستخدم في Pterodactyl" 
      }, { status: 400 })
    }

    if (!userFirstName) {
      console.error('❌ User first name not found in Pterodactyl response')
      return NextResponse.json({ 
        error: "لم يتم العثور على الاسم الأول في Pterodactyl" 
      }, { status: 400 })
    }

    // Update user password in Pterodactyl (include all required fields)
    const updateData = {
      email: userEmail, // Include email as it's required by Pterodactyl
      username: userUsername, // Include username as it's required by Pterodactyl
      first_name: userFirstName, // Include first name as it's required by Pterodactyl
      last_name: userLastName || '', // Include last name (can be empty)
      password: password
    };
    
    console.log('🔄 Sending update data to Pterodactyl:', {
      userId: userId,
      email: userEmail,
      username: userUsername,
      first_name: userFirstName,
      last_name: userLastName || '',
      password: '***' // Hide password in logs
    });

    const response = await fetch(`${PTERODACTYL_URL}/api/application/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Failed to update Pterodactyl password:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      })
      
      return NextResponse.json({ 
        error: "فشل في تحديث كلمة المرور في Pterodactyl" 
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('✅ Pterodactyl password updated successfully:', data)

    return NextResponse.json({ 
      message: "تم تحديث كلمة المرور بنجاح",
      data: data
    })

  } catch (error) {
    console.error('❌ Error updating Pterodactyl password:', error)
    return NextResponse.json({ 
      error: "خطأ في تحديث كلمة المرور" 
    }, { status: 500 })
  }
} 