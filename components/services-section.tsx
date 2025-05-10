import { Car, Clock, Shield, Headphones } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Car,
      title: "Wide Selection of Cars",
      description: "Choose from our extensive fleet of vehicles to find the perfect car for your needs.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Our service is available around the clock to ensure you can get a car whenever you need one.",
    },
    {
      icon: Shield,
      title: "Fully Insured Vehicles",
      description: "All our cars come with comprehensive insurance coverage for your peace of mind.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description: "Our dedicated support team is always ready to assist you with any questions or concerns.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We offer a range of premium services to make your car rental experience smooth and enjoyable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{service.title}</h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
