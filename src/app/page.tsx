"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { EnhancedNavigation } from '@/components/enhanced/EnhancedNavigation';
import { EnhancedHeroSection } from '@/components/enhanced/EnhancedHeroSection';
import { AnimatedStatsSection } from '@/components/enhanced/AnimatedStatsSection';
import { CommunityMap } from '@/components/enhanced/CommunityMap';
import { OfficialsShowcase } from '@/components/enhanced/OfficialsShowcase';
import { EventsCalendar } from '@/components/enhanced/EventsCalendar';
import { ScrollReveal, FadeIn, SlideUp, ScaleIn } from '@/components/ui/ScrollReveal';

export default function HomePage() {

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Enhanced Navigation */}
      <EnhancedNavigation />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Animated Stats Section */}
      <AnimatedStatsSection />

      {/* Community Map Section */}
      <section id="map">
        <CommunityMap />
      </section>

      {/* Officials Showcase */}
      <section id="officials">
        <OfficialsShowcase />
      </section>

      {/* Events Calendar */}
      <section id="calendar">
        <EventsCalendar />
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 lg:py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive government services designed to serve our community efficiently and transparently.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Document Requests",
                description: "Get barangay clearances, certificates, and official documents with ease.",
                icon: "📄",
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Community Events",
                description: "Stay updated with local events, meetings, and community activities.",
                icon: "🎉",
                color: "from-emerald-500 to-teal-500"
              },
              {
                title: "Project Updates",
                description: "Track ongoing development projects and infrastructure improvements.",
                icon: "🏗️",
                color: "from-teal-500 to-cyan-500"
              },
              {
                title: "Financial Reports",
                description: "Access transparent financial reports and budget information.",
                icon: "💰",
                color: "from-cyan-500 to-blue-500"
              },
              {
                title: "Task Management",
                description: "Efficient task tracking and project management for staff.",
                icon: "✅",
                color: "from-blue-500 to-indigo-500"
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your barangay needs.",
                icon: "🆘",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((service, index) => (
              <SlideUp key={service.title} delay={index * 0.1}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-green-100 dark:border-green-900/30 transition-all duration-300 hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About Barangay Bitano
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Learn about our mission, history, and commitment to serving our community with excellence.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Our Mission",
                description: "To provide efficient, transparent, and accessible government services that empower our community and promote sustainable development.",
                icon: "🎯"
              },
              {
                title: "Our Vision",
                description: "To be a model barangay known for innovation, community engagement, and excellence in public service delivery.",
                icon: "👁️"
              },
              {
                title: "Our Values",
                description: "Integrity, transparency, community service, innovation, and sustainable development guide everything we do.",
                icon: "💎"
              }
            ].map((item, index) => (
              <ScaleIn key={item.title} delay={index * 0.2}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 dark:border-green-900/30 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-32 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
              Have questions or need assistance? We're here to help you with all your barangay needs.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "📞", title: "Phone", contact: "+63 912 345 6789" },
              { icon: "📧", title: "Email", contact: "info@barangaybitano.gov.ph" },
              { icon: "📍", title: "Address", contact: "Barangay Bitano, Legazpi City, Albay" },
              { icon: "🕒", title: "Hours", contact: "Monday - Friday, 8:00 AM - 5:00 PM" }
            ].map((item, index) => (
              <SlideUp key={item.title} delay={index * 0.1}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-green-100">{item.contact}</p>
                </div>
              </SlideUp>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <Link href="/contact">
              <button className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Submit Complaint or Inquiry
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-xl font-bold">BarangayLink</span>
              </div>
              <p className="text-gray-400">
                Empowering Barangay Bitano with digital innovation and transparent governance.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Document Requests</li>
                <li>Community Events</li>
                <li>Project Updates</li>
                <li>Financial Reports</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Events Calendar</li>
                <li>News & Updates</li>
                <li>Directory</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Barangay Bitano. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
