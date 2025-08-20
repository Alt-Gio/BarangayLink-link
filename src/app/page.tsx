"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AppProvider } from '@/context/AppContext';
import { Navigation } from '@/components/layout/Navigation';
import { FloatingNavigation } from '@/components/ui/FloatingNavigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { QuickInfoCards } from '@/components/landing/QuickInfoCards';
import { StatsSection } from '@/components/landing/StatsSection';
import { AchievementsSection } from '@/components/landing/AchievementsSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { InteractiveMap } from '@/components/ui/InteractiveMap';
import { EventCalendar } from '@/components/ui/EventCalendar';
import { ContactSection } from '@/components/landing/ContactSection';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <AppProvider>
      <div className="bg-gray-900 transition-colors duration-300">
        <Navigation activeSection={activeSection} onNavigate={handleNavigate} />
        <FloatingNavigation activeSection={activeSection} onNavigate={handleNavigate} />
        
        <main className="min-h-screen">
          {/* Hero Section */}
          <HeroSection />

          {/* Achievements Section - First to showcase impact */}
          <AchievementsSection />

          {/* Enhanced Events Calendar Section */}
          <section id="events" className="py-16 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                  Community
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Events</span>
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                  Stay connected with our vibrant community through events, activities, and programs.
                  Join us in building a stronger, more united Barangay Bitano.
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                <EventCalendar />
              </div>
            </div>
          </section>

          {/* Quick Info & Stats Section */}
          <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <QuickInfoCards />
              <StatsSection />
            </div>
          </section>

          {/* Interactive Map Section */}
          <section id="community" className="py-16 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                  Explore Our
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Community</span>
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                  Discover important locations, services, and landmarks within Barangay Bitano.
                  Use our interactive map to find exactly what you're looking for.
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                <InteractiveMap />
              </div>
            </div>
          </section>



          {/* Services Section */}
          <ServicesSection />

          {/* Enhanced Call to Action */}
          <section className="py-16 lg:py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 lg:mb-8">Join Our Digital Community</h2>
              <p className="text-xl lg:text-2xl text-green-100 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
                Be part of the digital transformation in Barangay Bitano. Register today and experience
                modern, efficient, and transparent local governance at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link 
                  href="/register" 
                  className="px-8 lg:px-12 py-4 lg:py-6 bg-white text-green-600 rounded-2xl font-black shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 text-lg lg:text-xl"
                >
                  Register Now
                </Link>
                <Link 
                  href="/login" 
                  className="px-8 lg:px-12 py-4 lg:py-6 border-2 border-white text-white rounded-2xl font-black hover:bg-white hover:text-green-600 transition-all duration-300 text-lg lg:text-xl"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <ContactSection />
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">BarangayLink</h3>
              <p className="text-gray-400 mb-6">
                Digital platform for Barangay Bitano community services and transparent governance
              </p>
              <div className="text-sm text-gray-500">
                © 2024 Barangay Bitano. All rights reserved.
                {process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true' && (
                  <>
                    {' • '}
                    <Link href="/test-login" className="text-yellow-400 hover:text-yellow-300 underline">
                      Test Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
