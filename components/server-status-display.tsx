"use client";

import { useState, useEffect } from "react";

type ServerLocation = {
  id: string;
  name: string;
  status: "operational" | "maintenance";
  ping: number | null;
};

export default function ServerStatusDisplay() {
  const [serverLocations, setServerLocations] = useState<ServerLocation[]>([]);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/ping");
      const data = await res.json();
      setServerLocations(data);
    } catch (error) {
      console.error("Failed to fetch ping data:", error);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // كل 10 ثواني
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Server Status</h2>
      <ul>
        {serverLocations.map((server) => (
          <li key={server.id}>
            {server.name} - Status: {server.status} - Ping:{" "}
            {server.ping !== null ? `${server.ping} ms` : "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}
