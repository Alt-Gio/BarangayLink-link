"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function EnhancedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      
      // Hide navigation when scrolling down, show when scrolling up
      if (scrollTop > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate navigation visibility
    gsap.to('.enhanced-nav', {
      y: isVisible ? 0 : -100,
      duration: 0.3,
      ease: "power2.out"
    });
  }, [isVisible]);

  return (
    <nav className={`enhanced-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-green-600/95 to-emerald-600/95 backdrop-blur-md shadow-xl border-b border-green-500/30' 
        : 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-green-100 transition-colors">
                BarangayLink
              </span>
              <span className="text-sm text-green-100 font-medium">
                Bitano
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="#home" className="text-white hover:text-green-100 font-semibold transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-white hover:text-green-100 font-semibold transition-colors">
              About Us
            </Link>
            <Link href="#services" className="text-white hover:text-green-100 font-semibold transition-colors">
              Services
            </Link>
            <Link href="#map" className="text-white hover:text-green-100 font-semibold transition-colors">
              Community Map
            </Link>
            <Link href="#officials" className="text-white hover:text-green-100 font-semibold transition-colors">
              Officials
            </Link>
            <Link href="#calendar" className="text-white hover:text-green-100 font-semibold transition-colors">
              Events
            </Link>
            <Link href="#contact" className="text-white hover:text-green-100 font-semibold transition-colors">
              Contact
            </Link>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 ml-8">
              <Link href="/login">
                <button className="px-4 py-2 text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gradient-to-b from-green-600 to-emerald-600 border-t border-green-500/30">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="#home" 
                className="block text-white hover:text-green-100 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="#about" 
                className="block text-white hover:text-green-100 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="#services" 
                className="block text-white hover:text-green-100 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="#map" 
                className="block text-white hover:text-green-100 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Community Map
              </Link>
              <Link 
                href="#officials" 
                className="block text-white hover:text-green-100 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Officials
              </Link>
              <Link 
                href="#calendar" 
                className="block text-white hover:text-green-100 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                href="#contact" 
                className="block text-white hover:text-green-100 font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-3">
                <Link href="/login">
                  <button className="w-full px-4 py-2 text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="w-full px-4 py-2 bg-white text-green-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
