"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, Menu, X, Download,
  Users, Phone, Calendar, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Navigation sections
const sections = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'community', label: 'Community', icon: '🗺️' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'services', label: 'Services', icon: '🏛️' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
];

interface NavigationProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export function Navigation({ activeSection = 'home', onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      let found = 'home';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            found = section.id;
          }
        }
      }
      if (onNavigate) {
        onNavigate(found);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onNavigate]);

  useEffect(() => {
    // Check if PWA install prompt should be shown
    const checkInstallPrompt = () => {
      // Simulate PWA install availability
      setTimeout(() => setShowInstallPrompt(true), 3000);
    };
    
    checkInstallPrompt();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };



  return (
    <>
      {/* Enhanced Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 transition-colors duration-300">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-green-700">BarangayLink</span>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-200">
            <div className="flex flex-col p-4 gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left",
                    activeSection === section.id 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'text-green-700 hover:bg-green-50'
                  )}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
              <div className="flex gap-3 mt-4">
                <Link 
                  href="/login" 
                  className="flex-1 px-4 py-3 text-center bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="flex-1 px-4 py-3 text-center border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>



      {/* Enhanced PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed top-20 lg:top-4 left-4 right-4 lg:right-auto lg:left-auto lg:max-w-sm z-50">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl border border-green-500 p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Install BarangayLink</h4>
                <p className="text-green-100 mb-4 text-sm">Get instant access to community services on your device</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // PWA install logic would go here
                      setShowInstallPrompt(false);
                    }}
                    className="px-4 py-2 bg-white text-green-600 text-sm rounded-lg font-semibold hover:bg-green-50 transition-colors flex-1"
                  >
                    Install Now
                  </button>
                  <button
                    onClick={() => setShowInstallPrompt(false)}
                    className="px-4 py-2 text-white text-sm rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
