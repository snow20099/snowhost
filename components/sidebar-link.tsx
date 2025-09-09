"use client"

import { usePathname } from "next/navigation"

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

export function SidebarLink({ href, icon, children }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <a
      href={href}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </a>
  )
} 