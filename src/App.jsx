import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

/**
 * ADITYA PATIL PORTFOLIO - Ultimate Edition
 * Features: Laptop 3D Scene, Advanced Scroll Parallax, Staggered Reveals, Marquee Scroll
 */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Inter:wght@300;400;500;600&display=swap');
  
  :root {
    --accent: #ffffff;
    --bg: #000000;
    --secondary-bg: #0a0a0a;
    --border: rgba(255, 255, 255, 0.08);
  }

  html { scroll-behavior: smooth; }

  body {
    background-color: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--accent);
    overflow-x: hidden;
  }

  .font-outfit { font-family: 'Outfit', sans-serif; }

  .nav-blur {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: saturate(180%) blur(20px);
  }

  .noise-bg::before {
    content: "";
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    opacity: 0.03;
    z-index: 50;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: #333; }

  .glow-mesh {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    z-index: -1;
  }
`;

// --- Enhanced Laptop Scene Component ---
const LaptopScene = ({ scrollProgress }) => {
  const containerRef = useRef();
  const screenRef = useRef();
  const hingeRef = useRef();
  const laptopGroupRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll mapping for hinge angle 
  const laptopHinge = useTransform(scrollProgress, [0, 0.3], [0.5, 1.9]);
  const springHinge = useSpring(laptopHinge, { damping: 20, stiffness: 80 });
  
  // Screen light/intensity
  const screenIntensity = useTransform(scrollProgress, [0, 0.2], [0, 1.5]);
  const springIntensity = useSpring(screenIntensity, { damping: 20 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0066ff, 10, 20);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x9d00ff, 5, 20);
    purpleLight.position.set(-5, -5, 5);
    scene.add(purpleLight);

    // Fake UI Texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(canvas);

    const drawUI = (time) => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '24px Courier New';
      for(let i=0; i<20; i++) {
        const opacity = (Math.sin(time + i * 0.5) + 1) / 2;
        ctx.fillStyle = `rgba(100, 200, 255, ${opacity * 0.5})`;
        ctx.fillRect(40, 40 + (i * 35), 200 + Math.sin(time + i) * 100, 15);
      }
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      ctx.strokeRect(400, 40, 580, 400);
      ctx.fillStyle = '#111';
      ctx.fillRect(400, 40, 580, 400);
      ctx.fillStyle = '#222';
      ctx.fillRect(420, 460, 270, 250);
      ctx.fillRect(710, 460, 270, 250);
      screenTexture.needsUpdate = true;
    };

    const laptopGroup = new THREE.Group();
    laptopGroupRef.current = laptopGroup;

    const baseGeo = new THREE.BoxGeometry(3.5, 0.1, 2.5);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    laptopGroup.add(base);

    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.05, -1.25); 
    hingeRef.current = screenGroup;

    const lidGeo = new THREE.BoxGeometry(3.5, 2.5, 0.08);
    const lid = new THREE.Mesh(lidGeo, baseMat);
    lid.position.set(0, 1.25, 0); 
    screenGroup.add(lid);

    const displayGeo = new THREE.PlaneGeometry(3.3, 2.3);
    const displayMat = new THREE.MeshStandardMaterial({ 
      map: screenTexture, 
      emissive: 0xffffff,
      emissiveIntensity: 0,
      emissiveMap: screenTexture
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 1.25, 0.05);
    screenRef.current = display;
    screenGroup.add(display);

    laptopGroup.add(screenGroup);
    laptopGroup.rotation.y = -Math.PI / 6; 
    scene.add(laptopGroup);

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const animate = () => {
      const time = Date.now() * 0.001;
      drawUI(time);

      if (laptopGroupRef.current) {
        laptopGroupRef.current.position.y = Math.sin(time) * 0.05;
        laptopGroupRef.current.rotation.x = THREE.MathUtils.lerp(laptopGroupRef.current.rotation.x, mouseY.get() * 0.3, 0.1);
        laptopGroupRef.current.rotation.y = THREE.MathUtils.lerp(laptopGroupRef.current.rotation.y, -Math.PI/6 + mouseX.get() * 0.4, 0.1);
      }

      if (hingeRef.current) hingeRef.current.rotation.x = -springHinge.get();
      if (screenRef.current) screenRef.current.material.emissiveIntensity = springIntensity.get();

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[500px]" />;
};

const SectionTitle = ({ children, subtitle }) => {
  const words = children.split(" ");
  return (
    <div className="mb-20">
      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-[11px] font-bold tracking-[0.4em] uppercase text-gray-600 mb-4"
      >
        // {subtitle}
      </motion.p>
      <h2 className="text-5xl md:text-7xl font-outfit font-black tracking-tighter text-white overflow-hidden flex flex-wrap gap-x-4">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </h2>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Custom Cursor Springs
  const springX = useSpring(0, { damping: 35, stiffness: 350 });
  const springY = useSpring(0, { damping: 35, stiffness: 350 });

  // Scroll Animations (Hero Parallax)
  const heroTextY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Scroll Animations (Marquees)
  const marquee1X = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const marquee2X = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  // Scroll Animations (Footer)
  const footerScale = useTransform(scrollYProgress, [0.8, 1], [0.5, 1]);
  const footerOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  useEffect(() => {
    const handleMouse = (e) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="relative antialiased selection:bg-white selection:text-black noise-bg">
      <style>{STYLES}</style>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[1000]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Interactive Cursor */}
      <motion.div 
        className={`fixed top-0 left-0 rounded-full border border-white pointer-events-none z-[999] hidden lg:flex items-center justify-center transition-all duration-300 ${isHovered ? 'w-24 h-24 bg-white/10 backdrop-blur-sm' : 'w-10 h-10'}`}
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        {isHovered && <span className="text-[10px] font-bold text-white tracking-widest uppercase">Click</span>}
      </motion.div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-6 md:px-12 py-6 flex justify-between items-center nav-blur border-b border-white/5">
        <motion.a 
          whileHover={{ scale: 1.1 }} 
          href="#home" 
          className="text-xl font-outfit font-black tracking-tighter text-white"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
          ADITYA.
        </motion.a>
        <div className="hidden md:flex gap-12 text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
          {['Home', 'About', 'Work', 'Blogs', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="hover:text-white transition-colors"
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
            >
              {item}
            </a>
          ))}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 z-[101]">
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-0' : ''}`} />
        </button>
      </nav>

      <main>
        {/* 1. HERO SECTION */}
        <section id="home" className="relative min-h-screen flex items-center px-6 md:px-20 pt-20 overflow-hidden">
          <div className="glow-mesh top-[10%] left-[-10%] opacity-40" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-center">
            <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[12px] font-black tracking-[0.5em] text-gray-500 mb-8 uppercase"
              >
                Creative Software Engineer
              </motion.h2>
              
              <h1 className="text-7xl md:text-[130px] font-outfit font-black tracking-tighter leading-[0.85] mb-12 text-white overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="block"
                >
                  CRAFTING
                </motion.span>
                <motion.span 
                  initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} 
                  className="block text-gray-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.4)]"
                >
                  DIGITAL.
                </motion.span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} 
                className="max-w-md text-lg text-gray-400 leading-relaxed mb-14"
              >
                Scalable solutions. Premium interfaces. High-performance code. I build the tools that drive the future.
              </motion.p>
              
              <motion.a 
                href="#work"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05, backgroundColor: "#e5e5e5" }}
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black text-[12px] font-black tracking-widest uppercase rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                Launch Projects →
              </motion.a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="relative h-[600px] lg:h-[800px] w-full"
            >
               <LaptopScene scrollProgress={scrollYProgress} />
               <div className="glow-mesh bottom-[10%] right-[10%] w-[400px] h-[400px] bg-blue-600/10" />
            </motion.div>
          </div>
        </section>

        {/* PARALLAX MARQUEE BREAK */}
        <section className="py-20 bg-black overflow-hidden flex flex-col gap-4 border-y border-white/5">
          <motion.div style={{ x: marquee1X }} className="whitespace-nowrap flex">
            <h2 className="text-7xl md:text-9xl font-outfit font-black text-transparent stroke-text opacity-30 uppercase tracking-tighter" style={{ WebkitTextStroke: "1px white" }}>
              Creative Developer • UI/UX Designer • 3D Enthusiast • Creative Developer • UI/UX Designer • 3D Enthusiast • 
            </h2>
          </motion.div>
          <motion.div style={{ x: marquee2X }} className="whitespace-nowrap flex">
            <h2 className="text-7xl md:text-9xl font-outfit font-black text-white/10 uppercase tracking-tighter">
              Performance • Scalability • Innovation • Performance • Scalability • Innovation • Performance • Scalability • 
            </h2>
          </motion.div>
        </section>

        {/* 2. ABOUT SECTION */}
        <section id="about" className="py-40 px-6 md:px-20 bg-[#050505] relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              <div className="lg:col-span-8">
                <SectionTitle subtitle="Vision">Architecture of Thought</SectionTitle>
                
                <div className="space-y-12 text-2xl md:text-4xl font-outfit font-light text-gray-300 leading-tight">
                  <motion.p 
                    initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                  >
                    I build <span className="text-white font-bold italic underline decoration-blue-500 underline-offset-8">interfaces that breathe</span>.
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-gray-500"
                  >
                    A developer who understands that the pixel is just as important as the database query. Specializing in high-fidelity React architectures, WebGL interactions, and robust backend systems.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.4 }}
                    className="pt-10 flex gap-8 border-t border-white/10"
                  >
                    <div>
                      <h4 className="text-white font-black text-5xl mb-2">4+</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Years Experience</p>
                    </div>
                    <div>
                      <h4 className="text-white font-black text-5xl mb-2">50+</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Projects Shipped</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WORK SECTION */}
        <section id="work" className="py-40 px-6 md:px-20 bg-black">
          <div className="max-w-7xl mx-auto">
            <SectionTitle subtitle="Portfolio">Recent Artifacts</SectionTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-20">
              {[
                { title: "Quantum Shield", category: "Cybersecurity Dashboard", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800", tech: ["Rust", "React", "Three.js"] },
                { title: "Zenith Platform", category: "Fintech App", image: "https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=800", tech: ["React", "Go", "Framer"] },
                { title: "Aura Commerce", category: "E-Commerce", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", tech: ["Next.js", "Stripe"] },
                { title: "Nexus OS", category: "Web Interface", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", tech: ["Vue", "Node.js"] }
              ].map((project, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (i % 2) * 0.2, ease: "easeOut" }}
                  className="group cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)} 
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0a0a0a] mb-8 border border-white/5 shadow-2xl">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      src={project.image} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-sm">
                      <div className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        View Case Study
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-500 mb-3">{project.category}</p>
                      <h3 className="text-4xl font-outfit font-black text-white group-hover:text-gray-300 transition-colors">{project.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      {project.tech.map(t => (
                        <span key={t} className="text-[9px] border border-white/20 px-3 py-1 rounded-full text-gray-400">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FOOTER */}
        <footer className="relative py-40 px-6 md:px-20 bg-[#020202] border-t border-white/5 text-center overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
          <div className="glow-mesh top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 w-[800px] h-[800px]" />
          
          <motion.div style={{ scale: footerScale, opacity: footerOpacity }} className="relative z-10 w-full">
            <h2 className="text-[15vw] leading-none font-outfit font-black text-white mb-10 tracking-tighter">
              ADITYA.
            </h2>
            
            <div className="flex justify-center gap-12 text-[12px] font-black uppercase tracking-widest text-white mb-20">
              <a href="#" className="hover:text-blue-500 transition-colors" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>Github</a>
              <a href="#" className="hover:text-blue-500 transition-colors" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>LinkedIn</a>
              <a href="#" className="hover:text-blue-500 transition-colors" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>Twitter</a>
            </div>
          </motion.div>

          <p className="absolute bottom-10 text-[10px] text-gray-700 tracking-[0.5em] font-black uppercase z-10">
            © 2026 Aditya Patil • Crafted with precision
          </p>
        </footer>
      </main>
    </div>
  );
}