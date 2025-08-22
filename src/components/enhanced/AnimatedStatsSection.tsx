"use client";

import { useEffect, useRef, useState } from 'react';
import { Users, Building, FileText, Award, TrendingUp, Clock, CheckCircle, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatItem {
  id: string;
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  color: string;
  description: string;
}

export function AnimatedStatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const stats: StatItem[] = [
    {
      id: 'residents',
      icon: <Users className="w-8 h-8" />,
      value: 15420,
      label: 'Registered Residents',
      color: 'from-green-500 to-emerald-500',
      description: 'Active community members'
    },
    {
      id: 'services',
      icon: <FileText className="w-8 h-8" />,
      value: 25,
      label: 'Available Services',
      color: 'from-emerald-500 to-teal-500',
      description: 'Government services offered'
    },
    {
      id: 'projects',
      icon: <Building className="w-8 h-8" />,
      value: 12,
      label: 'Active Projects',
      color: 'from-teal-500 to-cyan-500',
      description: 'Ongoing development projects'
    },
    {
      id: 'satisfaction',
      icon: <Star className="w-8 h-8" />,
      value: 98,
      label: 'Satisfaction Rate',
      suffix: '%',
      color: 'from-cyan-500 to-blue-500',
      description: 'Community satisfaction score'
    },
    {
      id: 'response',
      icon: <Clock className="w-8 h-8" />,
      value: 2,
      label: 'Avg Response Time',
      suffix: ' hours',
      color: 'from-blue-500 to-indigo-500',
      description: 'Average service response time'
    },
    {
      id: 'completion',
      icon: <CheckCircle className="w-8 h-8" />,
      value: 95,
      label: 'Task Completion',
      suffix: '%',
      color: 'from-indigo-500 to-purple-500',
      description: 'Project completion rate'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide stats
      gsap.set('.stat-card', {
        opacity: 0,
        y: 50,
        scale: 0.8
      });

      // Create scroll trigger for stats animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          // Animate stats cards entrance
          gsap.to('.stat-card', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
          });

          // Animate numbers count-up
          stats.forEach((stat, index) => {
            const element = document.querySelector(`[data-stat="${stat.id}"]`);
            if (element) {
              gsap.fromTo(element,
                { textContent: 0 },
                {
                  textContent: stat.value,
                  duration: 2,
                  delay: 0.5 + (index * 0.1),
                  ease: "power2.out",
                  snap: { textContent: 1 },
                  onUpdate: function() {
                    const value = Math.ceil(this.targets()[0].textContent);
                    element.textContent = value.toLocaleString() + (stat.suffix || '');
                  }
                }
              );
            }
          });
        },
        onLeave: () => {
          // Optional: reset animation when leaving
          gsap.set('.stat-card', {
            opacity: 0,
            y: 50,
            scale: 0.8
          });
        },
        onEnterBack: () => {
          // Re-animate when scrolling back up
          gsap.to('.stat-card', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.7)"
          });
        }
      });

      // Parallax effect for background elements
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: self => {
          gsap.to('.parallax-bg', {
            y: self.progress * -100,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Hover animations
  const handleStatHover = (statId: string) => {
    setHoveredStat(statId);
    
    gsap.to(`[data-stat-card="${statId}"]`, {
      scale: 1.05,
      y: -10,
      duration: 0.3,
      ease: "power2.out"
    });

    // Animate other cards slightly
    stats.forEach(stat => {
      if (stat.id !== statId) {
        gsap.to(`[data-stat-card="${stat.id}"]`, {
          scale: 0.95,
          opacity: 0.7,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  };

  const handleStatLeave = () => {
    setHoveredStat(null);
    
    // Reset all cards
    gsap.to('.stat-card', {
      scale: 1,
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  return (
    <section 
      ref={sectionRef}
      id="stats" 
      className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="parallax-bg absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-emerald-100/20 to-teal-100/30 dark:from-green-900/10 dark:via-emerald-900/5 dark:to-teal-900/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)
            `
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6 border border-green-100 dark:border-green-900/30">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">Community Statistics</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Empowering Our Community
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the impact of our digital transformation on Barangay Bitano. 
            These numbers represent our commitment to efficient, transparent, and accessible governance.
          </p>
        </div>

        {/* Stats Grid */}
        <div 
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.id}
              data-stat-card={stat.id}
              className="stat-card group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-green-100 dark:border-green-900/30 transition-all duration-300 cursor-pointer overflow-hidden"
              onMouseEnter={() => handleStatHover(stat.id)}
              onMouseLeave={handleStatLeave}
            >
              {/* Hover Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Card Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>

                {/* Stat Value */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span 
                      data-stat={stat.id}
                      className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300"
                    >
                      0{stat.suffix || ''}
                    </span>
                    {hoveredStat === stat.id && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>

                {/* Stat Label */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {stat.description}
                </p>

                {/* Progress Indicator */}
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: hoveredStat === stat.id ? '100%' : '0%',
                      transitionDelay: hoveredStat === stat.id ? '0.2s' : '0s'
                    }}
                  ></div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-full`}></div>
              </div>
              
              <div className="absolute bottom-4 left-4 opacity-5 group-hover:opacity-15 transition-opacity duration-300">
                <div className={`w-4 h-4 bg-gradient-to-br ${stat.color} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-green-100 dark:border-green-900/30">
            <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Join our growing community today
            </span>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}
