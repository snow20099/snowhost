"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Globe } from "lucide-react"

const plans = [
  { name: "Web Basic", sites: "1 Site", storage: "10 GB SSD", bandwidth: "100 GB", email: "5 Emails", duration: "30 days", price: "$3" },
  { name: "Web Standard", sites: "5 Sites", storage: "30 GB SSD", bandwidth: "500 GB", email: "20 Emails", duration: "30 days", price: "$7" },
  { name: "Web Pro", sites: "Unlimited", storage: "100 GB SSD", bandwidth: "2 TB", email: "Unlimited", duration: "30 days", price: "$15" },
]

export default function WebHostingPage() {
  return (
    <div className="w-full px-4 mt-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Globe className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">Web Hosting</h1>
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
                <div><span className="font-semibold ">Sites:</span> {plan.sites}</div>
                <div><span className="font-semibold ">Storage:</span> {plan.storage}</div>
                <div><span className="font-semibold ">Bandwidth:</span> {plan.bandwidth}</div>
                <div><span className="font-semibold ">Email:</span> {plan.email}</div>
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