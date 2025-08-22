import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// Animation configuration
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    slowest: 1.2
  },
  easing: {
    smooth: "power2.out",
    bounce: "back.out(1.7)",
    elastic: "elastic.out(1, 0.5)",
    sharp: "power3.inOut"
  },
  stagger: {
    tight: 0.05,
    normal: 0.1,
    loose: 0.2
  }
};

// Common animation patterns
export class AnimationPatterns {
  
  // Fade in animations
  static fadeIn(elements: string | Element | Element[], options: any = {}) {
    const defaults = {
      y: 30,
      opacity: 0,
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.smooth,
      stagger: ANIMATION_CONFIG.stagger.normal
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.fromTo(elements, 
      { y: config.y, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger
      }
    );
  }

  // Scale entrance animations
  static scaleIn(elements: string | Element | Element[], options: any = {}) {
    const defaults = {
      scale: 0.8,
      opacity: 0,
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.bounce,
      stagger: ANIMATION_CONFIG.stagger.normal
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.fromTo(elements,
      { scale: config.scale, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger
      }
    );
  }

  // Slide animations
  static slideIn(elements: string | Element | Element[], direction: 'left' | 'right' | 'up' | 'down' = 'up', options: any = {}) {
    const defaults = {
      distance: 60,
      opacity: 0,
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.smooth,
      stagger: ANIMATION_CONFIG.stagger.normal
    };
    
    const config = { ...defaults, ...options };
    
    let fromProps: any = { opacity: 0 };
    let toProps: any = { opacity: 1, duration: config.duration, ease: config.ease, stagger: config.stagger };
    
    switch (direction) {
      case 'left':
        fromProps.x = -config.distance;
        toProps.x = 0;
        break;
      case 'right':
        fromProps.x = config.distance;
        toProps.x = 0;
        break;
      case 'up':
        fromProps.y = config.distance;
        toProps.y = 0;
        break;
      case 'down':
        fromProps.y = -config.distance;
        toProps.y = 0;
        break;
    }
    
    return gsap.fromTo(elements, fromProps, toProps);
  }

  // 3D flip animations
  static flipIn(elements: string | Element | Element[], options: any = {}) {
    const defaults = {
      rotationY: 90,
      opacity: 0,
      duration: ANIMATION_CONFIG.duration.slow,
      ease: ANIMATION_CONFIG.easing.bounce,
      stagger: ANIMATION_CONFIG.stagger.normal
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.fromTo(elements,
      { rotationY: config.rotationY, opacity: 0, transformPerspective: 1000 },
      {
        rotationY: 0,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger
      }
    );
  }

  // Typewriter effect
  static typewriter(element: string | Element, text: string, options: any = {}) {
    const defaults = {
      duration: 2,
      ease: "none"
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.to(element, {
      text: text,
      duration: config.duration,
      ease: config.ease
    });
  }

  // Number counter animation
  static countUp(element: string | Element, targetValue: number, options: any = {}) {
    const defaults = {
      duration: 2,
      ease: ANIMATION_CONFIG.easing.smooth
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.fromTo(element, 
      { textContent: 0 },
      {
        textContent: targetValue,
        duration: config.duration,
        ease: config.ease,
        snap: { textContent: 1 },
        onUpdate: function() {
          if (typeof element === 'string') {
            const el = document.querySelector(element);
            if (el) el.textContent = Math.floor(this.targets()[0].textContent);
          } else {
            element.textContent = Math.floor(this.targets()[0].textContent);
          }
        }
      }
    );
  }

  // Magnetic hover effect
  static magneticHover(element: string | Element, strength: number = 0.3) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = (el as Element).getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: ANIMATION_CONFIG.easing.smooth
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: ANIMATION_CONFIG.easing.elastic
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }

  // Floating animation
  static floating(elements: string | Element | Element[], options: any = {}) {
    const defaults = {
      y: 20,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.to(elements, {
      y: `random(-${config.y}, ${config.y})`,
      duration: `random(${config.duration - 1}, ${config.duration + 1})`,
      ease: config.ease,
      repeat: config.repeat,
      yoyo: config.yoyo,
      stagger: {
        each: 0.5,
        from: "random"
      }
    });
  }

  // Parallax scrolling
  static parallax(elements: string | Element | Element[], speed: number = 0.5) {
    elements = typeof elements === 'string' ? document.querySelectorAll(elements) : 
               Array.isArray(elements) ? elements : [elements];

    return ScrollTrigger.create({
      trigger: elements[0],
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: self => {
        gsap.to(elements, {
          y: self.progress * speed * 100,
          duration: 0.3,
          ease: ANIMATION_CONFIG.easing.smooth
        });
      }
    });
  }

  // Scroll reveal batch
  static scrollReveal(selector: string, animation: 'fadeIn' | 'slideIn' | 'scaleIn' | 'flipIn' = 'fadeIn', options: any = {}) {
    const defaults = {
      start: "top 85%",
      once: true
    };
    
    const config = { ...defaults, ...options };
    
    return ScrollTrigger.batch(selector, {
      onEnter: (elements) => {
        switch (animation) {
          case 'fadeIn':
            this.fadeIn(elements, config);
            break;
          case 'slideIn':
            this.slideIn(elements, 'up', config);
            break;
          case 'scaleIn':
            this.scaleIn(elements, config);
            break;
          case 'flipIn':
            this.flipIn(elements, config);
            break;
        }
      },
      start: config.start,
      once: config.once
    });
  }

  // Loading animation
  static loading(element: string | Element, options: any = {}) {
    const defaults = {
      duration: 1,
      ease: "power2.inOut",
      repeat: -1
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.to(element, {
      rotation: 360,
      duration: config.duration,
      ease: config.ease,
      repeat: config.repeat
    });
  }

  // Button click ripple effect
  static rippleEffect(button: Element, e: MouseEvent) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '4px';
    ripple.style.height = '4px';
    ripple.style.background = 'rgba(34, 197, 94, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    gsap.to(ripple, {
      scale: 100,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        ripple.remove();
      }
    });
  }
}

// Page transition animations
export class PageTransitions {
  static fadeTransition(duration: number = 0.5) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration }
    };
  }

  static slideTransition(direction: 'x' | 'y' = 'y', duration: number = 0.5) {
    const distance = direction === 'x' ? 100 : 50;
    const prop = direction === 'x' ? 'x' : 'y';
    
    return {
      initial: { [prop]: distance, opacity: 0 },
      animate: { [prop]: 0, opacity: 1 },
      exit: { [prop]: -distance, opacity: 0 },
      transition: { duration, ease: [0.4, 0, 0.2, 1] }
    };
  }

  static scaleTransition(duration: number = 0.5) {
    return {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
      transition: { duration }
    };
  }
}

// Hook for GSAP context cleanup
export function useGSAP(callback: () => void, deps: any[] = []) {
  const { useEffect, useRef } = require('react');
  const contextRef = useRef<gsap.Context>();

  useEffect(() => {
    contextRef.current = gsap.context(callback);
    return () => contextRef.current?.revert();
  }, deps);

  return contextRef.current;
}

// Performance optimization utilities
export class PerformanceUtils {
  // Lazy load GSAP modules
  static async loadGSAPModules(modules: string[]) {
    const loadPromises = modules.map(async (module) => {
      switch (module) {
        case 'ScrollTrigger':
          const { ScrollTrigger } = await import('gsap/ScrollTrigger');
          gsap.registerPlugin(ScrollTrigger);
          return ScrollTrigger;
        case 'TextPlugin':
          const { TextPlugin } = await import('gsap/TextPlugin');
          gsap.registerPlugin(TextPlugin);
          return TextPlugin;
        case 'MotionPathPlugin':
          const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
          gsap.registerPlugin(MotionPathPlugin);
          return MotionPathPlugin;
        default:
          throw new Error(`Unknown GSAP module: ${module}`);
      }
    });

    return Promise.all(loadPromises);
  }

  // Reduce motion for accessibility
  static respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Conditional animation based on user preferences
  static conditionalAnimate(element: string | Element, animation: any, fallback: any = {}) {
    if (this.respectsReducedMotion()) {
      return gsap.set(element, fallback);
    }
    return gsap.to(element, animation);
  }
}

export default AnimationPatterns;
