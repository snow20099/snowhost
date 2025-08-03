"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

const plans = [
  { name: "Minecraft Basic", players: "10 Players", ram: "2 GB", disk: "20 GB", cpu: "2 vCPU", duration: "30 days", price: "$5" },
  { name: "Minecraft Standard", players: "30 Players", ram: "4 GB", disk: "40 GB", cpu: "3 vCPU", duration: "30 days", price: "$10" },
  { name: "Minecraft Pro", players: "60 Players", ram: "8 GB", disk: "80 GB", cpu: "4 vCPU", duration: "30 days", price: "$18" },
  { name: "Minecraft Ultimate", players: "Unlimited", ram: "16 GB", disk: "160 GB", cpu: "6 vCPU", duration: "30 days", price: "$30" },
]

const MinecraftLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <rect x="2" y="2" width="32" height="32" rx="6" fill="#5A7C16" stroke="#222" strokeWidth="2" />
    <rect x="7" y="7" width="8" height="8" rx="2" fill="#222" />
    <rect x="21" y="7" width="8" height="8" rx="2" fill="#222" />
    <rect x="13" y="19" width="10" height="6" rx="2" fill="#222" />
    <rect x="15" y="21" width="6" height="2" rx="1" fill="#5A7C16" />
  </svg>
)

export default function GamingPage() {
  return (
    <div className="w-full px-4 mt-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <MinecraftLogo />
        <h1 className="text-3xl font-bold text-white">Minecraft Hosting</h1>
      </div>
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <Card key={idx} className="bg-black border border-border/30 shadow-md rounded-xl flex flex-col p-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
              <div>
                <CardTitle className="text-lg mb-1">{plan.name}</CardTitle>
                <CardDescription className="">{plan.duration}</CardDescription>
              </div>
              <span className="bg-[#0e223a] border px-4 py-1 rounded font-bold text-lg">
                {plan.price}
              </span>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 px-6 pb-6">
              <div className="flex flex-col gap-2 text-sm">
                <div><span className="font-semibold ">Players:</span> {plan.players}</div>
                <div><span className="font-semibold ">RAM:</span> {plan.ram}</div>
                <div><span className="font-semibold ">Disk:</span> {plan.disk}</div>
                <div><span className="font-semibold ">CPU:</span> {plan.cpu}</div>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 px-6 py-2 rounded-lg shadow">
                  <ShoppingCart className="h-4 w-4" /> Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 