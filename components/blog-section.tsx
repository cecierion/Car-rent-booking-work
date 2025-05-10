import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function BlogSection() {
  const blogPosts = [
    {
      id: "1",
      title: "Top 5 Road Trip Destinations for 2023",
      excerpt: "Discover the most scenic routes and breathtaking destinations for your next road trip adventure.",
      image: "/placeholder.svg?height=200&width=400&text=Road+Trip",
      date: "June 15, 2023",
    },
    {
      id: "2",
      title: "How to Choose the Right Car for Your Needs",
      excerpt: "A comprehensive guide to selecting the perfect rental car based on your specific requirements.",
      image: "/placeholder.svg?height=200&width=400&text=Car+Selection",
      date: "May 22, 2023",
    },
    {
      id: "3",
      title: "Essential Tips for First-Time Car Renters",
      excerpt: "Everything you need to know before renting a car for the first time, from insurance to inspections.",
      image: "/placeholder.svg?height=200&width=400&text=Rental+Tips",
      date: "April 10, 2023",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">From Our Blog</h2>
          <Button asChild variant="outline">
            <Link href="/blog" className="flex items-center gap-2">
              View All Posts <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-primary font-medium hover:underline inline-flex items-center"
                >
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
