"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Building, Shield, FileText, Phone, Award, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export function EnhancedHeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const accomplishmentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for initial animations
      const tl = gsap.timeline({ delay: 0.3 });

      // Hero badge animation
      tl.fromTo('.hero-badge', 
        { 
          scale: 0,
          rotation: -180,
          opacity: 0 
        },
        { 
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)"
        }
      );

      // Title animation with letter-by-letter reveal
      tl.fromTo('.hero-title-word', 
        { 
          y: 100,
          opacity: 0,
          rotationX: 90
        },
        { 
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.3"
      );

      // Subtitle typewriter effect
      tl.fromTo('.hero-subtitle', 
        { opacity: 0 },
        { 
          opacity: 1,
          duration: 0.5
        }, "-=0.2"
      ).to('.hero-subtitle', {
        text: "Empowering Barangay Bitano with cutting-edge digital innovation. Connect with your community, access government services instantly, and be part of our transparent, efficient governance revolution.",
        duration: 2.5,
        ease: "none"
      });

      // Buttons staggered entrance
      tl.fromTo('.hero-button', 
        { 
          y: 50,
          opacity: 0,
          scale: 0.8
        },
        { 
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }, "-=1"
      );

      // Accomplishments animation
      tl.fromTo('.accomplishment-card', 
        { 
          x: -100,
          opacity: 0,
          scale: 0.8
        },
        { 
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        }, "-=0.5"
      );

      // Floating elements animation
      gsap.set('.floating-element', { 
        opacity: 0,
        scale: 0 
      });

      gsap.to('.floating-element', {
        opacity: 0.7,
        scale: 1,
        duration: 1,
        stagger: 0.3,
        delay: 1.5,
        ease: "power2.out"
      });

      // Continuous floating animation
      gsap.to('.floating-1', {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-5, 5)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      gsap.to('.floating-2', {
        y: "random(-30, 30)",
        x: "random(-15, 15)",
        rotation: "random(-10, 10)",
        duration: "random(4, 6)",
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 1
      });

      gsap.to('.floating-3', {
        y: "random(-15, 15)",
        x: "random(-20, 20)",
        rotation: "random(-3, 3)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 2
      });

      // Parallax scroll effect
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: self => {
          gsap.to('.parallax-bg', {
            y: self.progress * 100,
            duration: 0.3,
            ease: "power2.out"
          });
          
          gsap.to('.floating-elements', {
            y: self.progress * 200,
            rotation: self.progress * 20,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Magnetic button effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-20 lg:pt-0 pb-32 lg:pb-20 overflow-hidden"
    >
      {/* Enhanced Background with Parallax */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 transition-colors duration-300"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div ref={floatingElementsRef} className="floating-elements absolute inset-0 pointer-events-none">
        <div className="floating-element floating-1 absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 shadow-lg">
          <div className="w-full h-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="floating-element floating-2 absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-30 shadow-lg">
          <div className="w-full h-full flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="floating-element floating-3 absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-25 shadow-lg">
          <div className="w-full h-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="floating-element floating-1 absolute bottom-1/4 left-20 w-8 h-8 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full opacity-20"></div>
        <div className="floating-element floating-2 absolute top-1/4 right-1/4 w-14 h-14 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full opacity-15"></div>
        <div className="floating-element floating-3 absolute bottom-1/3 right-1/3 w-10 h-10 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-25"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          {/* Enhanced Hero Badge */}
          <div className="mb-8">
            <div className="hero-badge inline-flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl mb-6 border border-green-100 dark:border-green-900/30 hover:scale-105 transition-transform duration-300">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">Serving Barangay Bitano • Live</span>
              <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          {/* Enhanced Hero Title - Removed "Welcome to" */}
          <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
            <span className="hero-title-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
              BarangayLink
            </span>
          </h1>
          
          {/* Enhanced Hero Subtitle with Typewriter Effect */}
          <div className="hero-subtitle-container mb-8">
            <p ref={subtitleRef} className="hero-subtitle text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed transition-colors duration-300">
              {/* Text will be animated via GSAP */}
            </p>
          </div>
          
          {/* Enhanced CTA Buttons - Changed to Login Now and Explore Map */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-12 lg:mb-16">
            <Link href="/login">
              <button 
                className="hero-button group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center justify-center gap-3">
                  Login Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Ripple effect on click */}
                <div className="absolute inset-0 opacity-0 group-active:opacity-20 bg-white rounded-2xl animate-ping"></div>
              </button>
            </Link>
            
            <button 
              className="hero-button px-8 lg:px-10 py-4 lg:py-5 bg-white/90 dark:bg-gray-800/90 text-green-700 dark:text-green-400 border-2 border-green-600 dark:border-green-400 rounded-2xl font-bold shadow-xl hover:shadow-2xl backdrop-blur-sm transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/30"
              onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })} 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              Explore Map
            </button>
          </div>

          {/* Accomplishments Section */}
          <div ref={accomplishmentsRef} className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Our Accomplishments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "Infrastructure Development",
                  description: "Completed road improvements and community facilities",
                  icon: <Building className="w-8 h-8" />,
                  color: "from-green-500 to-emerald-500",
                  image: "/images/infrastructure.jpg"
                },
                {
                  title: "Community Programs",
                  description: "Launched educational and health initiatives",
                  icon: <Users className="w-8 h-8" />,
                  color: "from-emerald-500 to-teal-500",
                  image: "/images/community.jpg"
                },
                {
                  title: "Digital Transformation",
                  description: "Modernized government services and processes",
                  icon: <Award className="w-8 h-8" />,
                  color: "from-teal-500 to-cyan-500",
                  image: "/images/digital.jpg"
                }
              ].map((accomplishment, index) => (
                <div key={accomplishment.title} className="accomplishment-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 dark:border-green-900/30 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {accomplishment.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
                    {accomplishment.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {accomplishment.description}
                  </p>
                  {/* Placeholder for actual images */}
                  <div className="mt-4 w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Image Placeholder</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-green-600 dark:border-green-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-green-600 dark:bg-green-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </section>
  );
}
