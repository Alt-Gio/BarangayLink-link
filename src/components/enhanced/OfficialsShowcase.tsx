"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Award, Shield, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Official {
  id: string;
  name: string;
  position: string;
  photo: string;
  description: string;
  achievements: string[];
  contact: string;
  term: string;
}

export function OfficialsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const officials: Official[] = [
    {
      id: 'captain',
      name: 'Captain Juan Dela Cruz',
      position: 'Barangay Captain',
      photo: '/images/officials/captain.jpg',
      description: 'Leading our community with dedication and vision for sustainable development.',
      achievements: [
        'Implemented digital transformation initiatives',
        'Improved infrastructure and road networks',
        'Enhanced community health programs'
      ],
      contact: '+63 912 345 6789',
      term: '2023 - 2025'
    },
    {
      id: 'secretary',
      name: 'Maria Santos',
      position: 'Barangay Secretary',
      photo: '/images/officials/secretary.jpg',
      description: 'Ensuring efficient documentation and transparent governance processes.',
      achievements: [
        'Streamlined document processing',
        'Digitalized record keeping',
        'Improved public service delivery'
      ],
      contact: '+63 912 345 6790',
      term: '2023 - 2025'
    },
    {
      id: 'treasurer',
      name: 'Pedro Garcia',
      position: 'Barangay Treasurer',
      photo: '/images/officials/treasurer.jpg',
      description: 'Managing community finances with integrity and transparency.',
      achievements: [
        'Improved financial reporting',
        'Enhanced budget transparency',
        'Optimized resource allocation'
      ],
      contact: '+63 912 345 6791',
      term: '2023 - 2025'
    },
    {
      id: 'councilor1',
      name: 'Ana Rodriguez',
      position: 'Barangay Councilor',
      photo: '/images/officials/councilor1.jpg',
      description: 'Advocating for community welfare and development initiatives.',
      achievements: [
        'Led youth development programs',
        'Supported educational initiatives',
        'Promoted environmental awareness'
      ],
      contact: '+63 912 345 6792',
      term: '2023 - 2025'
    },
    {
      id: 'councilor2',
      name: 'Roberto Martinez',
      position: 'Barangay Councilor',
      photo: '/images/officials/councilor2.jpg',
      description: 'Focusing on infrastructure and community development projects.',
      achievements: [
        'Oversaw road improvement projects',
        'Enhanced public facilities',
        'Coordinated disaster preparedness'
      ],
      contact: '+63 912 345 6793',
      term: '2023 - 2025'
    },
    {
      id: 'councilor3',
      name: 'Carmen Lopez',
      position: 'Barangay Councilor',
      photo: '/images/officials/councilor3.jpg',
      description: 'Championing health and social welfare programs.',
      achievements: [
        'Launched health awareness campaigns',
        'Improved senior citizen services',
        'Enhanced community safety programs'
      ],
      contact: '+63 912 345 6794',
      term: '2023 - 2025'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation for the section
      gsap.fromTo('.officials-section', 
        { 
          opacity: 0,
          y: 50
        },
        { 
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        }
      );

      // Animate official cards entrance
      gsap.fromTo('.official-card', 
        { 
          opacity: 0,
          scale: 0.8,
          rotationY: 45
        },
        { 
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      );

      // Auto-play carousel
      let autoPlayInterval: NodeJS.Timeout;
      if (isAutoPlaying) {
        autoPlayInterval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % officials.length);
        }, 5000);
      }

      return () => {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
        }
      };
    }, containerRef);

    return () => ctx.revert();
  }, [isAutoPlaying, officials.length]);

  useEffect(() => {
    // Animate current official card
    gsap.to('.official-card', {
      scale: 0.9,
      opacity: 0.6,
      duration: 0.3,
      ease: "power2.out"
    });

    gsap.to(`.official-card[data-index="${currentIndex}"]`, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
  }, [currentIndex]);

  const nextOfficial = () => {
    setCurrentIndex((prev) => (prev + 1) % officials.length);
    setIsAutoPlaying(false);
  };

  const prevOfficial = () => {
    setCurrentIndex((prev) => (prev - 1 + officials.length) % officials.length);
    setIsAutoPlaying(false);
  };

  const goToOfficial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Meet Our Officials
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Dedicated leaders working together to serve and improve our community.
          </p>
        </div>

        <div ref={containerRef} className="officials-section">
          {/* Main Official Display */}
          <div className="relative mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-green-100 dark:border-green-900/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Official Photo */}
                  <div className="relative">
                    <div className="w-64 h-64 mx-auto lg:mx-0 relative">
                      {/* Placeholder for actual photo */}
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                        {officials[currentIndex].name.charAt(0)}
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Official Information */}
                  <div className="text-center lg:text-left">
                    <div className="mb-4">
                      <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-3">
                        {officials[currentIndex].term}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {officials[currentIndex].name}
                    </h3>
                    
                    <p className="text-lg text-green-600 dark:text-green-400 font-semibold mb-4">
                      {officials[currentIndex].position}
                    </p>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {officials[currentIndex].description}
                    </p>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {officials[currentIndex].achievements.map((achievement, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{officials[currentIndex].contact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevOfficial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            
            <button
              onClick={nextOfficial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Official Cards Carousel */}
          <div className="relative">
            <div className="flex justify-center gap-4 overflow-x-auto pb-4">
              {officials.map((official, index) => (
                <div
                  key={official.id}
                  data-index={index}
                  className={`official-card flex-shrink-0 w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-900/30 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    index === currentIndex ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => goToOfficial(index)}
                >
                  <div className="text-center">
                    {/* Mini Photo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg">
                      {official.name.charAt(0)}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {official.name}
                    </h4>
                    
                    <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                      {official.position}
                    </p>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-500 ${
                          index === currentIndex ? 'bg-green-500 w-full' : 'bg-gray-300 dark:bg-gray-600 w-0'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-8">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
