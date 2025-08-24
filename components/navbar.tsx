"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu, Server, Globe, Cpu, Shield } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeToggle from "@/components/theme-toggle"
import SearchDialog from "@/components/search-dialog"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { listenToProfileUpdates } from "@/utilities/events"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status, update: updateSession } = useSession()
  const [currentProfileImage, setCurrentProfileImage] = useState<string>("")
  const [currentUserName, setCurrentUserName] = useState<string>("")

  useEffect(() => {
    // تحميل البيانات المحفوظة عند البداية
    const savedImage = localStorage.getItem('profileImage')
    const savedProfile = localStorage.getItem('userProfile')
    
    if (savedImage && savedImage !== "/placeholder-user.jpg") {
      setCurrentProfileImage(savedImage)
    }
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      if (profile.name) {
        setCurrentUserName(profile.name)
      }
    }

    // الاستماع لتحديثات الملف الشخصي
    const unsubscribe = listenToProfileUpdates(async (data) => {
      if (data.image) {
        setCurrentProfileImage(data.image)
      }
      
      if (data.name) {
        setCurrentUserName(data.name)
      }
      
      // تحديث الجلسة مع البيانات الجديدة
      if (data.name || data.image) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: data.name || session?.user?.name,
            image: data.image !== "/placeholder-user.jpg" ? data.image : (data.image === "/placeholder-user.jpg" ? null : session?.user?.image)
          }
        })
      }
    })

    return unsubscribe
  }, [session, updateSession])

  // استخدام البيانات المحدثة في العرض
  const displayName = currentUserName || session?.user?.name || session?.user?.email
  const displayImage = currentProfileImage || session?.user?.image

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Server className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">SnowHost</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <ListItem
                      href="/services/gaming"
                      title="Gaming Hosting"
                      icon={<Server className="h-4 w-4 mr-2 text-blue-600" />}
                    >
                      Low-latency servers optimized for gaming with DDoS protection.
                    </ListItem>
                    <ListItem
                      href="/services/vps"
                      title="VPS Hosting"
                      icon={<Cpu className="h-4 w-4 mr-2 text-blue-600" />}
                    >
                      Virtual private servers with dedicated resources and full root access.
                    </ListItem>
                    <ListItem
                      href="/services/vds"
                      title="VDS Hosting"
                      icon={<Shield className="h-4 w-4 mr-2 text-blue-600" />}
                    >
                      Virtual dedicated servers with enhanced isolation and performance.
                    </ListItem>
                    <ListItem
                      href="/services/web"
                      title="Web Hosting"
                      icon={<Globe className="h-4 w-4 mr-2 text-blue-600" />}
                    >
                      Reliable web hosting with one-click installs and 99.9% uptime.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/features" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Features</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <SearchDialog />
          <ThemeToggle />
          {session ? (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={displayImage || undefined} 
                    alt={displayName || "User"} 
                  />
                  <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{displayName}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="flex w-full">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <Server className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-xl">SnowHost</span>
              </Link>
              <div className="flex items-center gap-2 mb-2">
                <SearchDialog />
                <ThemeToggle />
              </div>
              
              {/* إضافة معلومات المستخدم في القائمة الجانبية للموبايل */}
              {session && (
                <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-muted/30">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={displayImage || undefined} 
                      alt={displayName || "User"} 
                    />
                    <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col space-y-3 border-b border-border pb-4">
                  <h4 className="font-medium text-muted-foreground">Services</h4>
                  <Link href="/services/gaming" className="flex items-center text-sm" onClick={() => setIsOpen(false)}>
                    <Server className="h-4 w-4 mr-2 text-blue-600" />
                    Gaming Hosting
                  </Link>
                  <Link href="/services/vps" className="flex items-center text-sm" onClick={() => setIsOpen(false)}>
                    <Cpu className="h-4 w-4 mr-2 text-blue-600" />
                    VPS Hosting
                  </Link>
                  <Link href="/services/vds" className="flex items-center text-sm" onClick={() => setIsOpen(false)}>
                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                    VDS Hosting
                  </Link>
                  <Link href="/services/web" className="flex items-center text-sm" onClick={() => setIsOpen(false)}>
                    <Globe className="h-4 w-4 mr-2 text-blue-600" />
                    Web Hosting
                  </Link>
                </div>
                <Link href="/pricing" className="text-sm" onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>
                <Link href="/features" className="text-sm" onClick={() => setIsOpen(false)}>
                  Features
                </Link>
                <Link href="/about" className="text-sm" onClick={() => setIsOpen(false)}>
                  About
                </Link>
                <Link href="/contact" className="text-sm" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
              </div>
              
              <div className="flex flex-col gap-2 mt-auto">
                {session ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Settings</Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    icon?: React.ReactNode
    title: string
  }
>(({ className, title, icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
