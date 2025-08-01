"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowRight, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PricingCalculator() {
  const [ram, setRam] = useState(8)
  const [cpu, setCpu] = useState(4)
  const [storage, setStorage] = useState(100)
  const [bandwidth, setBandwidth] = useState(2)
  const [ddosProtection, setDdosProtection] = useState(true)
  const [backups, setBackups] = useState(true)
  const [managedSupport, setManagedSupport] = useState(false)

  // Calculate price based on selected options
  const calculatePrice = () => {
    let price = 0

    // Base price for RAM
    price += ram * 2.5

    // Price for CPU
    price += cpu * 3

    // Price for storage
    price += storage * 0.1

    // Price for bandwidth
    price += bandwidth * 5

    // Add-ons
    if (ddosProtection) price += 10
    if (backups) price += 5
    if (managedSupport) price += 25

    return price.toFixed(2)
  }

  const totalPrice = calculatePrice()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Pricing Calculator</CardTitle>
              <CardDescription>Customize your server and see the price in real-time</CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white">${totalPrice}/month</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>RAM</Label>
              <span className="text-sm font-medium">{ram} GB</span>
            </div>
            <Slider
              value={[ram]}
              min={2}
              max={64}
              step={2}
              onValueChange={(value) => setRam(value[0])}
              className="[&>span:first-child]:bg-blue-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>CPU Cores</Label>
              <span className="text-sm font-medium">{cpu} Cores</span>
            </div>
            <Slider
              value={[cpu]}
              min={1}
              max={16}
              step={1}
              onValueChange={(value) => setCpu(value[0])}
              className="[&>span:first-child]:bg-blue-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Storage</Label>
              <span className="text-sm font-medium">{storage} GB SSD</span>
            </div>
            <Slider
              value={[storage]}
              min={25}
              max={1000}
              step={25}
              onValueChange={(value) => setStorage(value[0])}
              className="[&>span:first-child]:bg-blue-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Bandwidth</Label>
              <span className="text-sm font-medium">{bandwidth} TB</span>
            </div>
            <Slider
              value={[bandwidth]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setBandwidth(value[0])}
              className="[&>span:first-child]:bg-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="ddos-protection" checked={ddosProtection} onCheckedChange={setDdosProtection} />
              <Label htmlFor="ddos-protection" className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                DDoS Protection
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="backups" checked={backups} onCheckedChange={setBackups} />
              <Label htmlFor="backups" className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                Daily Backups
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="managed-support" checked={managedSupport} onCheckedChange={setManagedSupport} />
              <Label htmlFor="managed-support" className="flex items-center">
                <Headset className="h-4 w-4 mr-2 text-blue-600" />
                Managed Support
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <Link href="/signup">
              Get Started with This Configuration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}

function Headset(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
      <path d="M19 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
      <path d="M3 15v-3a9 9 0 0 1 18 0v3" />
    </svg>
  )
}

