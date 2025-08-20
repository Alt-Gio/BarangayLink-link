"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-20 lg:pt-0 pb-32 lg:pb-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 overflow-hidden transition-colors duration-300"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 dark:bg-green-700/30 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-emerald-300 dark:bg-emerald-600/30 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-teal-200 dark:bg-teal-600/30 rounded-full opacity-25 animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-20 w-8 h-8 bg-green-300 dark:bg-green-600/30 rounded-full opacity-20 animate-bounce delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-14 h-14 bg-emerald-200 dark:bg-emerald-700/30 rounded-full opacity-15 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-teal-300 dark:bg-teal-600/30 rounded-full opacity-25 animate-bounce delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12 lg:mb-16">
          {/* Hero Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6 border border-green-100 dark:border-green-900/30">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">Serving Barangay Bitano • Live</span>
            </div>
          </div>
          
          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 animate-gradient">
              BarangayLink
            </span>
          </h1>
          
          {/* Hero Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed transition-colors duration-300">
            Empowering <span className="font-bold text-green-600 dark:text-green-400">Barangay Bitano</span> with cutting-edge digital innovation. 
            Connect with your community, access government services instantly, and be part of our 
            <span className="font-bold text-emerald-600 dark:text-emerald-400"> transparent, efficient governance</span> revolution.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 lg:mb-16">
            <Link 
              href="/dashboard" 
              className="group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative flex items-center justify-center gap-3">
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button 
              onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })} 
              className="px-8 lg:px-10 py-4 lg:py-5 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 border-2 border-green-600 dark:border-green-400 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:bg-green-50 dark:hover:bg-green-900/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore Community
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
