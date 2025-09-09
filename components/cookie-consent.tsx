"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type CookieCategory = "necessary" | "functional" | "analytics" | "marketing"
type CookiePreferences = Record<CookieCategory, boolean>

export default function CookieConsent() {
  const [cookieConsent, setCookieConsent] = useState<"custom" | "full" | "necessary" | "pending" | "minimized">(
    "pending",
  )
  const [isVisible, setIsVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (consent) {
      setCookieConsent(consent as "custom" | "full" | "necessary" | "minimized")

      // Load saved preferences if they exist
      const savedPrefs = localStorage.getItem("cookie-preferences")
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs))
        } catch (e) {
          console.error("Error parsing cookie preferences", e)
        }
      }

      if (consent === "minimized") {
        setIsVisible(true)
      }
    } else {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    const allEnabled: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }

    localStorage.setItem("cookie-consent", "full")
    localStorage.setItem("cookie-preferences", JSON.stringify(allEnabled))
    setPreferences(allEnabled)
    setCookieConsent("full")
    setIsVisible(false)
    setDialogOpen(false)
  }

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }

    localStorage.setItem("cookie-consent", "necessary")
    localStorage.setItem("cookie-preferences", JSON.stringify(necessaryOnly))
    setPreferences(necessaryOnly)
    setCookieConsent("necessary")
    setIsVisible(false)
    setDialogOpen(false)
  }

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", "custom")
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences))
    setCookieConsent("custom")
    setIsVisible(false)
    setDialogOpen(false)
  }

  const minimize = () => {
    localStorage.setItem("cookie-consent", "minimized")
    setCookieConsent("minimized")
    setIsVisible(true)
    setDialogOpen(false)
  }

  const handlePreferenceChange = (category: CookieCategory, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: checked,
    }))
  }

  if (cookieConsent === "full" || cookieConsent === "necessary" || cookieConsent === "custom") {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg" size="icon">
                <Cookie className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Cookie className="h-5 w-5 text-blue-600 mr-2" />
                  Cookie Preferences
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
                  traffic. Select which cookies you want to allow.
                </p>

                <div className="space-y-3 border rounded-lg p-3">
                  <div className="flex items-start space-x-3 pb-2">
                    <Checkbox id="necessary" checked disabled />
                    <div className="grid gap-1.5">
                      <Label htmlFor="necessary" className="font-medium">
                        Necessary Cookies
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        These cookies are essential for the website to function properly and cannot be disabled.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pb-2">
                    <Checkbox
                      id="functional"
                      checked={preferences.functional}
                      onCheckedChange={(checked) => handlePreferenceChange("functional", checked === true)}
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="functional" className="font-medium">
                        Functional Cookies
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        These cookies enable personalized features and functionality.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pb-2">
                    <Checkbox
                      id="analytics"
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => handlePreferenceChange("analytics", checked === true)}
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="analytics" className="font-medium">
                        Analytics Cookies
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        These cookies help us understand how visitors interact with our website.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketing"
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => handlePreferenceChange("marketing", checked === true)}
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="marketing" className="font-medium">
                        Marketing Cookies
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        These cookies are used to track visitors across websites to display relevant advertisements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-background/50 border-border/50 rounded-full"
                    onClick={acceptNecessary}
                  >
                    Necessary Only
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-background/50 border-border/50 rounded-full"
                    onClick={savePreferences}
                  >
                    Save Preferences
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full" onClick={acceptAll}>
                    Accept All
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

