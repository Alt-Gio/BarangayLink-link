"use client";

import { cn } from '@/lib/utils';

const sections = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'community', label: 'Community', icon: '🗺️' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'services', label: 'Services', icon: '🏛️' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
];

interface FloatingNavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function FloatingNavigation({ activeSection, onNavigate }: FloatingNavigationProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onNavigate(id);
    }
  };

  return (
    <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="flex flex-col gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                activeSection === section.id
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400"
              )}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="whitespace-nowrap">{section.label}</span>
              
              {/* Active indicator */}
              {activeSection === section.id && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-green-600 rounded-l-full"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Decorative element */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">BarangayLink</div>
          </div>
        </div>
      </div>
    </div>
  );
}
