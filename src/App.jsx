import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Menu, X, ArrowDown } from 'lucide-react';
import LenisProvider, { useLenis } from './components/LenisProvider';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [activeService, setActiveService] = useState(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const horizontalScrollRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const mobileCarouselRef = useRef(null);
  const lenis = useLenis();

  // Snappy Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Highly visible cursor springs
  const dotX = useSpring(-100, { stiffness: 600, damping: 35 });
  const dotY = useSpring(-100, { stiffness: 600, damping: 35 });
  const ringX = useSpring(-100, { stiffness: 300, damping: 25 });
  const ringY = useSpring(-100, { stiffness: 300, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('header a') || target.closest('header button')) {
        setCursorText("");
      } else if (target.closest('a') || target.closest('button')) {
        setCursorText("VIEW");
      } else if (target.closest('.group-hover-reveal')) {
        setCursorText("DRAG");
      } else {
        setCursorText("");
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.body.classList.add('custom-cursor-active');

    const handleMouseEnter = () => setCursorVisible(true);
    const handleMouseLeave = () => setCursorVisible(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dotX, dotY, ringX, ringY]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(targetId, {
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  // Custom robust scroll listener for horizontal gallery translation
  useEffect(() => {
    const handleScroll = () => {
      if (horizontalScrollRef.current && scrollContainerRef.current) {
        if (window.innerWidth < 768) {
          scrollContainerRef.current.style.transform = '';
          return;
        }

        const rect = horizontalScrollRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const range = scrollWidth - viewportWidth;

        if (range > 0 && elementHeight > viewportHeight) {
          const progress = -rect.top / (elementHeight - viewportHeight);
          const clamped = Math.max(0, Math.min(1, progress));
          scrollContainerRef.current.style.transform = `translateX(-${clamped * range}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();
    const timer = setTimeout(handleScroll, 200);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleMobileScroll = () => {
    if (mobileCarouselRef.current) {
      const { scrollLeft, clientWidth } = mobileCarouselRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.85)); // 85vw width card
      setActiveProjectIndex(Math.max(0, Math.min(projects.length - 1, index)));
    }
  };

  const projects = [
    {
      num: "01",
      title: "Silent Horizon",
      category: "Creative Direction & Dev",
      description: "A digital curation platform for modernist architects.",
      tag: "Minimalism",
      subtext: "Architectural storytelling.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
      num: "02",
      title: "Chroma Studio",
      category: "Brand Identity",
      description: "Visual system designed for an art publication.",
      tag: "Branding",
      subtext: "Editorial brutalist identity.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    },
    {
      num: "03",
      title: "Finity Lab",
      category: "Interaction Design",
      description: "High-performance experimental algorithmic visualizer.",
      tag: "Development",
      subtext: "Fluid canvas layouts.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
    },
    {
      num: "04",
      title: "Echo Valley",
      category: "Film & Campaign",
      description: "A campaign launch for an ethical fashion house.",
      tag: "Motion Curation",
      subtext: "Atmospheric motion grids.",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const services = [
    {
      num: "01",
      name: "Creative Curation",
      description: "Crafting distinct visual narratives that position brands ahead of global trends. We build design systems that prioritize restraint, geometry, and purpose.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
      num: "02",
      name: "High-End Development",
      description: "Transforming design mockups into digital realities. Utilizing React and custom-tailored smooth motion solutions for a premium touch.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
    },
    {
      num: "03",
      name: "Identity & Typography",
      description: "We solve identity problems through typography. Bespoke typographic layout systems designed to command digital layouts and physical print.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Framer Motion variants for mobile menu overlay
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 30 },
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        /* Minimal Preloader */
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 bg-[#FFFFFF] z-50 flex flex-col items-center justify-center"
        >
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-serif text-black tracking-tight"
            >
              Veil Studio
            </motion.h1>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="h-[1px] bg-black/25 mt-4"
          />
        </motion.div>
      ) : (
        /* Main Application Content */
        <div key="content">
          {/* Enhanced Dual Custom Cursor (High Visibility) */}
          {cursorVisible && (
            <>
              {/* Central Dot */}
              <motion.div
                style={{
                  x: dotX,
                  y: dotY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                className="hidden md:block fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
              />
              {/* Trailing Ring */}
              <motion.div
                style={{
                  x: ringX,
                  y: ringY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                animate={{
                  scale: cursorText ? 3.0 : 1.0,
                  borderWidth: cursorText ? "1px" : "1.5px",
                }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                className="hidden md:flex fixed w-10 h-10 border border-white rounded-full pointer-events-none z-50 mix-blend-difference items-center justify-center"
              >
                {cursorText && (
                  <span className="text-[3px] font-mono text-white font-bold tracking-widest uppercase origin-center scale-50">
                    {cursorText}
                  </span>
                )}
              </motion.div>
            </>
          )}

          {/* Navigation Header */}
          <header className="fixed top-0 left-0 w-full z-50 border-b border-black/5 bg-white/70 backdrop-blur-md px-6 md:px-12 py-6 flex justify-between items-center mix-blend-normal">
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="font-serif text-2xl font-bold tracking-tight z-50"
            >
              Veil<span className="font-light italic text-neutral-400"> Studio</span>
            </a>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-10 text-xs tracking-widest font-mono uppercase">
              <a 
                href="#work" 
                onClick={(e) => handleNavClick(e, '#work')}
                className="px-3 py-2 hover:bg-neutral-900 hover:text-white transition-all duration-300 border border-transparent hover:border-neutral-900"
              >
                Projects
              </a>
              <a 
                href="#services" 
                onClick={(e) => handleNavClick(e, '#services')}
                className="px-3 py-2 hover:bg-neutral-900 hover:text-white transition-all duration-300 border border-transparent hover:border-neutral-900"
              >
                Services
              </a>
              <a 
                href="#about" 
                onClick={(e) => handleNavClick(e, '#about')}
                className="px-3 py-2 hover:bg-neutral-900 hover:text-white transition-all duration-300 border border-transparent hover:border-neutral-900"
              >
                About
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, '#contact')}
                className="px-3 py-2 hover:bg-neutral-900 hover:text-white transition-all duration-300 border border-transparent hover:border-neutral-900"
              >
                Contact
              </a>
            </nav>

            {/* Mobile Navigation Trigger */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-black hover:bg-neutral-900 hover:text-white transition-all duration-300 rounded-full z-50 flex items-center justify-center"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </header>

          {/* Mobile Full-Screen Overlay Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 bg-[#FFFFFF] z-40 pt-32 px-8 flex flex-col justify-between pb-12 md:hidden"
              >
                <div className="flex flex-col gap-6 text-4xl sm:text-5xl font-serif text-left mt-8">
                  <div className="overflow-hidden">
                    <motion.div variants={linkVariants}>
                      <a 
                        href="#work" 
                        onClick={(e) => handleNavClick(e, '#work')}
                        className="block border-b border-neutral-100 pb-3 text-black hover:text-neutral-500 transition-colors"
                      >
                        Projects
                      </a>
                    </motion.div>
                  </div>
                  <div className="overflow-hidden">
                    <motion.div variants={linkVariants}>
                      <a 
                        href="#services" 
                        onClick={(e) => handleNavClick(e, '#services')}
                        className="block border-b border-neutral-100 pb-3 text-black hover:text-neutral-500 transition-colors"
                      >
                        Services
                      </a>
                    </motion.div>
                  </div>
                  <div className="overflow-hidden">
                    <motion.div variants={linkVariants}>
                      <a 
                        href="#about" 
                        onClick={(e) => handleNavClick(e, '#about')}
                        className="block border-b border-neutral-100 pb-3 text-black hover:text-neutral-500 transition-colors"
                      >
                        About
                      </a>
                    </motion.div>
                  </div>
                  <div className="overflow-hidden">
                    <motion.div variants={linkVariants}>
                      <a 
                        href="#contact" 
                        onClick={(e) => handleNavClick(e, '#contact')}
                        className="block border-b border-neutral-100 pb-3 text-black hover:text-neutral-500 transition-colors"
                      >
                        Contact
                      </a>
                    </motion.div>
                  </div>
                </div>

                {/* Mobile Drawer Footer */}
                <motion.div 
                  variants={linkVariants}
                  className="flex flex-col gap-4 border-t border-neutral-100 pt-6 font-mono text-xs uppercase tracking-widest text-neutral-400"
                >
                  <div>
                    <span className="block text-[10px] text-neutral-400 mb-1">Direct Inquiries</span>
                    <a href="mailto:hello@veil.studio" className="text-black text-sm font-sans tracking-normal lowercase font-light hover:text-neutral-500 transition-colors">hello@veil.studio</a>
                  </div>
                  <div className="flex gap-6 mt-2">
                    <a href="https://twitter.com/veilstudio" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-black">Twitter</a>
                    <a href="https://instagram.com/veilstudio" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-black">Instagram</a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="w-full bg-white">
            {/* Section 1: Hero */}
            <section 
              id="hero" 
              className="min-h-screen flex flex-col justify-center px-6 md:px-16 pt-32 relative bg-[#FFFFFF] overflow-hidden"
            >
              <div className="w-full max-w-6xl mx-auto flex flex-col justify-center relative z-10">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light leading-none tracking-tighter"
                >
                  We craft <br />
                  <span className="italic font-normal text-neutral-400">thoughtful</span> <br />
                  digital spaces.
                </motion.h1>

                {/* Direct CTA Button for immediate navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="mt-10"
                >
                  <a 
                    href="#contact" 
                    onClick={(e) => handleNavClick(e, '#contact')}
                    className="inline-flex items-center gap-3 text-xs tracking-widest font-mono uppercase group border border-black bg-black text-white px-8 py-4 hover:bg-neutral-800 transition-all duration-300"
                  >
                    Send inquiry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </div>

              <div className="w-full max-w-6xl mx-auto mt-8 flex flex-col md:flex-row md:items-center justify-between border-t border-black/10 pt-10 gap-8 relative z-10">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="font-mono text-xs tracking-widest text-neutral-400 uppercase"
                >
                  EST. 2026 / TOKYO & NEW YORK
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-light italic">Scroll to experience</span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  >
                    <ArrowDown className="w-4 h-4 text-neutral-400" />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Section 2: Work */}
            <section ref={horizontalScrollRef} id="work" className="relative h-auto md:h-[250vh] bg-white">
              <div className="relative md:sticky md:top-0 md:h-screen w-full flex flex-col justify-center md:overflow-hidden py-16 md:py-0">
                <div className="max-w-6xl w-full mx-auto px-6 md:px-16 mb-12 md:mb-8 flex justify-between items-baseline">
                  <h2 className="text-3xl md:text-5xl font-serif font-light">Selected Work</h2>
                  <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
                    (04 PORTFOLIO)
                  </span>
                </div>

                {/* Horizontal list for desktop */}
                <div className="hidden md:block w-full">
                  <motion.div 
                    ref={scrollContainerRef}
                    className="flex gap-16 px-16 w-max"
                  >
                    {projects.map((project, i) => (
                      <div 
                        key={project.title}
                        className="w-[450px] shrink-0 border-t border-black pt-8 group-hover-reveal"
                      >
                        <span className="font-mono text-xs tracking-wider block mb-4">{project.num} / {project.category}</span>
                        <h3 className="text-4xl font-serif font-light mb-6">
                          {project.title}
                        </h3>
                        <p className="text-sm text-neutral-500 font-light leading-relaxed mb-8 h-12">
                          {project.description}
                        </p>
                        <div className="aspect-[4/3] w-full relative overflow-hidden border border-black/5 hover:-translate-y-2 transition-transform duration-500">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover grayscale contrast-115 hover:grayscale-0 transition-all duration-700 ease-out" 
                          />
                          <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-all duration-500 flex flex-col justify-between p-6 text-white z-10">
                            <span className="text-xs font-mono uppercase tracking-widest bg-black/40 px-2 py-1 align-baseline w-max">{project.tag}</span>
                            <div className="flex justify-between items-center bg-black/40 p-2">
                              <span className="text-xs font-light italic">{project.subtext}</span>
                              <ArrowUpRight className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Horizontal swipeable list for mobile */}
                <div 
                  ref={mobileCarouselRef}
                  onScroll={handleMobileScroll}
                  className="block md:hidden w-full overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-4"
                >
                  <div className="flex gap-6 px-6 w-max">
                    {projects.map((project, i) => (
                      <div 
                        key={project.title} 
                        className="w-[80vw] sm:w-[400px] shrink-0 snap-start border-t border-black pt-8"
                      >
                        <span className="font-mono text-xs tracking-wider block mb-3">{project.num} / {project.category}</span>
                        <h3 className="text-3xl font-serif font-light mb-3">{project.title}</h3>
                        <p className="text-sm text-neutral-500 font-light leading-relaxed mb-5 h-16">
                          {project.description}
                        </p>
                        <div className="aspect-[4/3] w-full relative overflow-hidden border border-black/5">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover grayscale contrast-115" 
                          />
                          <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-6 text-white z-10">
                            <span className="text-xs font-mono uppercase tracking-widest bg-black/40 px-2 py-1 align-baseline w-max">{project.tag}</span>
                            <div className="flex justify-between items-center bg-black/40 p-2">
                              <span className="text-xs font-light italic">{project.subtext}</span>
                              <ArrowUpRight className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium swipe indicator dots for mobile */}
                <div className="flex md:hidden justify-center items-center gap-2 mt-4">
                  {projects.map((_, i) => (
                    <span 
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeProjectIndex === i ? 'w-6 bg-black' : 'w-1.5 bg-neutral-300'}`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Services */}
            <section id="services" className="py-32 px-6 md:px-16 bg-white relative z-10 border-t border-black/5">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-between items-baseline border-b border-black pb-8 mb-16"
                >
                  <h2 className="text-3xl md:text-5xl font-serif font-light">Capabilities</h2>
                  <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
                    (WHAT WE DO)
                  </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                      onClick={() => setActiveService(activeService === index ? null : index)}
                      className={`p-8 bg-[#F5F0E8] border border-black/5 flex flex-col justify-between min-h-[350px] transition-all duration-500 md:hover:-translate-y-2 md:hover:text-white group relative overflow-hidden cursor-pointer text-white md:text-black ${activeService === index ? 'md:text-white -translate-y-2' : ''}`}
                    >
                      {/* Hover/Tap Background Image Reveal */}
                      <div className={`absolute inset-0 z-0 transition-opacity duration-700 ease-out opacity-100 md:opacity-0 md:group-hover:opacity-100 ${activeService === index ? 'md:opacity-100' : ''}`}>
                        <div className="absolute inset-0 bg-neutral-900/80 md:bg-neutral-900/85 z-10"></div>
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          className="w-full h-full object-cover grayscale scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                        />
                      </div>

                      {/* Card Content */}
                      <span className={`font-mono text-sm block mb-6 text-neutral-200 md:text-neutral-500 md:group-hover:text-neutral-200 relative z-10 transition-colors duration-500 ${activeService === index ? 'md:text-neutral-200' : ''}`}>{service.num}</span>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-serif font-medium mb-4">{service.name}</h3>
                        <p className={`text-sm text-white md:text-neutral-600 md:group-hover:text-white transition-colors duration-500 ${activeService === index ? 'md:text-white' : ''}`}>
                          {service.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4: About */}
            <section id="about" className="py-32 px-6 md:px-16 bg-white relative z-10 border-t border-black/5">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="aspect-square relative overflow-hidden border border-black/5"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" 
                      alt="About philosophy" 
                      className="absolute inset-0 w-full h-full object-cover grayscale contrast-105"
                    />
                    <div className="absolute inset-0 bg-black/45 flex flex-col justify-between p-6 md:p-12 text-white">
                      <span className="font-mono text-xs tracking-widest uppercase bg-black/60 w-max px-2 py-1">
                        EST. 2026 / PHILOSOPHY
                      </span>
                      <div className="max-w-xs bg-black/75 p-4 border border-white/10 rounded-sm">
                        <h4 className="font-serif text-2xl font-light italic mb-2 text-white">Simplicity</h4>
                        <p className="text-xs text-white font-medium leading-relaxed">
                          "Complexity is easy. Simplicity is difficult. Designing something beautiful means deleting everything else."
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="flex flex-col gap-6"
                  >
                    <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
                      ABOUT VEIL STUDIO
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">
                      Design built to withstand time.
                    </h2>
                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                      We are a compact, multidisciplinary creative studio partnering with forward-thinking individuals and organizations to build products, brands, and immersive platforms. 
                    </p>
                    <p className="text-sm text-neutral-600 font-light leading-relaxed">
                      By strictly limiting the amount of projects we take each year, we ensure deep design immersion, precision development, and absolute consistency from conception to launch.
                    </p>
                    <div className="mt-4">
                      <a 
                        href="#contact" 
                        onClick={(e) => handleNavClick(e, '#contact')}
                        className="inline-flex items-center gap-3 text-xs tracking-widest font-mono uppercase group border border-black bg-black text-white px-6 py-3 hover:bg-neutral-800 transition-all duration-300"
                      >
                        Read our manifesto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Section 5: Contact */}
            <section id="contact" className="py-32 px-6 md:px-16 bg-white relative z-10 border-t border-black/5">
              <div className="max-w-6xl mx-auto pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  
                  {/* Form Side */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-3xl md:text-5xl font-serif font-light mb-12">Start a conversation.</h2>
                    
                    <form onSubmit={handleContactSubmit} className="flex flex-col gap-8">
                      <div className="border-b border-black py-4">
                        <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">My name is</label>
                        <input 
                          id="name"
                          name="name"
                          type="text" 
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Jane Doe" 
                          className="w-full bg-transparent text-base md:text-xl font-light py-2 focus:outline-none"
                        />
                      </div>
                      
                      <div className="border-b border-black py-4">
                        <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">My email is</label>
                        <input 
                          id="email"
                          name="email"
                          type="email" 
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jane@example.com" 
                          className="w-full bg-transparent text-base md:text-xl font-light py-2 focus:outline-none"
                        />
                      </div>

                      <div className="border-b border-black py-4">
                        <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">We need help with</label>
                        <textarea 
                          id="message"
                          name="message"
                          rows={3}
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="A digital project launching next fall..." 
                          className="w-full bg-transparent text-base md:text-xl font-light py-2 resize-none focus:outline-none"
                        />
                      </div>

                      <div>
                        <button 
                          type="submit"
                          className="inline-flex items-center gap-4 border border-black bg-black text-white px-8 py-4 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300"
                        >
                          Send inquiry <ArrowRight size={16} />
                        </button>
                      </div>
                    </form>

                    {submitSuccess && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 font-mono text-xs text-neutral-500 uppercase tracking-widest"
                      >
                        Thank you. We will respond within 24 hours.
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Huge Email Side */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col justify-between"
                  >
                    <div className="lg:text-right">
                      <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase block mb-4">
                        DIRECT INQUIRIES
                      </span>
                      <a 
                        href="mailto:hello@veil.studio" 
                        className="text-2xl md:text-3xl lg:text-4xl font-serif font-light hover:text-neutral-400 transition-colors duration-300 break-all"
                      >
                        hello@veil.studio
                      </a>
                    </div>

                    <div className="mt-16 lg:mt-0 flex flex-col md:flex-row justify-between gap-8 pt-8 border-t border-black/10">
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Tokyo Office</h4>
                        <p className="text-xs font-light text-neutral-600">Shibuya 2-Chome, 15-1<br />Tokyo, JP</p>
                      </div>
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">New York Studio</h4>
                        <p className="text-xs font-light text-neutral-600">120 Wooster Street<br />New York, NY 10012</p>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t border-black/10 py-12 px-6 md:px-16 bg-white relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-400 font-mono tracking-widest uppercase">
              <p>© 2026 VEIL STUDIO. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                <a href="https://twitter.com/veilstudio" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors duration-300">Twitter</a>
                <a href="https://instagram.com/veilstudio" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors duration-300">Instagram</a>
                <a href="https://linkedin.com/company/veilstudio" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors duration-300">LinkedIn</a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <LenisProvider>
      <AppContent />
    </LenisProvider>
  );
}
