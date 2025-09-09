"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Server, Globe, Cpu, Shield, FileText, HelpCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

type SearchResult = {
  id: string
  title: string
  description: string
  url: string
  category: "service" | "page" | "doc" | "faq"
  icon: React.ReactNode
}

const searchResults: SearchResult[] = [
  {
    id: "gaming-hosting",
    title: "Gaming Hosting",
    description: "High-performance servers optimized for gaming with DDoS protection.",
    url: "/services/gaming",
    category: "service",
    icon: <Server className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "vps-hosting",
    title: "VPS Hosting",
    description: "Virtual private servers with dedicated resources and full root access.",
    url: "/services/vps",
    category: "service",
    icon: <Cpu className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "vds-hosting",
    title: "VDS Hosting",
    description: "Virtual dedicated servers with enhanced isolation and performance.",
    url: "/services/vds",
    category: "service",
    icon: <Shield className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "web-hosting",
    title: "Web Hosting",
    description: "Reliable web hosting with one-click installs and 99.9% uptime.",
    url: "/services/web",
    category: "service",
    icon: <Globe className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "View our transparent pricing plans for all hosting services.",
    url: "/pricing",
    category: "page",
    icon: <FileText className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "features",
    title: "Features",
    description: "Explore the powerful features of our hosting services.",
    url: "/features",
    category: "page",
    icon: <FileText className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "faq-uptime",
    title: "What is your uptime guarantee?",
    description: "We guarantee 99.9% uptime for all our hosting services.",
    url: "/faq#uptime",
    category: "faq",
    icon: <HelpCircle className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "faq-payment",
    title: "What payment methods do you accept?",
    description: "We accept all major credit cards, PayPal, and cryptocurrency payments.",
    url: "/faq#payment",
    category: "faq",
    icon: <HelpCircle className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "doc-getting-started",
    title: "Getting Started Guide",
    description: "Learn how to set up and configure your hosting service.",
    url: "/docs/getting-started",
    category: "doc",
    icon: <FileText className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "doc-server-management",
    title: "Server Management",
    description: "Learn how to manage and optimize your servers.",
    url: "/docs/server-management",
    category: "doc",
    icon: <FileText className="h-4 w-4 text-blue-600" />,
  },
]

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const filtered = searchResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()),
    )
    setResults(filtered)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you might want to navigate to a search results page
    // if there are no results or too many results
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-background/50 border-border/50"
        >
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for services, documentation, FAQs..."
              className="pl-10 bg-background/50 border-border/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        <div className="max-h-[300px] overflow-y-auto px-4 pb-4">
          <AnimatePresence>
            {results.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                {results.map((result) => (
                  <Link key={result.id} href={result.url} onClick={() => setOpen(false)} className="block">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors"
                    >
                      <div className="mt-px">{result.icon}</div>
                      <div>
                        <div className="font-medium">{result.title}</div>
                        <div className="text-sm text-muted-foreground">{result.description}</div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            ) : query ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center"
              >
                <p className="text-muted-foreground">No results found for "{query}"</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center"
              >
                <p className="text-muted-foreground">Type to start searching</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

