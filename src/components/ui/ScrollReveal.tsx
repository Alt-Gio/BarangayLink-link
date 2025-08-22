"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'flip' | 'rotate';
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  threshold?: number;
  triggerOnce?: boolean;
  markers?: boolean;
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade',
  duration = 0.8,
  delay = 0,
  stagger = 0,
  ease = 'power3.out',
  threshold = 0.1,
  triggerOnce = true,
  markers = false
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!elementRef.current) return;

      // Set initial state based on animation type
      const initialStates = {
        'fade': { opacity: 0 },
        'slide-up': { opacity: 0, y: 50 },
        'slide-down': { opacity: 0, y: -50 },
        'slide-left': { opacity: 0, x: 50 },
        'slide-right': { opacity: 0, x: -50 },
        'scale': { opacity: 0, scale: 0.8 },
        'flip': { opacity: 0, rotationY: 90 },
        'rotate': { opacity: 0, rotation: 180 }
      };

      const finalStates = {
        'fade': { opacity: 1 },
        'slide-up': { opacity: 1, y: 0 },
        'slide-down': { opacity: 1, y: 0 },
        'slide-left': { opacity: 1, x: 0 },
        'slide-right': { opacity: 1, x: 0 },
        'scale': { opacity: 1, scale: 1 },
        'flip': { opacity: 1, rotationY: 0 },
        'rotate': { opacity: 1, rotation: 0 }
      };

      // Set initial state
      gsap.set(elementRef.current, initialStates[animation]);

      // Create scroll trigger
      ScrollTrigger.create({
        trigger: elementRef.current,
        start: `top ${100 - (threshold * 100)}%`,
        end: 'bottom 20%',
        markers: markers,
        onEnter: () => {
          gsap.to(elementRef.current, {
            ...finalStates[animation],
            duration: duration,
            delay: delay,
            ease: ease,
            stagger: stagger
          });
        },
        onLeave: triggerOnce ? undefined : () => {
          gsap.to(elementRef.current, {
            ...initialStates[animation],
            duration: duration * 0.5,
            ease: ease
          });
        },
        onEnterBack: triggerOnce ? undefined : () => {
          gsap.to(elementRef.current, {
            ...finalStates[animation],
            duration: duration,
            ease: ease
          });
        },
        onLeaveBack: triggerOnce ? undefined : () => {
          gsap.to(elementRef.current, {
            ...initialStates[animation],
            duration: duration * 0.5,
            ease: ease
          });
        }
      });

    }, elementRef);

    return () => ctx.revert();
  }, [animation, duration, delay, stagger, ease, threshold, triggerOnce, markers]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// Convenience components for common animations
export function FadeIn({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="fade" {...props}>{children}</ScrollReveal>;
}

export function SlideUp({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="slide-up" {...props}>{children}</ScrollReveal>;
}

export function SlideDown({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="slide-down" {...props}>{children}</ScrollReveal>;
}

export function SlideLeft({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="slide-left" {...props}>{children}</ScrollReveal>;
}

export function SlideRight({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="slide-right" {...props}>{children}</ScrollReveal>;
}

export function ScaleIn({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="scale" {...props}>{children}</ScrollReveal>;
}

export function FlipIn({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="flip" {...props}>{children}</ScrollReveal>;
}

export function RotateIn({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="rotate" {...props}>{children}</ScrollReveal>;
}
