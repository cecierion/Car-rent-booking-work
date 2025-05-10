import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      id: "1",
      title: "Top 5 Road Trip Destinations for 2023",
      excerpt: "Discover the most scenic routes and breathtaking destinations for your next road trip adventure.",
      image: "/placeholder.svg?height=200&width=400&text=Road+Trip",
      date: "June 15, 2023",
      category: "Travel",
    },
    {
      id: "2",
      title: "How to Choose the Right Car for Your Needs",
      excerpt: "A comprehensive guide to selecting the perfect rental car based on your specific requirements.",
      image: "/placeholder.svg?height=200&width=400&text=Car+Selection",
      date: "May 22, 2023",
      category: "Guides",
    },
    {
      id: "3",
      title: "Essential Tips for First-Time Car Renters",
      excerpt: "Everything you need to know before renting a car for the first time, from insurance to inspections.",
      image: "/placeholder.svg?height=200&width=400&text=Rental+Tips",
      date: "April 10, 2023",
      category: "Tips",
    },
    {
      id: "4",
      title: "The Future of Electric Vehicles in Car Rentals",
      excerpt: "How electric vehicles are transforming the car rental industry and what to expect in the coming years.",
      image: "/placeholder.svg?height=200&width=400&text=Electric+Vehicles",
      date: "March 5, 2023",
      category: "Industry News",
    },
    {
      id: "5",
      title: "Budget-Friendly Car Rental Tips for Travelers",
      excerpt: "Learn how to save money on your next car rental without compromising on quality or convenience.",
      image: "/placeholder.svg?height=200&width=400&text=Budget+Tips",
      date: "February 18, 2023",
      category: "Tips",
    },
    {
      id: "6",
      title: "Luxury Car Rentals: Is It Worth the Splurge?",
      excerpt:
        "Exploring the pros and cons of renting a luxury vehicle for your next special occasion or business trip.",
      image: "/placeholder.svg?height=200&width=400&text=Luxury+Cars",
      date: "January 30, 2023",
      category: "Luxury",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
            <p className="text-gray-600 max-w-2xl">
              Stay updated with the latest news, tips, and insights about car rentals and the automotive industry.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">{post.date}</p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{post.category}</span>
                  </div>
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
      </main>
      <Footer />
    </div>
  )
}
