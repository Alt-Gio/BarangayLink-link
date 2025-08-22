// Conditional imports for SSR compatibility
let gsap: any;
let ScrollTrigger: any;
let TextPlugin: any;

if (typeof window !== 'undefined') {
  gsap = require('gsap').gsap;
  ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
  TextPlugin = require('gsap/TextPlugin').TextPlugin;
  
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export { gsap, ScrollTrigger, TextPlugin };
export * from './animations';
