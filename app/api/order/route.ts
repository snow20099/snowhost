import express, { Request, Response } from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const PTERO_API = "ptla_1BcwiCCgwQ1lsdCoAxWmRpUxDRfE3HaM93cGmPAWNkg";
const PTERO_URL = "https://panel.snowhost.cloud"; // غيّر إلى رابط لوحتك
const PORT = 3000;

// بيانات وهمية للمستخدم (مثال)
interface UserData {
  currency: string;
  balance: number;
  email: string;
  discordId: string;
}

const userData: UserData = {
  currency: "دولار",
  balance: 50.00,
  email: "client@example.com",
  discordId: "123456789"
};

// باقة Minecraft Ultimate
const MC_ULTIMATE = {
  price: 30,
  ram: 16384,
  disk: 160000,
  cpu: 600,
  egg: 1,
  location: 1,
  dockerImage: "ghcr.io/pterodactyl/yolks:java_17"
};

app.post("/order-minecraft-ultimate", async (req: Request, res: Response) => {
  if (userData.balance < MC_ULTIMATE.price) {
    return res.status(400).json({ message: "رصيدك غير كافي لهذه الباقة." });
  }

  const username = `user_${Math.floor(Math.random() * 100000)}`;
  const password = uuidv4().slice(0, 12);
  const email = `u${Math.floor(Math.random() * 100000)}@mail.com`;

  try {
    // إنشاء المستخدم في Pterodactyl
    const userRes = await axios.post(`${PTERO_URL}/api/application/users`, {
      username,
      email,
      first_name: "Client",
      last_name: "Snowhost"
    }, {
      headers: {
        Authorization: `Bearer ${PTERO_API}`,
        "Content-Type": "application/json",
        Accept: "Application/vnd.pterodactyl.v1+json"
      }
    });

    const userId = userRes.data.attributes.id;

    // إنشاء السيرفر
    await axios.post(`${PTERO_URL}/api/application/servers`, {
      name: `${username}'s Minecraft Server`,
      user: userId,
      egg: MC_ULTIMATE.egg,
      docker_image: MC_ULTIMATE.dockerImage,
      startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar",
      environment: {
        SERVER_JARFILE: "server.jar",
        SERVER_MEMORY: MC_ULTIMATE.ram.toString()
      },
      limits: {
        memory: MC_ULTIMATE.ram,
        swap: 0,
        disk: MC_ULTIMATE.disk,
        io: 500,
        cpu: MC_ULTIMATE.cpu
      },
      feature_limits: {
        databases: 1,
        backups: 1,
        allocations: 1
      },
      allocation: {
        default: 1
      },
      deploy: {
        locations: [MC_ULTIMATE.location],
        dedicated_ip: false,
        port_range: []
      }
    }, {
      headers: {
        Authorization: `Bearer ${PTERO_API}`,
        "Content-Type": "application/json",
        Accept: "Application/vnd.pterodactyl.v1+json"
      }
    });

    // خصم السعر
    userData.balance -= MC_ULTIMATE.price;

    res.json({
      message: "✅ تم إنشاء استضافتك بنجاح!",
      username,
      password,
      panelEmail: email,
      panelUrl: PTERO_URL
    });

  } catch (error: any) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الاستضافة." });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️ السيرفر شغّال على http://localhost:${PORT}`);
});

