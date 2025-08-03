"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("gaming")

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Transparent Pricing
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Choose the perfect plan for your needs with our flexible pricing options. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tabs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="gaming" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="gaming">Gaming</TabsTrigger>
                <TabsTrigger value="vps">VPS</TabsTrigger>
                <TabsTrigger value="vds">VDS</TabsTrigger>
                <TabsTrigger value="web">Web</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="gaming" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[0,1,2].map((i) => (
                  <motion.div
                    key={i}
                    animate={activeTab === "gaming" ? { y: -20, scale: 1.05, boxShadow: "0 8px 32px rgba(59,130,246,0.15)" } : { y: 0, scale: 1, boxShadow: "none" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    {i === 0 && (
                      <PricingCard
                        title="Starter"
                        price="$4.99"
                        description="Perfect for small gaming communities and casual players."
                        features={[
                          { name: "2GB RAM", included: true },
                          { name: "20GB SSD Storage", included: true },
                          { name: "Up to 10 Players", included: true },
                          { name: "Basic DDoS Protection", included: true },
                          { name: "Daily Backups", included: true },
                          { name: "24/7 Support", included: true },
                          { name: "Mod Support", included: false },
                          { name: "Custom Domain", included: false },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                    {i === 1 && (
                      <PricingCard
                        title="Pro"
                        price="$12.99"
                        description="Ideal for medium-sized communities with moderate traffic."
                        features={[
                          { name: "8GB RAM", included: true },
                          { name: "50GB SSD Storage", included: true },
                          { name: "Up to 50 Players", included: true },
                          { name: "Advanced DDoS Protection", included: true },
                          { name: "Hourly Backups", included: true },
                          { name: "Priority Support", included: true },
                          { name: "Mod Support", included: true },
                          { name: "Custom Domain", included: false },
                        ]}
                        buttonText="Get Started"
                        popular={true}
                      />
                    )}
                    {i === 2 && (
                      <PricingCard
                        title="Ultimate"
                        price="$24.99"
                        description="For large gaming communities requiring maximum performance."
                        features={[
                          { name: "16GB RAM", included: true },
                          { name: "100GB SSD Storage", included: true },
                          { name: "Unlimited Players", included: true },
                          { name: "Premium DDoS Protection", included: true },
                          { name: "Real-time Backups", included: true },
                          { name: "24/7 Priority Support", included: true },
                          { name: "Advanced Mod Support", included: true },
                          { name: "Custom Domain", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vps" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[0,1,2].map((i) => (
                  <motion.div
                    key={i}
                    animate={activeTab === "vps" ? { y: -20, scale: 1.05, boxShadow: "0 8px 32px rgba(59,130,246,0.15)" } : { y: 0, scale: 1, boxShadow: "none" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    {i === 0 && (
                      <PricingCard
                        title="Basic VPS"
                        price="$9.99"
                        description="Entry-level VPS for personal projects and development."
                        features={[
                          { name: "1 vCPU Core", included: true },
                          { name: "2GB RAM", included: true },
                          { name: "40GB SSD Storage", included: true },
                          { name: "1TB Bandwidth", included: true },
                          { name: "Basic DDoS Protection", included: true },
                          { name: "Weekly Backups", included: true },
                          { name: "Root Access", included: true },
                          { name: "Dedicated IP", included: false },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                    {i === 1 && (
                      <PricingCard
                        title="Business VPS"
                        price="$19.99"
                        description="Powerful VPS for business applications and websites."
                        features={[
                          { name: "2 vCPU Cores", included: true },
                          { name: "4GB RAM", included: true },
                          { name: "80GB SSD Storage", included: true },
                          { name: "2TB Bandwidth", included: true },
                          { name: "Advanced DDoS Protection", included: true },
                          { name: "Daily Backups", included: true },
                          { name: "Root Access", included: true },
                          { name: "Dedicated IP", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={true}
                      />
                    )}
                    {i === 2 && (
                      <PricingCard
                        title="Premium VPS"
                        price="$39.99"
                        description="High-performance VPS for resource-intensive applications."
                        features={[
                          { name: "4 vCPU Cores", included: true },
                          { name: "8GB RAM", included: true },
                          { name: "160GB SSD Storage", included: true },
                          { name: "5TB Bandwidth", included: true },
                          { name: "Premium DDoS Protection", included: true },
                          { name: "Hourly Backups", included: true },
                          { name: "Root Access", included: true },
                          { name: "Dedicated IP", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vds" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[0,1,2].map((i) => (
                  <motion.div
                    key={i}
                    animate={activeTab === "vds" ? { y: -20, scale: 1.05, boxShadow: "0 8px 32px rgba(59,130,246,0.15)" } : { y: 0, scale: 1, boxShadow: "none" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    {i === 0 && (
                      <PricingCard
                        title="Standard VDS"
                        price="$29.99"
                        description="Entry-level virtual dedicated server for small businesses."
                        features={[
                          { name: "2 Dedicated Cores", included: true },
                          { name: "4GB RAM", included: true },
                          { name: "100GB SSD Storage", included: true },
                          { name: "3TB Bandwidth", included: true },
                          { name: "Advanced DDoS Protection", included: true },
                          { name: "Daily Backups", included: true },
                          { name: "Full Root Access", included: true },
                          { name: "Dedicated IP", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                    {i === 1 && (
                      <PricingCard
                        title="Professional VDS"
                        price="$49.99"
                        description="Powerful VDS for businesses requiring enhanced performance."
                        features={[
                          { name: "4 Dedicated Cores", included: true },
                          { name: "8GB RAM", included: true },
                          { name: "200GB SSD Storage", included: true },
                          { name: "5TB Bandwidth", included: true },
                          { name: "Premium DDoS Protection", included: true },
                          { name: "Hourly Backups", included: true },
                          { name: "Full Root Access", included: true },
                          { name: "Multiple Dedicated IPs", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={true}
                      />
                    )}
                    {i === 2 && (
                      <PricingCard
                        title="Enterprise VDS"
                        price="$89.99"
                        description="High-performance VDS for enterprise applications."
                        features={[
                          { name: "8 Dedicated Cores", included: true },
                          { name: "16GB RAM", included: true },
                          { name: "400GB SSD Storage", included: true },
                          { name: "10TB Bandwidth", included: true },
                          { name: "Enterprise DDoS Protection", included: true },
                          { name: "Real-time Backups", included: true },
                          { name: "Full Root Access", included: true },
                          { name: "Multiple Dedicated IPs", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="web" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[0,1,2].map((i) => (
                  <motion.div
                    key={i}
                    animate={activeTab === "web" ? { y: -20, scale: 1.05, boxShadow: "0 8px 32px rgba(59,130,246,0.15)" } : { y: 0, scale: 1, boxShadow: "none" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    {i === 0 && (
                      <PricingCard
                        title="Basic Web"
                        price="$3.99"
                        description="Affordable web hosting for personal websites and blogs."
                        features={[
                          { name: "1 Website", included: true },
                          { name: "10GB SSD Storage", included: true },
                          { name: "Unmetered Bandwidth", included: true },
                          { name: "Free SSL Certificate", included: true },
                          { name: "Daily Backups", included: true },
                          { name: "24/7 Support", included: true },
                          { name: "One-Click Installs", included: true },
                          { name: "Free Domain", included: false },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                    {i === 1 && (
                      <PricingCard
                        title="Plus Web"
                        price="$7.99"
                        description="Enhanced web hosting for multiple websites and businesses."
                        features={[
                          { name: "Unlimited Websites", included: true },
                          { name: "30GB SSD Storage", included: true },
                          { name: "Unmetered Bandwidth", included: true },
                          { name: "Free SSL Certificate", included: true },
                          { name: "Daily Backups", included: true },
                          { name: "Priority Support", included: true },
                          { name: "One-Click Installs", included: true },
                          { name: "Free Domain", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={true}
                      />
                    )}
                    {i === 2 && (
                      <PricingCard
                        title="Pro Web"
                        price="$14.99"
                        description="Professional web hosting for high-traffic websites."
                        features={[
                          { name: "Unlimited Websites", included: true },
                          { name: "100GB SSD Storage", included: true },
                          { name: "Unmetered Bandwidth", included: true },
                          { name: "Free SSL Certificate", included: true },
                          { name: "Real-time Backups", included: true },
                          { name: "24/7 Priority Support", included: true },
                          { name: "One-Click Installs", included: true },
                          { name: "Free Domain + Privacy", included: true },
                        ]}
                        buttonText="Get Started"
                        popular={false}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-black/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Find answers to common questions about our hosting services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FaqCard
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum."
            />
            <FaqCard
              question="Do you offer a money-back guarantee?"
              answer="Yes, we offer a 30-day money-back guarantee on all our hosting plans. If you're not satisfied, we'll provide a full refund."
            />
            <FaqCard
              question="How quickly will my server be set up?"
              answer="Most servers are set up instantly after payment confirmation. VDS servers may take up to 2 hours for provisioning."
            />
            <FaqCard
              question="Can I upgrade my plan later?"
              answer="Yes, you can easily upgrade your plan at any time through your control panel. The price difference will be prorated and charged to your account."
            />
            <FaqCard
              question="Do you provide technical support?"
              answer="Yes, we offer 24/7 technical support via live chat, email, and ticket system for all our hosting plans."
            />
            <FaqCard
              question="What is your uptime guarantee?"
              answer="We guarantee 99.9% uptime for all our hosting services. If we fail to meet this, you'll receive credit on your account."
            />
            <FaqCard
              question="Can I host multiple websites on one plan?"
              answer="Yes, our web hosting plans allow for multiple websites. VPS and VDS plans can host as many websites as the resources allow."
            />
            <FaqCard
              question="Do you offer DDoS protection?"
              answer="Yes, all our hosting plans include DDoS protection, with higher tier plans offering more advanced protection."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Get Started?</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Choose your plan and start hosting with us today. No hidden fees, no long-term contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/pricing">View All Plans</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  popular,
}: {
  title: string
  price: string
  description: string
  features: { name: string; included: boolean }[]
  buttonText: string
  popular: boolean
}) {
  return (
    <Card
      className={`relative overflow-hidden ${popular ? "border-blue-600 shadow-lg shadow-blue-600/10" : "border-border/50"}`}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">Most Popular</div>
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              {feature.included ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground mr-2" />
              )}
              <span className={`text-sm ${!feature.included ? "text-muted-foreground" : ""}`}>{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full rounded-full ${popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`} asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  )
}

