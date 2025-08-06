import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const PTERO_API = 'ptla_1BcwiCCgwQ1lsdCoAxWmRpUxDRfE3HaM93cGmPAWNkg'
const PTERO_URL = 'https://panel.snowhost.cloud' // <-- غير هذا للرابط الصحيح

// بيانات الباقة
const MC_ULTIMATE = {
  price: 30,
  ram: 16384,
  disk: 160000,
  cpu: 600,
  egg: 1, // عدله حسب Pterodactyl
  location: 1, // عدله حسب موقعك في لوحة Pterodactyl
  dockerImage: 'ghcr.io/pterodactyl/yolks:java_17',
}

// تمثيل بيانات المستخدم (يفترض تكون جاية من قاعدة بيانات أو Session)
let userData = {
  currency: 'دولار',
  balance: 50.0,
  email: 'client@example.com',
  discordId: '123456789',
}

export async function POST(req: NextRequest) {
  if (userData.balance < MC_ULTIMATE.price) {
    return NextResponse.json(
      { success: false, message: 'رصيدك غير كافي.' },
      { status: 400 }
    )
  }

  const username = `user_${Math.floor(Math.random() * 100000)}`
  const password = uuidv4().slice(0, 12)
  const email = `u${Math.floor(Math.random() * 100000)}@mail.com`

  try {
    // إنشاء حساب في Pterodactyl
    const userRes = await axios.post(
      `${PTERO_URL}/api/application/users`,
      {
        username,
        email,
        first_name: 'Client',
        last_name: 'Snowhost',
      },
      {
        headers: {
          Authorization: `Bearer ${PTERO_API}`,
          'Content-Type': 'application/json',
          Accept: 'Application/vnd.pterodactyl.v1+json',
        },
      }
    )

    const userId = userRes.data.attributes.id

    // إنشاء السيرفر
    await axios.post(
      `${PTERO_URL}/api/application/servers`,
      {
        name: `${username}'s Minecraft Server`,
        user: userId,
        egg: MC_ULTIMATE.egg,
        docker_image: MC_ULTIMATE.dockerImage,
        startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar',
        environment: {
          SERVER_JARFILE: 'server.jar',
          SERVER_MEMORY: MC_ULTIMATE.ram.toString(),
        },
        limits: {
          memory: MC_ULTIMATE.ram,
          swap: 0,
          disk: MC_ULTIMATE.disk,
          io: 500,
          cpu: MC_ULTIMATE.cpu,
        },
        feature_limits: {
          databases: 1,
          backups: 1,
          allocations: 1,
        },
        allocation: {
          default: 1,
        },
        deploy: {
          locations: [MC_ULTIMATE.location],
          dedicated_ip: false,
          port_range: [],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PTERO_API}`,
          'Content-Type': 'application/json',
          Accept: 'Application/vnd.pterodactyl.v1+json',
        },
      }
    )

    // خصم الرصيد
    userData.balance -= MC_ULTIMATE.price

    return NextResponse.json({
      success: true,
      message: '✅ تم إنشاء الاستضافة بنجاح!',
      username,
      password,
      panelEmail: email,
      panelUrl: PTERO_URL,
    })
  } catch (error: any) {
    console.error(error?.response?.data || error.message)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إنشاء الاستضافة.' },
      { status: 500 }
    )
  }
}

