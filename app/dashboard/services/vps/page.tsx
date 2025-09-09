"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BadgeDollarSign, ShoppingCart } from "lucide-react"

const plans = [
  { name: "VPS Basic", memory: "8 GB", disk: "70 GB", cpu: "3 vCPU", transfer: "1 TB", duration: "30 days", price: "$10" },
  { name: "VPS Standard", memory: "16 GB", disk: "100 GB", cpu: "5 vCPU", transfer: "2 TB", duration: "30 days", price: "$19" },
  { name: "VPS Professional", memory: "32 GB", disk: "125 GB", cpu: "7 vCPU", transfer: "3 TB", duration: "30 days", price: "$30" },
  { name: "VPS Enterprise", memory: "48 GB", disk: "160 GB", cpu: "8 vCPU", transfer: "4 TB", duration: "30 days", price: "$40" },
  { name: "VPS Ultimate", memory: "64 GB", disk: "350 GB", cpu: "10 vCPU", transfer: "6 TB", duration: "30 days", price: "$60" },
]

export default function VPSPage() {
  return (
    <div className="w-full px-4 mt-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-white">VPS Hosting</h1>
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
                <div><span className="font-semibold ">Memory:</span> {plan.memory}</div>
                <div><span className="font-semibold ">Disk:</span> {plan.disk}</div>
                <div><span className="font-semibold ">CPU:</span> {plan.cpu}</div>
                <div><span className="font-semibold ">Transfer:</span> {plan.transfer}</div>
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