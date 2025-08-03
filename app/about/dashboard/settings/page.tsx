"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function SettingsPage() {
  const [profilePic, setProfilePic] = useState("/placeholder-user.jpg")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("ps_xx")
  const [email] = useState("medabouomar02@outlook.com")
  const [phone, setPhone] = useState("")

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col items-center gap-4 md:col-span-2">
              <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-600" />
              <div className="flex gap-2">
                <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">Upload New Photo</Button>
                <Button type="button" variant="outline">Reset</Button>
              </div>
              <span className="text-xs text-muted-foreground">JPG, PNG, or GIF. Max size 800KB.</span>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Username</label>
              <Input value={username} onChange={e => setUsername(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Email Address</label>
              <Input value={email} disabled className="w-full bg-muted" />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">First Name</label>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Last Name</label>
              <Input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 font-medium">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="w-full" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 