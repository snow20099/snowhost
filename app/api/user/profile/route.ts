import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const secret = process.env.NEXTAUTH_SECRET!

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findOne({ email: token.email }).select('-password')
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      country: user.country || "",
      timezone: user.timezone || "",
      profileImage: user.profileImage || "/placeholder-user.jpg",
      balance: user.balance,
      currency: user.currency,
      accountType: user.accountType,
      servers: user.servers || [],
      invoices: user.invoices || [],
      resourceUsage: user.resourceUsage || {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        totalStorage: 500,
        totalMemory: 16,
        totalNetwork: 1000,
        lastUpdated: new Date()
      },
      preferences: user.preferences || {
        theme: 'system',
        language: 'ar',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      createdAt: user.createdAt
    })
  } catch (error) {
    console.error("Profile API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret })
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    await connectToDatabase()

    // تحضير البيانات للتحديث
    const updateData: any = {
      updatedAt: new Date()
    }

    // تحديث البيانات الأساسية إذا كانت موجودة
    if (body.name !== undefined) updateData.name = body.name
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.country !== undefined) updateData.country = body.country
    if (body.timezone !== undefined) updateData.timezone = body.timezone
    if (body.profileImage !== undefined) {
      updateData.profileImage = body.profileImage === null ? "/placeholder-user.jpg" : body.profileImage
    }

    // تحديث التفضيلات
    if (body.theme !== undefined) updateData['preferences.theme'] = body.theme
    if (body.language !== undefined) updateData['preferences.language'] = body.language
    
    // تحديث إعدادات الإشعارات إذا كانت موجودة
    if (body.notifications) {
      if (body.notifications.email !== undefined) {
        updateData['preferences.notifications.email'] = body.notifications.email
      }
      if (body.notifications.push !== undefined) {
        updateData['preferences.notifications.push'] = body.notifications.push
      }
      if (body.notifications.sms !== undefined) {
        updateData['preferences.notifications.sms'] = body.notifications.sms
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: token.email },
      { $set: updateData },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // إرجاع البيانات بنفس التنسيق المطلوب
    return NextResponse.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || "",
      country: updatedUser.country || "",
      timezone: updatedUser.timezone || "",
      profileImage: updatedUser.profileImage || "/placeholder-user.jpg",
      balance: updatedUser.balance,
      currency: updatedUser.currency,
      accountType: updatedUser.accountType,
      servers: updatedUser.servers || [],
      invoices: updatedUser.invoices || [],
      resourceUsage: updatedUser.resourceUsage || {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        totalStorage: 500,
        totalMemory: 16,
        totalNetwork: 1000,
        lastUpdated: new Date()
      },
      preferences: updatedUser.preferences || {
        theme: 'system',
        language: 'ar',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    })

  } catch (error) {
    console.error("Update Profile Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
