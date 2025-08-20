"use client";

import { 
  FileText, Users, Phone, Calendar, MapPin, CreditCard, 
  Shield, Heart, Briefcase, GraduationCap, Home, Car 
} from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: "Document Services",
    description: "Birth certificates, clearances, permits, and more",
    features: ["Birth Certificate", "Barangay Clearance", "Business Permit", "Residency Certificate"],
    color: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Users,
    title: "Community Programs",
    description: "Social services and community development initiatives",
    features: ["Senior Citizens Program", "Youth Development", "Women's Program", "PWD Services"],
    color: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: Shield,
    title: "Public Safety",
    description: "Security services and emergency response",
    features: ["Emergency Response", "Peace & Order", "Disaster Preparedness", "Security Patrol"],
    color: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400"
  },
  {
    icon: Heart,
    title: "Health Services",
    description: "Healthcare and wellness programs",
    features: ["Health Center", "Vaccination Programs", "Medical Assistance", "Health Education"],
    color: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: Briefcase,
    title: "Business Support",
    description: "Support for local entrepreneurs and businesses",
    features: ["Business Registration", "Permits & Licenses", "Market Spaces", "Business Development"],
    color: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400"
  },
  {
    icon: GraduationCap,
    title: "Education Support",
    description: "Educational assistance and scholarship programs",
    features: ["Scholarship Programs", "School Supplies", "Educational Seminars", "Skills Training"],
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  }
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Services</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Access a comprehensive range of government services designed to serve the community efficiently and transparently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-gray-700 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-8 h-8 ${service.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
          <div className="text-center">
            <Phone className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Emergency Hotline</h3>
            <p className="text-red-100 mb-4">Available 24/7 for immediate assistance</p>
            <div className="text-3xl font-black mb-4">(052) 742-0123</div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Medical
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Fire Emergency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
