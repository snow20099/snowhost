export const runtime = "nodejs"; // مهم: يحدد إن هذا API يستخدم Node.js runtime

import { NextResponse } from "next/server";
import ping from "ping";

const servers = [
  { id: "us-west", name: "US West (Los Angeles)", ip: "23.214.210.134" },
  { id: "dubai", name: "Dubai (Abu Dhabi)", ip: "5.53.103.255" },
  { id: "eu-central", name: "EU Central (Frankfurt)", ip: "31.57.112.217" },
  { id: "asia-east", name: "Asia East (Tokyo)", ip: "175.41.238.135" },
];

export async function GET() {
  const results = await Promise.all(
    servers.map(async (server) => {
      try {
        const res = await ping.promise.probe(server.ip, { timeout: 5 });
        return {
          ...server,
          status: res.alive ? "operational" : "maintenance",
          ping: res.time !== "unknown" ? parseFloat(res.time) : null,
        };
      } catch {
        return { ...server, status: "maintenance", ping: null };
      }
    })
  );

  return NextResponse.json(results);
}

