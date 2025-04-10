import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background to-background/90">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="px-3 py-1 text-sm bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-full">
              Latest News & Insights
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              SnowHost <span className="text-blue-600">Blog</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Stay updated with the latest news, tips, and insights about hosting, gaming, and technology.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2 relative h-[300px] w-full rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Featured blog post"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:w-1/2 space-y-4">
              <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20">Featured</Badge>
              <h2 className="text-3xl font-bold">Optimizing Your Gaming Server for Maximum Performance</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  March 25, 2025
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />8 min read
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  John Smith
                </div>
              </div>
              <p className="text-muted-foreground">
                Learn how to optimize your gaming server for maximum performance with our comprehensive guide. From
                hardware selection to software configuration, we cover everything you need to know.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/blog/optimizing-gaming-server">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-12 md:py-16 bg-black/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Recent Posts</h2>
              <p className="text-muted-foreground">The latest articles from our blog</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog/archive">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogPostCard
              title="The Future of Cloud Gaming: What to Expect in 2025"
              excerpt="Cloud gaming is evolving rapidly. Discover the trends and technologies that will shape the future of gaming in the cloud."
              date="March 20, 2025"
              readTime="6 min read"
              author="Jane Doe"
              category="Gaming"
              image="/placeholder.svg?height=400&width=600"
              slug="future-of-cloud-gaming"
            />
            <BlogPostCard
              title="10 Essential Security Practices for Your VPS"
              excerpt="Protect your virtual private server with these essential security practices that every administrator should implement."
              date="March 15, 2025"
              readTime="5 min read"
              author="Mike Johnson"
              category="Security"
              image="/placeholder.svg?height=400&width=600"
              slug="essential-vps-security-practices"
            />
            <BlogPostCard
              title="How to Choose the Right Web Hosting Plan for Your Business"
              excerpt="Selecting the right web hosting plan is crucial for your business. Learn how to make the best choice based on your needs."
              date="March 10, 2025"
              readTime="7 min read"
              author="Sarah Williams"
              category="Web Hosting"
              image="/placeholder.svg?height=400&width=600"
              slug="choose-right-web-hosting-plan"
            />
            <BlogPostCard
              title="Understanding DDoS Attacks and How to Prevent Them"
              excerpt="DDoS attacks can cripple your online presence. Learn what they are and how to protect your servers from these threats."
              date="March 5, 2025"
              readTime="9 min read"
              author="David Chen"
              category="Security"
              image="/placeholder.svg?height=400&width=600"
              slug="understanding-ddos-attacks"
            />
            <BlogPostCard
              title="Setting Up a Minecraft Server: A Complete Guide"
              excerpt="Create your own Minecraft server with this step-by-step guide covering installation, configuration, and optimization."
              date="February 28, 2025"
              readTime="10 min read"
              author="Alex Turner"
              category="Gaming"
              image="/placeholder.svg?height=400&width=600"
              slug="minecraft-server-setup-guide"
            />
            <BlogPostCard
              title="The Benefits of SSD Storage for Web Hosting"
              excerpt="SSD storage offers significant advantages over traditional HDD storage. Discover why it's the best choice for web hosting."
              date="February 25, 2025"
              readTime="4 min read"
              author="Lisa Brown"
              category="Technology"
              image="/placeholder.svg?height=400&width=600"
              slug="benefits-of-ssd-storage"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground max-w-[700px]">
              Explore our articles by topic to find the information you need
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <CategoryCard title="Gaming" count={15} slug="gaming" />
            <CategoryCard title="Security" count={12} slug="security" />
            <CategoryCard title="Web Hosting" count={18} slug="web-hosting" />
            <CategoryCard title="VPS" count={9} slug="vps" />
            <CategoryCard title="Technology" count={21} slug="technology" />
            <CategoryCard title="Tutorials" count={14} slug="tutorials" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-blue-600/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground">
                Stay updated with the latest news, articles, and special offers. We promise not to spam your inbox.
              </p>
            </div>
            <div className="lg:w-1/2">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                By subscribing, you agree to our{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function BlogPostCard({
  title,
  excerpt,
  date,
  readTime,
  author,
  category,
  image,
  slug,
}: {
  title: string
  excerpt: string
  date: string
  readTime: string
  author: string
  category: string
  image: string
  slug: string
}) {
  return (
    <Card className="overflow-hidden bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-200 h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute top-2 left-2">
          <Badge className="bg-blue-600/80 hover:bg-blue-600 text-white border-none">{category}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-2">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {date}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {readTime}
          </div>
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {author}
          </div>
        </div>
        <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full justify-center hover:bg-blue-600/10 hover:text-blue-600" asChild>
          <Link href={`/blog/${slug}`}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function CategoryCard({ title, count, slug }: { title: string; count: number; slug: string }) {
  return (
    <Link href={`/blog/category/${slug}`}>
      <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-200 h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{count} articles</p>
        </CardContent>
      </Card>
    </Link>
  )
}

