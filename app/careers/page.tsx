"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Briefcase, MapPin, Clock, Zap, Heart, Users, Laptop, Globe } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function CareersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-background via-background/95 to-background/90">
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
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div
              className="space-y-6 lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Join Our Team
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight lg:text-6xl/tight">
                Build Your <span className="text-blue-600">Career</span> With Us
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Join our team of passionate professionals and help shape the future of hosting technology. We're always
                looking for talented individuals to join our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Meet Our Team
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2 relative h-[300px] w-full rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="SnowHost team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Why SnowHost
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Why You'll Love <span className="text-blue-600">Working Here</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              We're building a workplace where talented people can grow, contribute, and enjoy their work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Competitive Compensation",
                description:
                  "We offer competitive salaries, equity options, and comprehensive benefits to ensure you're rewarded for your contributions.",
                icon: <Briefcase className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                title: "Remote-First Culture",
                description:
                  "Work from anywhere with our flexible remote-first approach. We have team members across the globe.",
                icon: <Laptop className="h-8 w-8 text-blue-600" />,
                delay: 0.1,
              },
              {
                title: "Growth Opportunities",
                description:
                  "We invest in your professional development with learning stipends, mentorship, and clear career progression paths.",
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                delay: 0.2,
              },
              {
                title: "Work-Life Balance",
                description:
                  "We believe in sustainable pace. Enjoy flexible hours, generous PTO, and company-wide wellness days.",
                icon: <Heart className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
              {
                title: "Collaborative Environment",
                description:
                  "Join a supportive team that values collaboration, open communication, and diverse perspectives.",
                icon: <Users className="h-8 w-8 text-blue-600" />,
                delay: 0.4,
              },
              {
                title: "Meaningful Impact",
                description:
                  "Your work directly impacts thousands of customers worldwide. Make a difference with technology that matters.",
                icon: <Globe className="h-8 w-8 text-blue-600" />,
                delay: 0.5,
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: benefit.delay }}
              >
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full">
                  <CardContent className="pt-6">
                    <div className="p-3 rounded-full bg-blue-600/10 w-fit mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
                Benefits & Perks
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Comprehensive Benefits Package</h2>
              <p className="text-muted-foreground md:text-lg">
                We believe in taking care of our team members with a comprehensive benefits package designed to support
                your health, wealth, and well-being.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Competitive salary and equity packages</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Comprehensive health, dental, and vision insurance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Generous paid time off and parental leave</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>401(k) matching program</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Professional development stipend</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Home office stipend for remote workers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Mental health and wellness programs</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="SnowHost team collaboration"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Open Positions
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Join Our <span className="text-blue-600">Growing Team</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              We're looking for talented individuals to join our team in the following roles.
            </p>
          </div>

          <Tabs defaultValue="engineering" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="engineering">Engineering</TabsTrigger>
                <TabsTrigger value="product">Product & Design</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="engineering" className="mt-4 space-y-6">
              {[
                {
                  title: "Senior Backend Engineer",
                  location: "Remote (US)",
                  type: "Full-time",
                  description:
                    "We're looking for a Senior Backend Engineer to help build and scale our hosting platform infrastructure.",
                },
                {
                  title: "Frontend Developer",
                  location: "Remote (Worldwide)",
                  type: "Full-time",
                  description:
                    "Join our frontend team to create intuitive and responsive user interfaces for our hosting control panel.",
                },
                {
                  title: "DevOps Engineer",
                  location: "Remote (US/Europe)",
                  type: "Full-time",
                  description:
                    "Help us build and maintain our cloud infrastructure, CI/CD pipelines, and deployment processes.",
                },
                {
                  title: "Security Engineer",
                  location: "Remote (Worldwide)",
                  type: "Full-time",
                  description:
                    "Join our security team to help protect our infrastructure and customer data from threats.",
                },
              ].map((job, index) => (
                <JobCard
                  key={index}
                  title={job.title}
                  location={job.location}
                  type={job.type}
                  description={job.description}
                />
              ))}
            </TabsContent>

            <TabsContent value="product" className="mt-4 space-y-6">
              {[
                {
                  title: "Product Manager",
                  location: "Remote (US/Europe)",
                  type: "Full-time",
                  description: "Lead the development of new hosting products and features from conception to launch.",
                },
                {
                  title: "UX/UI Designer",
                  location: "Remote (Worldwide)",
                  type: "Full-time",
                  description: "Create beautiful, intuitive interfaces for our hosting platform and marketing website.",
                },
                {
                  title: "Technical Writer",
                  location: "Remote (Worldwide)",
                  type: "Full-time",
                  description: "Develop clear, concise documentation for our hosting platform and APIs.",
                },
              ].map((job, index) => (
                <JobCard
                  key={index}
                  title={job.title}
                  location={job.location}
                  type={job.type}
                  description={job.description}
                />
              ))}
            </TabsContent>

            <TabsContent value="operations" className="mt-4 space-y-6">
              {[
                {
                  title: "Customer Success Manager",
                  location: "Remote (US/Europe)",
                  type: "Full-time",
                  description: "Help our customers get the most out of our hosting platform and ensure their success.",
                },
                {
                  title: "Technical Support Specialist",
                  location: "Remote (Worldwide)",
                  type: "Full-time",
                  description:
                    "Provide expert technical support to our customers and help resolve complex hosting issues.",
                },
                {
                  title: "Marketing Specialist",
                  location: "Remote (US)",
                  type: "Full-time",
                  description:
                    "Drive growth through digital marketing campaigns, content creation, and community engagement.",
                },
              ].map((job, index) => (
                <JobCard
                  key={index}
                  title={job.title}
                  location={job.location}
                  type={job.type}
                  description={job.description}
                />
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-10">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              View All Positions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 md:py-28 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              How to Apply
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Our <span className="text-blue-600">Application Process</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              We've designed a straightforward application process to help us get to know each other better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Application",
                description:
                  "Submit your resume and answer a few questions about your experience and interest in the role.",
                icon: <FileText className="h-8 w-8 text-blue-600" />,
                delay: 0,
              },
              {
                step: "2",
                title: "Initial Interview",
                description: "Chat with our recruiting team to discuss your background and learn more about the role.",
                icon: <Users className="h-8 w-8 text-blue-600" />,
                delay: 0.1,
              },
              {
                step: "3",
                title: "Technical Assessment",
                description: "Complete a take-home assignment or technical interview relevant to the position.",
                icon: <Code className="h-8 w-8 text-blue-600" />,
                delay: 0.2,
              },
              {
                step: "4",
                title: "Final Interviews",
                description: "Meet with the team you'll be working with and discuss your potential contributions.",
                icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
                delay: 0.3,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
              >
                <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 h-full">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
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
              Ready to Join?
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Start Your Journey with SnowHost</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              We're excited to meet passionate individuals who want to make an impact. Apply today and join our growing
              team!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Contact Recruiting
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function JobCard({
  title,
  location,
  type,
  description,
}: {
  title: string
  location: string
  type: string
  description: string
}) {
  return (
    <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-600/10 text-blue-600 border-blue-600/20">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </Badge>
            <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">
              <Clock className="h-3 w-3 mr-1" />
              {type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
          Apply Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function Code(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

