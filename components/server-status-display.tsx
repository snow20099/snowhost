"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

type ServerLocation = {
  id: string;
  name: string;
  status: "operational" | "degraded" | "maintenance";
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
      console.error("Error fetching server status:", error);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // يحدث كل 10 ثواني
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Server Status</h3>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {serverLocations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <div className="flex items-center mt-2">
                      <StatusBadge status={location.status} />
                      <span className="text-xs text-muted-foreground ml-2">
                        {location.ping !== null ? `${location.ping}ms` : "N/A"}
                      </span>
                    </div>
                  </div>
                  <StatusIcon status={location.status} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          Operational
        </Badge>
      );
    case "degraded":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          Degraded
        </Badge>
      );
    case "maintenance":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Maintenance
        </Badge>
      );
    default:
      return null;
  }
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "degraded":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "maintenance":
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return null;
  }
}
