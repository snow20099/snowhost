"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormStatus("idle")
        const form = e.target as HTMLFormElement
        form.reset()
      }, 3000)
    }, 1500)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        {/* Animated gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s" }}
        />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Get In Touch
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              Contact <span className="text-blue-600">SnowHost</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Have questions or need assistance? We're here to help. Reach out to our team and we'll get back to you as
              soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      disabled={formStatus !== "idle"}
                      className="bg-background/50 border-border/50 focus:border-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      required
                      disabled={formStatus !== "idle"}
                      className="bg-background/50 border-border/50 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    required
                    disabled={formStatus !== "idle"}
                    className="bg-background/50 border-border/50 focus:border-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    rows={6}
                    required
                    disabled={formStatus !== "idle"}
                    className="bg-background/50 border-border/50 focus:border-blue-600 min-h-[150px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  disabled={formStatus !== "idle"}
                >
                  {formStatus === "idle" && (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                  {formStatus === "submitting" && (
                    <>
                      <span>Sending...</span>
                      <div className="ml-2 flex space-x-1">
                        <div
                          className="h-2 w-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </>
                  )}
                  {formStatus === "success" && (
                    <>
                      Message Sent
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                  {formStatus === "error" && "Error Sending"}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  You can also reach us using the following contact information.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="p-3 rounded-full bg-blue-600/10 text-blue-600 mr-4">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">info@nexushost.com</p>
                      <p className="text-muted-foreground">support@nexushost.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-3 rounded-full bg-blue-600/10 text-blue-600 mr-4">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+1 (800) 123-4567</p>
                      <p className="text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-3 rounded-full bg-blue-600/10 text-blue-600 mr-4">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Headquarters</h3>
                      <p className="text-muted-foreground">123 Hosting Street</p>
                      <p className="text-muted-foreground">Server City, SC 10101</p>
                      <p className="text-muted-foreground">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Live Chat Support</h3>
                <p className="text-muted-foreground mb-6">Need immediate assistance? Chat with our support team now.</p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  onClick={() => {
                    // In a real app, this would open the chat widget
                    const chatButton = document.querySelector("[data-chat-button]") as HTMLButtonElement
                    if (chatButton) chatButton.click()
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Live Chat
                </Button>
              </div>

              <div className="mt-12 rounded-lg overflow-hidden h-[300px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.697149422113014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1648482801994!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SnowHost Headquarters Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Find answers to common questions about contacting and working with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How quickly will I receive a response to my inquiry?",
                answer:
                  "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, we recommend using our live chat support for immediate assistance.",
              },
              {
                question: "Do you offer phone support for all customers?",
                answer:
                  "Yes, phone support is available for all customers during our business hours (Monday to Friday, 9am-6pm EST). Premium support plans with extended hours are also available.",
              },
              {
                question: "Can I schedule a consultation with your team?",
                answer:
                  "You can schedule a consultation with our sales or technical team by filling out the contact form or emailing us directly at sales@nexushost.com.",
              },
              {
                question: "How do I report a technical issue with my service?",
                answer:
                  "The fastest way to report technical issues is through our support ticket system in your dashboard. For critical issues, you can also use our 24/7 live chat or emergency support line.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-600/10 to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Let's Connect
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Get Started?</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Contact us today to learn how SnowHost can help you with your hosting needs. Our team is ready to assist
              you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                Contact Us Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                onClick={() => {
                  // In a real app, this would open the chat widget
                  const chatButton = document.querySelector("[data-chat-button]") as HTMLButtonElement
                  if (chatButton) chatButton.click()
                }}
              >
                Start Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

