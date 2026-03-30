import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Instagram, Mail, Phone, ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlides = [
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=80', super: 'Fine Art Wedding Photography', title1: 'Where Love', title2: 'Becomes Art', text: 'Capturing the raw emotion and editorial elegance of your most cherished moments. Serving couples worldwide.' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2000&q=80', super: 'A Timeless Approach', title1: 'Editorial', title2: 'Elegance', text: 'No awkward posing, just genuine moments suspended in time, elevated to high art.' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2000&q=80', super: 'Raw & Authentic', title1: 'Visual', title2: 'Poetry', text: 'Documenting real moments: the nervous laugh, the first look, the last dance.' }
  ];

  const mainRef = useRef(null);
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  
  // Section Refs
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const galleryRef = useRef(null);
  const packagesRef = useRef(null);
  const contactRef = useRef(null);

  // Custom Cursor Logic
  useEffect(() => {
    if (!cursorRef.current || !followerRef.current) return;
    
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(followerRef.current, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3" });
    const followerXTo = gsap.quickTo(followerRef.current, "x", { duration: 0.6, ease: "power3" });
    const followerYTo = gsap.quickTo(followerRef.current, "y", { duration: 0.6, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      followerXTo(e.clientX);
      followerYTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    
    const interactables = document.querySelectorAll('a, button, input, textarea, select');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => followerRef.current?.classList.add('active'));
      el.addEventListener('mouseleave', () => followerRef.current?.classList.remove('active'));
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', () => followerRef.current?.classList.add('active'));
        el.removeEventListener('mouseleave', () => followerRef.current?.classList.remove('active'));
      });
    };
  }, [preloaderComplete]);

  // Preloader & Main  // GSAP Entry Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setPreloaderComplete(true)
      });
      
      // Cursor enter
      tl.to(".cursor-dot", { opacity: 1, duration: 0.5 })
        .to(".cursor-outline", { opacity: 1, duration: 0.5 }, "-=0.2");

      // Preloader fade out
      tl.to(".preloader-text", { opacity: 0, y: -20, duration: 0.8, delay: 1, ease: "power2.inOut" })
        .to(".preloader-overlay", { height: 0, duration: 1.2, ease: "power4.inOut" })
        .from(".hero-img-inner", { scale: 1.2, duration: 2, ease: "power3.out" }, "-=1")
        .from(".hero-dynamic-text", { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=1.5")
        .from("nav", { y: -50, opacity: 0, duration: 1, ease: "power2.out", clearProps: "all" }, "-=1");
    }, mainRef);
    
    return () => ctx.revert();
  }, []);
  
  // Hero Carousel Auto-play & Text Animation
  const initialMount = useRef(true);
  useEffect(() => {
    if (!preloaderComplete) return;
    
    // Auto play timer
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    
    // Animate text on change, but skip the first run since the preloader already animates it
    if (initialMount.current) {
        initialMount.current = false;
    } else {
        gsap.fromTo(".hero-dynamic-text", 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", clearProps: "all" }
        );
    }
    
    return () => clearInterval(timer);
  }, [currentHeroSlide, preloaderComplete, heroSlides.length]);

  // Scroll Animations
  useEffect(() => {
    if (!preloaderComplete) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);

    const ctx = gsap.context(() => {
      // Hero Parallax
      gsap.to(".hero-img-inner", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // About Section
      gsap.from(".about-heading span", {
        scrollTrigger: { trigger: aboutRef.current, start: "top 75%" },
        y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out"
      });
      gsap.from(".about-desc", {
        scrollTrigger: { trigger: aboutRef.current, start: "top 75%" },
        y: 30, opacity: 0, duration: 1, delay: 0.3, ease: "power2.out"
      });
      gsap.from(".about-img", {
        scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 1.5, ease: "power4.out"
      });
      gsap.to(".about-img", {
        scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.5, ease: "power4.out"
      });
      // Fix image inner parallax
      gsap.fromTo(".about-img img", 
        { scale: 1.2 }, 
        { scale: 1, duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: aboutRef.current, start: "top 80%" }}
      );

      // Gallery Stagger
      gsap.from(".gallery-item", {
        scrollTrigger: { trigger: galleryRef.current, start: "top 70%" },
        y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out"
      });

      // Packages
      gsap.from(".package-card", {
        scrollTrigger: { trigger: packagesRef.current, start: "top 75%" },
        y: 60, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power3.out"
      });

      // Contact Form
      gsap.from(".contact-col", {
        scrollTrigger: { trigger: contactRef.current, start: "top 75%" },
        y: 40, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power3.out"
      });
    }, mainRef);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, [preloaderComplete]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('success');
  };

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      names: "Emily & James, New York",
      text: "Sofia captured our wedding day in a way that still takes our breath away. Every photo tells a story we didn't even know was happening. Absolute perfection."
    },
    {
      names: "Rachel & Daniel, California",
      text: "We were nervous about photography but Sofia made us feel completely at ease. She blended into the background and the results were stunning — timeless, romantic, perfect."
    },
    {
      names: "Claire & Michael, Texas",
      text: "Booking Sofia was the best decision we made. The photos arrived exactly as promised and they are beyond anything we imagined. We are forever grateful."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={mainRef} className="relative font-sans bg-charcoal text-cream overflow-x-hidden min-h-screen">
      
      {/* PRELOADER */}
      {!preloaderComplete && (
        <div className="preloader-overlay fixed inset-0 z-[100] bg-charcoal flex items-center justify-center overflow-hidden">
          <div className="preloader-text font-serif italic text-3xl md:text-5xl text-gold">Elara</div>
        </div>
      )}

      {/* CUSTOM CURSOR */}
      <div ref={cursorRef} className="custom-cursor hidden md:block"></div>
      <div ref={followerRef} className="custom-cursor-follower hidden md:block"></div>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled || menuOpen ? 'bg-charcoal/90 backdrop-blur-xl border-b border-warm-gray/10 py-5' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="flex flex-col text-left group">
            <span className="font-serif italic text-2xl md:text-[28px] text-cream leading-none group-hover:text-gold transition-colors duration-500">Elara</span>
            <span className="font-sans font-light text-[10px] tracking-[0.25em] uppercase mt-1 text-warm-gray">Photography</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-12">
            {[
              { label: 'Home', href: '#' },
              { label: 'Portfolio', href: '#gallery' },
              { label: 'About', href: '#about' },
              { label: 'Investment', href: '#packages' }
            ].map((item) => (
               <a key={item.label} href={item.href} className="font-sans font-light text-xs tracking-widest uppercase text-cream/70 hover:text-gold transition-colors duration-300">
                 {item.label}
               </a>
            ))}
            <a href="#contact" className="font-sans font-light text-xs tracking-widest uppercase px-7 py-3 border border-gold/50 text-cream hover:bg-gold hover:text-charcoal transition-all duration-500">
              Contact
            </a>
          </div>

          <button className="md:hidden text-cream" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 bg-charcoal transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col items-center justify-center space-y-10 ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        {[
          { label: 'Home', href: '#' },
          { label: 'Portfolio', href: '#gallery' },
          { label: 'About', href: '#about' },
          { label: 'Investment', href: '#packages' },
          { label: 'Contact', href: '#contact' }
        ].map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="font-serif italic text-5xl text-cream hover:text-gold transition-colors">
              {item.label}
            </a>
        ))}
      </div>

      {/* HERO SECTION (CAROUSEL) */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-charcoal">
        {/* Images layer */}
        {heroSlides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${index === currentHeroSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          >
            <div className="absolute -inset-[10%] w-[120%] h-[120%] hero-img-inner">
              <img 
                src={slide.src} 
                alt={slide.title1} 
                className={`w-full h-full object-cover opacity-60 mix-blend-luminosity transform transition-transform duration-[10000ms] ease-out ${index === currentHeroSlide ? 'scale-110' : 'scale-100'}`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20"></div>
            </div>
          </div>
        ))}

        {/* Text layer */}
        <div key={`text-${currentHeroSlide}`} className="max-w-[1440px] w-full px-6 flex flex-col items-center text-center mt-20 z-10">
          <p className="hero-dynamic-text font-sans font-light text-xs md:text-sm text-gold tracking-[0.4em] uppercase mb-6">{heroSlides[currentHeroSlide].super}</p>
          <h1 className="font-serif italic text-5xl md:text-[110px] text-cream leading-[1.05] tracking-tight mb-8">
            <span className="hero-dynamic-text block">{heroSlides[currentHeroSlide].title1}</span>
            <span className="hero-dynamic-text block">{heroSlides[currentHeroSlide].title2}</span>
          </h1>
          <p className="hero-dynamic-text font-sans font-light text-sm md:text-base text-warm-gray max-w-lg mx-auto leading-relaxed mb-12">
            {heroSlides[currentHeroSlide].text}
          </p>
          <a href="#gallery" className="hero-dynamic-text group relative inline-flex items-center justify-center font-sans font-light text-xs tracking-widest uppercase text-cream pb-2 overflow-hidden">
            <span className="relative z-10">Discover The Portfolio</span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold transform origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-0"></span>
            <span className="absolute bottom-0 right-0 w-full h-[1px] bg-cream transform origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
          </a>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 flex justify-between items-center z-20">
          <div className="font-sans font-light text-[10px] text-gold tracking-[0.3em]">
            0{currentHeroSlide + 1} <span className="text-warm-gray/50 mx-2">/</span> 0{heroSlides.length}
          </div>
          <div className="flex space-x-3">
             {heroSlides.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentHeroSlide(i)}
                 className={`h-[1px] transition-all duration-700 ${i === currentHeroSlide ? 'w-12 bg-gold' : 'w-4 bg-warm-gray/30 hover:bg-cream/50'}`}
                 aria-label={`Slide ${i+1}`}
               />
             ))}
          </div>
        </div>
      </section>

      {/* STATS / TRUST */}
      <section className="py-12 border-y border-warm-gray/10 bg-charcoal">
        <div className="max-w-[1440px] mx-auto px-6 overflow-hidden">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-x-24">
            {[
              "Based in the US",
              "Available Worldwide",
              "Vogue Featured",
              "Award Winning"
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-4">
                <span className="text-gold opacity-60 text-xs">✦</span>
                <span className="font-sans font-light text-xs md:text-sm tracking-[0.2em] uppercase text-cream/70">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION (EDITORIAL) */}
      <section id="about" ref={aboutRef} className="py-24 md:py-40 bg-charcoal relative">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-center">
          <div className="md:col-span-5 md:col-start-2">
            <div className="about-img relative aspect-[3/4] overflow-hidden rounded-sm" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
              <img src="/images/sofia.jpg" alt="Sofia Elara" className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/80 to-transparent"></div>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center">
            <span className="about-desc font-sans font-light text-[10px] text-gold tracking-[0.4em] uppercase mb-8 block">The Artist</span>
            <h2 className="about-heading font-serif text-4xl md:text-6xl text-cream leading-tight mb-8">
              <span className="block">A quietly</span>
              <span className="block italic text-warm-gray">unobtrusive</span>
              <span className="block">approach.</span>
            </h2>
            <div className="about-desc w-12 h-[1px] bg-gold/50 mb-8"></div>
            <p className="about-desc font-sans font-light text-base text-cream/70 leading-relaxed mb-8">
              Every love story holds a distinct rhythm. My goal is to capture your day with an editorial eye and a documentary heart. No awkward posing, just genuine moments suspended in time, elevated to high art.
            </p>
            <p className="about-desc font-sans font-light text-base text-cream/70 leading-relaxed mb-12">
              For over a decade, I've had the immense privilege of entering couples' most sacred days, extracting the poetry within the chaos, and delivering timeless imagery that feels like cinema.
            </p>
            <div className="about-desc">
               <span className="font-serif italic text-4xl text-gold" style={{ display: 'inline-block', transform: 'rotate(-3deg)' }}>Sofia Elara</span>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" ref={galleryRef} className="py-24 md:py-40 bg-charcoal-light">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-20 md:mb-32">
            <span className="font-sans font-light text-[10px] text-gold tracking-[0.4em] uppercase mb-6 block">Portfolio</span>
            <h2 className="font-serif italic text-5xl md:text-7xl text-cream">Visual Poetry</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            {/* Row 1 */}
            <div className="md:col-span-5 gallery-item aspect-[3/4] md:mt-24">
              <div className="w-full h-full relative overflow-hidden group rounded-sm">
                <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80" alt="Wedding Detail" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>
            <div className="md:col-span-7 gallery-item aspect-[4/3]">
              <div className="w-full h-full relative overflow-hidden group rounded-sm">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80" alt="Wedding Couple" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
              </div>
            </div>
            
            {/* Row 2 */}
            <div className="md:col-span-7 gallery-item aspect-[16/9] md:aspect-auto md:h-[600px]">
              <div className="w-full h-full relative overflow-hidden group rounded-sm">
                <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80" alt="Wedding Reception" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
              </div>
            </div>
            {/* Removed the negative top margin here to prevent structural overlap */}
            <div className="md:col-span-5 gallery-item aspect-[3/4]">
              <div className="w-full h-full relative overflow-hidden group rounded-sm">
                <img src="https://images.unsplash.com/photo-1546193430-c2d207739ed7?auto=format&fit=crop&w=1000&q=80" alt="Bridal Portrait" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
              </div>
            </div>
          </div>
          
          <div className="mt-20 md:mt-32 text-center">
             <a href="#contact" className="inline-block font-sans font-light text-xs tracking-widest uppercase px-12 py-5 border border-gold/40 text-cream hover:bg-gold hover:text-charcoal transition-all duration-500">
              View Complete Gallery
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-charcoal relative overflow-hidden flex items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Subtle large typography background */}
          <span className="font-serif italic text-[30vw] text-warm-gray absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-30">Kind Words</span>
        </div>
        
        <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
          <div className="relative min-h-[250px] flex flex-col justify-center items-center">
             {testimonials.map((t, i) => (
                <div key={i} className={`absolute inset-0 flex flex-col justify-center transition-all duration-1000 ease-in-out ${i === currentTestimonial ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-10 absolute'}`}>
                  <p className="font-serif italic text-2xl md:text-4xl text-cream/90 leading-relaxed mb-8">
                    "{t.text}"
                  </p>
                  <p className="font-sans font-light text-xs uppercase tracking-[0.3em] text-gold pt-4">
                    {t.names}
                  </p>
                </div>
             ))}
          </div>
          
          <div className="flex justify-center space-x-4 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`h-[1px] transition-all duration-500 ${i === currentTestimonial ? 'bg-gold w-16' : 'bg-warm-gray/30 w-8'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES (INVESTMENT) */}
      <section id="packages" ref={packagesRef} className="py-24 md:py-40 bg-charcoal-light">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-24">
            <span className="font-sans font-light text-[10px] text-gold tracking-[0.4em] uppercase mb-6 block">Investment</span>
            <h2 className="font-serif italic text-5xl md:text-7xl text-cream">Curated Collections</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {/* Essential */}
            <div className="package-card bg-charcoal p-12 flex flex-col justify-between border border-warm-gray/10 rounded-sm hover:border-gold/30 transition-colors duration-500">
              <div>
                <h3 className="font-sans font-light text-[11px] text-gold tracking-[0.3em] uppercase mb-6">The Essential</h3>
                <p className="font-serif italic text-4xl text-cream mb-8">Starting $2,400</p>
                <div className="w-full h-[1px] bg-warm-gray/10 mb-10"></div>
                <ul className="space-y-5 mb-12">
                  {['6 Hours Coverage', 'One Photographer', '400+ Edited Images', 'Online Gallery', 'Print Rights'].map((f, i) => (
                    <li key={i} className="font-sans font-light text-[13px] text-cream/70 flex items-center gap-4">
                      <span className="w-1 h-1 rounded-full bg-gold/50 block"></span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="w-full py-4 text-center font-sans font-light text-[11px] uppercase tracking-widest text-cream border border-warm-gray/30 hover:bg-cream hover:text-charcoal transition-all">Begin Inquiry</a>
            </div>

            {/* Signature */}
            <div className="package-card bg-charcoal p-12 flex flex-col justify-between border border-gold/40 relative rounded-sm transform md:-translate-y-6 shadow-2xl">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-charcoal px-4 py-1 border border-gold/40">
                <span className="font-sans font-light text-[9px] text-gold tracking-widest uppercase">Most Popular</span>
              </div>
              <div>
                <h3 className="font-sans font-light text-[11px] text-gold tracking-[0.3em] uppercase mb-6">The Signature</h3>
                <p className="font-serif italic text-4xl text-cream mb-8">Starting $3,800</p>
                <div className="w-full h-[1px] bg-warm-gray/10 mb-10"></div>
                <ul className="space-y-5 mb-12">
                  {['8 Hours Coverage', 'Two Photographers', '600+ Edited Images', 'Online Gallery', 'Engagement Session'].map((f, i) => (
                    <li key={i} className="font-sans font-light text-[13px] text-cream/70 flex items-center gap-4">
                      <span className="w-1 h-1 rounded-full bg-gold block"></span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="w-full py-4 text-center font-sans font-light text-[11px] uppercase tracking-widest text-charcoal bg-gold hover:bg-gold-light transition-all">Begin Inquiry</a>
            </div>

            {/* Comprehensive */}
            <div className="package-card bg-charcoal p-12 flex flex-col justify-between border border-warm-gray/10 rounded-sm hover:border-gold/30 transition-colors duration-500">
              <div>
                <h3 className="font-sans font-light text-[11px] text-gold tracking-[0.3em] uppercase mb-6">The Heirloom</h3>
                <p className="font-serif italic text-4xl text-cream mb-8">Starting $5,500</p>
                <div className="w-full h-[1px] bg-warm-gray/10 mb-10"></div>
                <ul className="space-y-5 mb-12">
                  {['10 Hours Coverage', 'Two Photographers', 'Film & Digital', 'Premium Album', 'Rehearsal Dinner'].map((f, i) => (
                    <li key={i} className="font-sans font-light text-[13px] text-cream/70 flex items-center gap-4">
                      <span className="w-1 h-1 rounded-full bg-gold/50 block"></span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="w-full py-4 text-center font-sans font-light text-[11px] uppercase tracking-widest text-cream border border-warm-gray/30 hover:bg-cream hover:text-charcoal transition-all">Begin Inquiry</a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={contactRef} className="py-24 md:py-40 bg-charcoal">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row gap-16 md:gap-24">
          <div className="contact-col md:w-5/12">
            <span className="font-sans font-light text-[10px] text-gold tracking-[0.4em] uppercase mb-6 block">Inquire</span>
            <h2 className="font-serif italic text-5xl md:text-6xl text-cream mb-8">Reserve Your Date</h2>
            <p className="font-sans font-light text-sm text-cream/60 leading-relaxed mb-12">
              Please share a few details about your celebration. I limit my commissions to 20 weddings per year to ensure the highest level of artistry and dedication for each couple.
            </p>
            <div className="space-y-6">
              <a href="mailto:hello@elaraphotography.com" className="flex items-center gap-4 text-cream/60 hover:text-gold transition-colors">
                <Mail size={16} strokeWidth={1} />
                <span className="font-sans font-light tracking-wide text-sm">hello@elaraphotography.com</span>
              </a>
              <a href="https://instagram.com" className="flex items-center gap-4 text-cream/60 hover:text-gold transition-colors">
                <Instagram size={16} strokeWidth={1} />
                <span className="font-sans font-light tracking-wide text-sm">@elara.photography</span>
              </a>
            </div>
          </div>
          
          <div className="contact-col md:w-7/12">
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col justify-center items-center text-center py-20 border border-warm-gray/10 bg-charcoal-light">
                <span className="font-serif italic text-4xl text-gold mb-4">Thank You</span>
                <p className="font-sans font-light text-cream/60 text-sm">Your inquiry has been received. I will respond within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <input required type="text" placeholder="Your Name" className="w-full bg-transparent border-b border-warm-gray/30 py-3 font-sans font-light text-sm text-cream placeholder-warm-gray focus:outline-none focus:border-gold transition-colors rounded-none" />
                  </div>
                  <div className="relative">
                    <input required type="text" placeholder="Partner's Name" className="w-full bg-transparent border-b border-warm-gray/30 py-3 font-sans font-light text-sm text-cream placeholder-warm-gray focus:outline-none focus:border-gold transition-colors rounded-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <input required type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-warm-gray/30 py-3 font-sans font-light text-sm text-cream placeholder-warm-gray focus:outline-none focus:border-gold transition-colors rounded-none" />
                  </div>
                  <div className="relative">
                    <input required type="date" className="w-full bg-transparent border-b border-warm-gray/30 py-3 font-sans font-light text-sm text-warm-gray focus:text-cream focus:outline-none focus:border-gold transition-colors appearance-none rounded-none" />
                  </div>
                </div>
                <div className="relative">
                   <select required className="w-full bg-transparent border-b border-warm-gray/30 py-3 font-sans font-light text-sm text-warm-gray focus:text-cream focus:outline-none focus:border-gold transition-colors block appearance-none rounded-none">
                      <option value="" disabled selected>Select Collection Preference</option>
                      <option value="essential">The Essential ($2,400+)</option>
                      <option value="signature">The Signature ($3,800+)</option>
                      <option value="heirloom">The Heirloom ($5,500+)</option>
                      <option value="unsure">Not sure yet</option>
                   </select>
                </div>
                <div className="relative">
                  <textarea required placeholder="Tell me about your vision, venue, and what drew you to my work..." rows="4" className="w-full bg-transparent border-b border-warm-gray/30 py-3 font-sans font-light text-sm text-cream placeholder-warm-gray focus:outline-none focus:border-gold transition-colors resize-none rounded-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-gold text-charcoal font-sans font-light text-[11px] uppercase tracking-widest py-6 hover:bg-gold-light transition-colors mt-4">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black-soft py-20 px-6 text-center border-t border-warm-gray/10">
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center">
          <span className="font-serif italic text-4xl text-cream mb-2">Elara</span>
          <span className="font-sans font-light text-[9px] text-warm-gray tracking-[0.4em] uppercase mb-12">Photography</span>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
            {['Gallery', 'About', 'Investment', 'Inquire'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="font-sans font-light text-xs tracking-widest uppercase text-cream/50 hover:text-gold transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="font-sans font-light text-[10px] text-cream/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Elara Photography. <br className="md:hidden"/> All Rights Reserved.
          </p>
        </div>
      </footer>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full border border-gold/40 bg-charcoal/80 backdrop-blur-md flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-500 z-40 hidden md:flex"
        >
          <ArrowUp size={18} strokeWidth={1} />
        </button>
      )}

    </div>
  );
}
