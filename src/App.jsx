import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowUp, Instagram, Mail, Phone, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredTestimonial, setHoveredTestimonial] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const trustRef = useRef(null);
  const galleryRef = useRef(null);
  const packagesRef = useRef(null);
  const contactRef = useRef(null);

  const heroSlides = ['/images/hero-1.jpg', '/images/hero-2.jpg', '/images/hero-3.jpg'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entry
      gsap.from(".hero-anim", {
        y: 30, opacity: 0, duration: 1.2,
        stagger: 0.15, ease: "power2.out", delay: 0.4
      });

      // Trust Bar
      gsap.from(trustRef.current, {
        scrollTrigger: { trigger: trustRef.current, start: "top 95%" },
        opacity: 0, y: 20, duration: 1, ease: "power2.out"
      });

      // About Section
      gsap.from(".about-text", {
        scrollTrigger: { trigger: ".about-text", start: "top 80%" },
        x: -40, opacity: 0, duration: 1.2, ease: "power2.out"
      });
      gsap.from(".about-img", {
        scrollTrigger: { trigger: ".about-img", start: "top 80%" },
        x: 40, opacity: 0, duration: 1.2, ease: "power2.out"
      });

      // Packages
      gsap.from(".package-card", {
        scrollTrigger: { trigger: packagesRef.current, start: "top 80%" },
        y: 40, opacity: 0, duration: 1, stagger: 0.18, ease: "power2.out"
      });

      // Contact Form
      gsap.from(".contact-col", {
        scrollTrigger: { trigger: contactRef.current, start: "top 80%" },
        y: 30, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power2.out"
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Testimonials
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      names: "Emily & James, New York",
      text: "Sofia captured our wedding day in a way that still takes our breath away. Every photo tells a story we didn't even know was happening. We cry happy tears every time we look through the gallery."
    },
    {
      names: "Rachel & Daniel, California",
      text: "We were nervous about photography but Sofia made us feel completely at ease. She blended into the background and the results were absolutely stunning — timeless, romantic, perfect."
    },
    {
      names: "Claire & Michael, Texas",
      text: "Booking Sofia was the best decision we made for our wedding. The photos arrived exactly as promised and they are beyond anything we imagined. We are forever grateful."
    }
  ];

  useEffect(() => {
    if (hoveredTestimonial) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length, hoveredTestimonial]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('success');
  };

  const imageHoverClass = "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.03]";

  return (
    <div className="relative font-sans text-charcoal bg-cream overflow-x-hidden clip-none">
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 clip-none ${scrolled || menuOpen ? 'bg-[#FAF8F5]/92 backdrop-blur-[12px] border-b-[0.5px] border-blush/20 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <a href="#" className="flex flex-col text-left">
            <span className={`font-serif italic text-[22px] leading-none ${scrolled || menuOpen ? 'text-charcoal' : 'text-white'}`}>Elara</span>
            <span className={`font-sans font-light text-[11px] tracking-[0.2em] uppercase mt-1 ${scrolled || menuOpen ? 'text-warm-gray' : 'text-white/80'}`}>Photography</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-10">
            {['Gallery', 'About', 'Packages', 'Contact'].map((item) => (
               <a key={item} href={`#${item.toLowerCase()}`} className={`font-sans font-light text-[13px] transition-colors duration-300 ${scrolled ? 'text-warm-gray hover:text-charcoal' : 'text-white/80 hover:text-white'}`}>
                 {item}
               </a>
            ))}
            <a href="#contact" className={`font-sans font-normal text-[12px] px-6 py-3 border-[0.5px] transition-colors duration-300 ${scrolled ? 'border-blush text-charcoal hover:bg-blush-light' : 'border-blush text-charcoal bg-white/10 hover:bg-blush hover:text-white'}`}>
              Book Your Date
            </a>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} className="text-charcoal"/> : <Menu size={28} className={scrolled ? 'text-charcoal' : 'text-white'}/>}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center space-y-8 clip-none">
          {['Gallery', 'About', 'Packages', 'Contact'].map((item) => (
             <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="font-serif italic text-4xl text-charcoal">
               {item}
             </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className="font-sans font-normal text-[12px] uppercase tracking-wider mt-8 px-8 py-4 border-[0.5px] border-blush text-charcoal hover:bg-blush-light">
            Book Your Date
          </a>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] w-full clip-none" ref={heroRef}>
        {heroSlides.map((src, index) => (
          <div 
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          >
            <img src={src} alt="Wedding photography" className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#1A1A1A]/35 via-[#1A1A1A]/15 to-[#1A1A1A]/50 pointer-events-none"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 md:bottom-[15%] h-[40%] flex flex-col items-center justify-end md:justify-center text-center px-4 pb-20 md:pb-0 z-20 w-full">
          <p className="hero-anim font-sans font-normal text-[11px] text-white/80 tracking-[0.4em] mb-4 uppercase">ELARA PHOTOGRAPHY</p>
          <h1 className="hero-anim font-serif italic text-[52px] md:text-[88px] text-white leading-[1.1] mb-4">
            Where love <br className="md:hidden"/>
            becomes art.
          </h1>
          <p className="hero-anim font-sans font-light text-[14px] text-white/75 tracking-[0.1em] mb-10">
            Wedding Photography &middot; Available Nationwide
          </p>
          
          <div className="hero-anim flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 mb-12">
            <a href="#contact" className="w-full sm:w-auto bg-blush text-white font-sans font-medium text-[13px] tracking-[0.1em] px-10 py-[18px] hover:bg-opacity-90 transition-all text-center">
              Book Your Date
            </a>
            <a href="#gallery" className="w-full sm:w-auto bg-transparent border-[0.5px] border-white text-white font-sans font-light text-[13px] tracking-[0.1em] px-10 py-[18px] hover:bg-white/10 transition-all text-center">
              View Gallery
            </a>
          </div>
          
          <div className="hero-anim hidden md:flex font-sans font-light text-[13px] text-white/90 tracking-wide justify-center items-center gap-6 uppercase">
            <span>✦ 5.0 on Google &middot; 312 Reviews</span>
            <span>✦ Licensed & Insured</span>
            <span>✦ Available Nationwide</span>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section ref={trustRef} className="bg-linen border-y-[0.5px] border-blush/20 py-5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto overflow-x-auto no-scrollbar whitespace-nowrap px-6">
          <div className="flex items-center space-x-8 md:space-x-12 md:justify-center">
            {[
              "5.0 Google Rating · 312 Reviews",
              "10+ Years Experience",
              "500+ Weddings Captured",
              "Licensed & Fully Insured",
              "Available Nationwide"
            ].map((item, i, arr) => (
              <React.Fragment key={item}>
                <span className="font-sans font-light text-[13px] text-charcoal tracking-wide flex items-center gap-3">
                  <span className="text-blush text-[10px]">✦</span> {item}
                </span>
                {i < arr.length - 1 && <span className="text-blush opacity-60 text-sm">&middot;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SOFIA */}
      <section id="about" className="py-24 md:py-32 px-6 lg:px-16 bg-cream overflow-hidden clip-none">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24" ref={aboutRef}>
          <div className="about-text w-full lg:w-[55%] flex flex-col items-start text-left">
            <span className="font-sans font-normal text-[10px] text-blush tracking-[0.3em] uppercase mb-6">ABOUT THE PHOTOGRAPHER</span>
            <h2 className="font-serif italic text-[36px] md:text-[44px] text-charcoal leading-[1.2] mb-8">
              "I believe every love story deserves to be told beautifully."
            </h2>
            <div className="w-[48px] h-[0.5px] bg-blush mb-10"></div>
            <p className="font-sans font-light text-[16px] text-warm-gray leading-[2.0] mb-12 max-w-xl">
              Hi, I'm Sofia — a fine art wedding photographer based in the United States, available to travel wherever your love story takes you. For over a decade, I've had the privilege of documenting real moments: the nervous laugh before the vows, the first look, the last dance. My approach is quiet, unobtrusive and deeply human. I'm not here to direct your wedding — I'm here to remember it for you.
            </p>
            <div className="mb-8">
              <span className="font-serif italic text-[32px] text-charcoal" style={{ transform: "rotate(-2deg)", display: 'inline-block' }}>Sofia Elara</span>
            </div>
            <a href="#about" className="font-sans font-light text-[13px] text-blush tracking-wide transition duration-300 hover:underline underline-offset-4 decoration-[0.5px]">
              Learn More About Sofia &rarr;
            </a>
          </div>
          <div className="about-img w-full lg:w-[45%]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src="/images/sofia.jpg" alt="Sofia Elara" loading="lazy" className="w-full h-full object-cover border-[0.5px] border-blush-light rounded-[2px]" />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 md:py-32 bg-linen clip-none" ref={galleryRef}>
        <div className="max-w-[1400px] mx-auto px-6 mb-16 text-center">
          <h2 className="text-[40px] md:text-[48px] leading-[1.1] mb-2 gallery-header">
            <span className="font-serif italic text-charcoal">A Glimpse of </span>
            <span className="font-serif italic text-blush">Their Stories.</span>
          </h2>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 gallery-anim">
          {/* Row 1: gallery-1 (tall) | gallery-2 (wide) */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="md:w-1/3 aspect-[3/4] overflow-hidden rounded-[2px]"><img src="/images/gallery-1.jpg" loading="lazy" className={imageHoverClass} /></div>
            <div className="md:w-2/3 aspect-[4/3] md:aspect-auto overflow-hidden rounded-[2px]"><img src="/images/gallery-2.jpg" loading="lazy" className={imageHoverClass} /></div>
          </div>
          {/* Row 2: gallery-3 (wide) | gallery-4 (tall) */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="md:w-2/3 aspect-[4/3] md:aspect-auto overflow-hidden rounded-[2px]"><img src="/images/gallery-3.jpg" loading="lazy" className={imageHoverClass} /></div>
            <div className="md:w-1/3 aspect-[3/4] overflow-hidden rounded-[2px]"><img src="/images/gallery-4.jpg" loading="lazy" className={imageHoverClass} /></div>
          </div>
          {/* Row 3: gallery-5 (square) | gallery-6 (square) */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 md:aspect-square overflow-hidden rounded-[2px]"><img src="/images/gallery-5.jpg" loading="lazy" className={imageHoverClass} /></div>
            <div className="md:w-1/2 md:aspect-square overflow-hidden rounded-[2px]"><img src="/images/gallery-6.jpg" loading="lazy" className={imageHoverClass} /></div>
          </div>
        </div>

        <div className="text-center mt-16 gallery-header">
          <a href="#gallery" className="font-sans font-light text-[13px] text-blush tracking-[0.1em] transition duration-300 hover:underline underline-offset-4 decoration-[0.5px]">
            View Full Gallery &rarr;
          </a>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-24 md:py-32 bg-cream clip-none">
        <div className="max-w-7xl mx-auto px-6 text-center" ref={packagesRef}>
          <h2 className="text-[40px] md:text-[48px] leading-[1.1] mb-6">
            <span className="font-serif italic text-charcoal">Investment </span>
            <span className="font-serif italic text-blush">in Forever.</span>
          </h2>
          <p className="font-sans font-light text-[14px] text-warm-gray max-w-2xl mx-auto mb-16">
            Every package includes full editing, online gallery delivery, and printing rights.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* The Essentials */}
            <div className="package-card bg-warm-white p-10 flex flex-col justify-between text-left rounded-[2px] border-[0.5px] border-blush/20">
              <div>
                <span className="font-sans font-normal text-[10px] text-blush tracking-[0.3em] uppercase block mb-4">THE ESSENTIALS</span>
                <p className="font-serif text-[36px] text-charcoal mb-6">Starting at $2,400</p>
                <div className="w-full h-[0.5px] bg-blush/30 mb-8"></div>
                <ul className="space-y-4 mb-10">
                  {['6 Hours Coverage', 'One Photographer', '400+ Edited Images', 'Online Gallery', 'Full Printing Rights'].map((f, i) => (
                    <li key={i} className="font-sans font-light text-[14px] text-warm-gray flex items-center gap-3">
                      <span className="text-blush">&middot;</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="block text-center w-full py-4 border-[0.5px] border-blush text-charcoal font-sans font-normal text-[13px] hover:bg-blush-light transition-colors">
                Inquire Now
              </a>
            </div>

            {/* The Signature */}
            <div className="package-card bg-warm-white p-10 flex flex-col justify-between text-left rounded-[2px] border border-blush relative shadow-sm">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-blush-light text-blush font-sans font-normal text-[9px] tracking-[0.2em] uppercase px-4 py-2">
                Most Popular
              </div>
              <div>
                <span className="font-sans font-normal text-[10px] text-blush tracking-[0.3em] uppercase block mb-4">THE SIGNATURE</span>
                <p className="font-serif text-[36px] text-charcoal mb-6">Starting at $3,800</p>
                <div className="w-full h-[0.5px] bg-blush/30 mb-8"></div>
                <ul className="space-y-4 mb-10">
                  {['8 Hours Coverage', 'Two Photographers', '600+ Edited Images', 'Online Gallery', 'Full Printing Rights', 'Engagement Session Included'].map((f, i) => (
                    <li key={i} className="font-sans font-light text-[14px] text-warm-gray flex items-center gap-3">
                      <span className="text-blush">&middot;</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="block text-center w-full py-4 bg-blush text-white font-sans font-medium text-[13px] hover:bg-blush/90 transition-colors">
                Inquire Now
              </a>
            </div>

            {/* The Collection */}
            <div className="package-card bg-warm-white p-10 flex flex-col justify-between text-left rounded-[2px] border-[0.5px] border-blush/20">
              <div>
                <span className="font-sans font-normal text-[10px] text-blush tracking-[0.3em] uppercase block mb-4">THE COLLECTION</span>
                <p className="font-serif text-[36px] text-charcoal mb-6">Starting at $5,500</p>
                <div className="w-full h-[0.5px] bg-blush/30 mb-8"></div>
                <ul className="space-y-4 mb-10">
                  {['Full Day Coverage (10h)', 'Two Photographers', '800+ Edited Images', 'Premium Album', 'Engagement Session', 'Rehearsal Dinner Coverage'].map((f, i) => (
                    <li key={i} className="font-sans font-light text-[14px] text-warm-gray flex items-center gap-3">
                      <span className="text-blush">&middot;</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="block text-center w-full py-4 border-[0.5px] border-blush text-charcoal font-sans font-normal text-[13px] hover:bg-blush-light transition-colors">
                Inquire Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-linen clip-none">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[40px] md:text-[44px] leading-[1.1] mb-16">
            <span className="font-serif italic text-charcoal">Words From </span>
            <span className="font-serif italic text-blush">the Heart.</span>
          </h2>

          <div 
            className="bg-warm-white p-10 md:p-16 relative rounded-[2px]"
            onMouseEnter={() => setHoveredTestimonial(true)}
            onMouseLeave={() => setHoveredTestimonial(false)}
          >
            <span className="absolute top-4 left-6 font-serif text-[120px] text-blush/15 leading-none select-none overflow-hidden h-[90px] block">"</span>
            <div className="relative z-10 min-h-[160px] flex flex-col justify-center">
              <p className="font-sans font-light italic text-[15px] md:text-[17px] text-warm-gray leading-[1.8] mb-8 relative z-10">
                {testimonials[currentTestimonial].text}
              </p>
              <p className="font-sans font-normal text-[13px] text-charcoal uppercase tracking-wider relative z-10">
                — {testimonials[currentTestimonial].names}
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentTestimonial ? 'bg-blush w-6' : 'bg-blush/30'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 md:py-32 bg-cream clip-none">
        <div className="max-w-7xl mx-auto px-6 lg:px-16" ref={contactRef}>
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Contact Info */}
            <div className="contact-col lg:w-1/2">
              <span className="font-sans font-normal text-[10px] text-blush tracking-[0.3em] uppercase mb-6 block">GET IN TOUCH</span>
              <h2 className="font-serif italic text-[40px] md:text-[44px] text-charcoal mb-8">
                Let's Tell Your Story.
              </h2>
              <p className="font-sans font-light text-[15px] text-warm-gray leading-[1.9] mb-12 max-w-md">
                Every great love story deserves to be remembered. I'd love to hear about your wedding day and see if we're the right fit. Fill out the form and I'll be in touch within 24 hours.
              </p>
              
              <div className="space-y-6 mb-12">
                <a href="mailto:hello@elaraphotography.com" className="flex items-center gap-4 text-warm-gray hover:text-charcoal transition-colors">
                  <Mail size={18} strokeWidth={1} />
                  <span className="font-sans font-light text-[13px]">hello@elaraphotography.com</span>
                </a>
                <a href="tel:+15552048800" className="flex items-center gap-4 text-warm-gray hover:text-charcoal transition-colors">
                  <Phone size={18} strokeWidth={1} />
                  <span className="font-sans font-light text-[13px]">(555) 204-8800</span>
                </a>
                <a href="#" className="flex items-center gap-4 text-warm-gray hover:text-charcoal transition-colors">
                  <Instagram size={18} strokeWidth={1} />
                  <span className="font-sans font-light text-[13px]">@elara.photography</span>
                </a>
              </div>
              <p className="font-sans font-light text-[12px] text-blush italic">
                I respond to all inquiries within 24 hours.
              </p>
            </div>

            {/* Contact Form */}
            <div className="contact-col lg:w-1/2">
              <div className="bg-warm-white p-8 md:p-12 border-[0.5px] border-blush/20 rounded-[2px] shadow-sm">
                {formStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                    <h3 className="font-serif italic text-3xl text-charcoal mb-4">Thank you!</h3>
                    <p className="font-sans font-light text-warm-gray text-[15px]">I'll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <input required type="text" placeholder="Your Name" className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal placeholder-warm-gray/60 focus:outline-none focus:border-blush transition-colors" />
                      </div>
                      <div className="relative">
                        <input required type="text" placeholder="Partner's Name" className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal placeholder-warm-gray/60 focus:outline-none focus:border-blush transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <input required type="email" placeholder="Email Address" className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal placeholder-warm-gray/60 focus:outline-none focus:border-blush transition-colors" />
                      </div>
                      <div className="relative">
                        <input required type="tel" placeholder="Phone Number" className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal placeholder-warm-gray/60 focus:outline-none focus:border-blush transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <input required type="date" placeholder="Wedding Date" className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal focus:outline-none focus:border-blush transition-colors" />
                      </div>
                      <div className="relative">
                        <input required type="text" placeholder="Wedding Location / Venue" className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal placeholder-warm-gray/60 focus:outline-none focus:border-blush transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <select required className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal focus:outline-none focus:border-blush transition-colors appearance-none">
                          <option value="" disabled selected>Package Interest</option>
                          <option>The Essentials</option>
                          <option>The Signature</option>
                          <option>The Collection</option>
                          <option>Not Sure Yet</option>
                        </select>
                      </div>
                      <div className="relative">
                        <select required className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal focus:outline-none focus:border-blush transition-colors appearance-none">
                          <option value="" disabled selected>How did you hear about us?</option>
                          <option>Google</option>
                          <option>Instagram</option>
                          <option>Pinterest</option>
                          <option>Wedding Wire</option>
                          <option>Referred by a Friend</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea required placeholder="Tell me about your love story" rows="4" className="w-full bg-transparent border-b-[0.5px] border-blush-light py-2 font-sans font-light text-[14px] text-charcoal placeholder-warm-gray/60 focus:outline-none focus:border-blush transition-colors resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blush text-white font-sans font-medium text-[13px] tracking-[0.1em] py-5 mt-4 hover:bg-[#c2988b] transition-colors rounded-[2px]">
                      Send My Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal pt-20 pb-12 px-6 flex flex-col items-center text-center clip-none">
        <div className="flex flex-col mb-10">
          <span className="font-serif italic text-3xl text-white">Elara</span>
          <span className="font-sans font-light text-[12px] tracking-[0.3em] uppercase mt-1 text-white/50">Photography</span>
        </div>
        
        <div className="w-[48px] h-[0.5px] bg-blush mb-10"></div>
        
        <p className="font-serif italic text-[18px] text-white/60 mb-12">
          "Where love becomes art."
        </p>
        
        <div className="flex items-center space-x-8 mb-16">
          {['Gallery', 'About', 'Packages', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-sans font-light text-[12px] tracking-wide text-white/50 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <p className="font-sans font-light text-[11px] text-white/35">
            &copy; {new Date().getFullYear()} Elara Photography &middot; All Rights Reserved &middot; hello@elaraphotography.com
          </p>
          <p className="font-sans font-light text-[10px] italic text-white/25">
            This is a demo page created for portfolio purposes.
          </p>
        </div>
      </footer>

      {/* FLOATING CTA (Mobile) & SCROLL TO TOP */}
      <div className={`fixed bottom-0 left-0 w-full md:hidden bg-cream/95 backdrop-blur-md border-t-[0.5px] border-blush-light p-4 flex justify-between items-center transition-transform duration-500 z-40 ${scrolled ? 'translate-y-0' : 'translate-y-full'}`}>
        <a href="tel:+15552048800" className="flex items-center gap-2 text-charcoal ml-2">
          <Phone size={16} className="text-blush"/>
          <span className="font-sans font-light text-[13px] underline decoration-[0.5px] underline-offset-4 decoration-blush">Call Now</span>
        </a>
        <a href="#contact" className="bg-blush text-white font-sans font-medium text-[12px] tracking-wide px-6 py-3 shadow-[0_4px_10px_rgba(212,168,154,0.3)]">
          Book Your Date
        </a>
      </div>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="hidden md:flex fixed bottom-8 right-8 w-12 h-12 rounded-full border-[0.5px] border-blush bg-cream items-center justify-center text-blush hover:bg-blush hover:text-white transition-all duration-300 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} strokeWidth={1} />
        </button>
      )}

    </div>
  );
}
