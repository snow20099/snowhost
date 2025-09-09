"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

const plans = [
  { name: "VDS Basic", memory: "16 GB", disk: "120 GB", cpu: "4 vCPU", transfer: "2 TB", duration: "30 days", price: "$25" },
  { name: "VDS Standard", memory: "32 GB", disk: "200 GB", cpu: "8 vCPU", transfer: "4 TB", duration: "30 days", price: "$45" },
  { name: "VDS Professional", memory: "64 GB", disk: "400 GB", cpu: "12 vCPU", transfer: "8 TB", duration: "30 days", price: "$80" },
  { name: "VDS Enterprise", memory: "128 GB", disk: "800 GB", cpu: "16 vCPU", transfer: "12 TB", duration: "30 days", price: "$140" },
]

export default function VDSPage() {
  return (
    <div className="w-full px-4 mt-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-white">VDS Hosting</h1>
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