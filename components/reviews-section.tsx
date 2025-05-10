"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReviewsSection() {
  const reviews = [
    {
      id: "1",
      name: "John Smith",
      rating: 5,
      comment: "Excellent service! The car was in perfect condition and the rental process was smooth and hassle-free.",
      date: "May 15, 2023",
      avatar: "/placeholder.svg?height=50&width=50&text=JS",
    },
    {
      id: "2",
      name: "Emily Johnson",
      rating: 4,
      comment: "Great experience overall. The staff was friendly and helpful. Would definitely rent from them again.",
      date: "April 22, 2023",
      avatar: "/placeholder.svg?height=50&width=50&text=EJ",
    },
    {
      id: "3",
      name: "Michael Brown",
      rating: 5,
      comment: "Top-notch service and quality vehicles. The car was clean, well-maintained, and fuel-efficient.",
      date: "March 10, 2023",
      avatar: "/placeholder.svg?height=50&width=50&text=MB",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      rating: 4,
      comment: "Very satisfied with my rental. The pickup and drop-off process was quick and efficient.",
      date: "February 28, 2023",
      avatar: "/placeholder.svg?height=50&width=50&text=SW",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const reviewsPerPage = 1

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + reviewsPerPage) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - reviewsPerPage + reviews.length) % reviews.length)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-white shadow-md"
            onClick={prevReview}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white shadow-md"
            onClick={nextReview}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>

          <div className="flex justify-center mt-6 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-gray-300"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
