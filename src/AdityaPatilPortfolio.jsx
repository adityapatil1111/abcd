// AdityaPatilPortfolio.jsx  —  v3  with background parallax
// deps: npm install gsap @studio-freight/lenis
// fonts in index.html: Syne + DM Sans from Google Fonts
import { useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* UPDATED THEME: Better contrast & readability */
body {
  font-family: 'Inter', sans-serif;
  background: #0f172a; /* Deep Slate Blue (More professional than pure black) */
  color: #e2e8f0;       /* Light Gray for main text (Higher readability) */
  overflow-x:hidden;
}

/* Make headings pop */
h1, h2, h3, h4 { color: #f8fafc; }

/* Interactive elements */
.ap-dot-cur{position:fixed;width:8px;height:8px;background:#38bdf8;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:difference}

/* Sections */
.ap-section { padding: 100px 52px; max-width: 1100px; margin: 0 auto; }

/* Skill cards - Lighter background for contrast */
.ap-skill-card {
  background: #1e293b; 
  border: 1px solid #334155;
  border-radius: 18px;
  padding: 26px;
  transition: all .3s;
}

/* Project cards - Distinct from background */
.ap-proj-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 22px;
  padding: 34px;
}

/* Labels & Meta data - Brighter colors */
.ap-label { color: #94a3b8; font-weight: 600; letter-spacing: 2px; }
.ap-exp-co { color: #38bdf8; font-weight: 500; } /* Blue accent */

/* Buttons */
.ap-btn-p {
  background: #38bdf8; /* Vibrant Blue instead of Lime */
  color: #0f172a;
  padding: 14px 30px;
  border-radius: 100px;
  font-weight: 700;
  text-decoration: none;
}

.ap-btn-o {
  background: transparent;
  color: #f1f5f9;
  border: 1px solid #475569;
  padding: 14px 30px;
  border-radius: 100px;
}

/* Link colors */
a { color: #38bdf8; }
.ap-proj-link { border: 1px solid #475569; color: #e2e8f0; }
.ap-proj-link:hover { border-color: #38bdf8; color: #38bdf8; }

/* Noise layer - turned down for clarity */
.ap-noise { opacity: 0.01; }

/* Responsive tweaks */
@media(max-width:768px){
  .ap-nav-links{display:none}
  .ap-hero-content { padding: 0 24px; }
}
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:auto}
body{font-family:'DM Sans',sans-serif;background:#060606;color:#ede9e3;overflow-x:hidden;cursor:none}
.ap-dot-cur{position:fixed;width:8px;height:8px;background:#c8f55a;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:difference;transition:width .2s,height .2s}
.ap-ring-cur{position:fixed;width:40px;height:40px;border:1px solid rgba(200,245,90,.6);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .35s cubic-bezier(.25,.46,.45,.94),height .35s cubic-bezier(.25,.46,.45,.94)}
body.ap-hov .ap-dot-cur{width:14px;height:14px}
body.ap-hov .ap-ring-cur{width:58px;height:58px}
.ap-progress{position:fixed;top:0;left:0;height:2px;background:#c8f55a;width:0%;z-index:9997;pointer-events:none}
.ap-noise{position:fixed;inset:0;z-index:9;pointer-events:none;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px}
.ap-nav{position:fixed;top:0;left:0;right:0;z-index:500;display:flex;justify-content:space-between;align-items:center;padding:22px 52px;transition:background .4s,backdrop-filter .4s,border-color .4s}
.ap-nav.scrolled{background:rgba(6,6,6,.9);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.06)}
.ap-nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;letter-spacing:-1px;color:#ede9e3;text-decoration:none}
.ap-nav-links{display:flex;gap:36px;list-style:none}
.ap-nav-links a{color:#555;text-decoration:none;font-size:13px;transition:color .2s}
.ap-nav-links a:hover{color:#ede9e3}
.ap-nav-cta{background:#c8f55a;color:#060606;border:none;padding:9px 22px;border-radius:100px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:none;text-decoration:none;display:inline-block;transition:background .15s}
.ap-nav-cta:hover{background:#b8e040}

/* ── HERO with parallax bg ── */
.ap-hero-outer{position:relative;height:100vh;min-height:700px;overflow:hidden;display:flex;align-items:center}
.ap-hero-bg{position:absolute;inset:-20%;z-index:0;will-change:transform;background-color:#060606;background-image:linear-gradient(rgba(200,245,90,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,245,90,.04) 1px,transparent 1px);background-size:60px 60px}
.ap-hero-blob{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(200,245,90,.07) 0%,transparent 65%);top:50%;left:55%;transform:translate(-50%,-50%);pointer-events:none;z-index:1;will-change:transform}
.ap-hero-blob2{position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(100,200,255,.04) 0%,transparent 65%);top:15%;left:8%;pointer-events:none;z-index:1;will-change:transform}
.ap-hero-overlay{position:absolute;inset:0;z-index:2;background:linear-gradient(to bottom,rgba(6,6,6,.05) 0%,rgba(6,6,6,.65) 100%)}
.ap-hero-content{position:relative;z-index:3;padding:0 52px;max-width:1100px;margin:0 auto;width:100%}
.ap-hero-tag{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(200,245,90,.3);border-radius:100px;padding:6px 16px;font-size:11px;color:#c8f55a;margin-bottom:40px;letter-spacing:1px;opacity:0;transform:translateY(16px)}
.ap-pulse{width:6px;height:6px;border-radius:50%;background:#c8f55a;animation:ap-pulse 2s infinite}
@keyframes ap-pulse{0%,100%{opacity:1}50%{opacity:.2}}
.ap-hero-h1{font-family:'Syne',sans-serif;font-size:clamp(60px,9vw,110px);font-weight:800;line-height:.93;letter-spacing:-4px;margin-bottom:36px;will-change:transform}
.ap-hero-h1 em{font-style:italic;color:rgba(255,255,255,.1);font-weight:400}
.ap-reveal{overflow:hidden;display:block}
.ap-reveal-inner{display:block;transform:translateY(105%)}
.ap-hero-sub{font-size:17px;color:#666;max-width:440px;line-height:1.65;margin-bottom:46px;opacity:0;transform:translateY(20px)}
.ap-hero-actions{display:flex;gap:14px;flex-wrap:wrap;opacity:0;transform:translateY(20px)}
.ap-btn-p{background:#c8f55a;color:#060606;padding:14px 30px;border-radius:100px;font-weight:700;font-size:15px;border:none;cursor:none;text-decoration:none;display:inline-block;transition:background .15s,transform .15s}
.ap-btn-p:hover{background:#b8e040;transform:translateY(-2px)}
.ap-btn-o{background:transparent;color:#ede9e3;padding:14px 30px;border-radius:100px;font-size:15px;border:1px solid rgba(255,255,255,.13);cursor:none;text-decoration:none;display:inline-block;transition:border-color .2s,transform .15s}
.ap-btn-o:hover{border-color:rgba(255,255,255,.35);transform:translateY(-2px)}
.ap-scroll-hint{position:absolute;bottom:36px;left:52px;z-index:3;display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#333;opacity:0}
.ap-scroll-line{width:40px;height:1px;background:#333;animation:ap-line 2s ease-in-out infinite}
@keyframes ap-line{0%,100%{width:20px;opacity:.4}50%{width:50px;opacity:1}}
.ap-hero-meta{position:absolute;bottom:36px;right:52px;z-index:3;display:flex;gap:40px;opacity:0;transform:translateY(10px)}
.ap-meta-item label{font-size:10px;letter-spacing:1.5px;color:#444;display:block;margin-bottom:5px;text-transform:uppercase}
.ap-meta-item span{font-size:13px;color:#ede9e3}

/* ── Parallax section ── */
.ap-par-section{position:relative;overflow:hidden}
.ap-par-bg{position:absolute;inset:-25%;z-index:0;will-change:transform;background-size:cover;background-position:center}
.ap-par-overlay{position:absolute;inset:0;z-index:1;background:rgba(6,6,6,.84)}
.ap-par-content{position:relative;z-index:2;padding:120px 52px;max-width:1100px;margin:0 auto}

/* ── Marquee ── */
.ap-mq-wrap{overflow:hidden;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:20px 0;background:#060606}
.ap-mq-track{display:flex;white-space:nowrap;animation:ap-mq 20s linear infinite}
.ap-mq-track:hover{animation-play-state:paused}
.ap-mq-item{font-family:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#282828;padding:0 36px;flex-shrink:0}
.ap-mq-item .ap-lime{color:#c8f55a;margin-right:14px}
@keyframes ap-mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ── Regular sections ── */
.ap-section{padding:120px 52px;max-width:1100px;margin:0 auto}
.ap-label{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#444;margin-bottom:22px;display:flex;align-items:center;gap:12px}
.ap-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.06)}
.ap-title{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(38px,5.5vw,62px);letter-spacing:-2.5px;line-height:1;margin-bottom:56px}

/* Stats */
.ap-stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(255,255,255,.06);border-radius:20px;overflow:hidden}
.ap-stat{padding:36px;text-align:center;border-right:1px solid rgba(255,255,255,.06)}
.ap-stat:last-child{border-right:none}
.ap-stat-n{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;color:#c8f55a;letter-spacing:-2px;line-height:1;margin-bottom:8px}
.ap-stat-l{font-size:11px;color:#444;letter-spacing:1px;text-transform:uppercase}

/* Skills */
.ap-skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.ap-skill-card{background:#0c0c0c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:26px;transition:border-color .3s,transform .3s}
.ap-skill-card:hover{border-color:rgba(200,245,90,.25);transform:translateY(-4px)}
.ap-skill-cat{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#444;margin-bottom:10px}
.ap-skill-card h4{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:13px}
.ap-skill-tags{display:flex;flex-wrap:wrap;gap:6px}
.ap-skill-tag{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:100px;padding:4px 11px;font-size:11px;color:#888}

/* Experience */
.ap-exp-item{display:grid;grid-template-columns:200px 1fr;gap:48px;padding:40px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.ap-exp-item:first-of-type{border-top:1px solid rgba(255,255,255,.06)}
.ap-exp-left label{font-size:10px;color:#444;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px}
.ap-exp-left span{font-size:12px;color:#888;display:block;margin-bottom:12px}
.ap-exp-right h3{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;margin-bottom:4px}
.ap-exp-co{font-size:12px;color:#c8f55a;margin-bottom:18px}
.ap-exp-right ul{padding-left:18px}
.ap-exp-right li{font-size:13px;color:#666;line-height:1.85;margin-bottom:3px}

/* Projects */
.ap-proj-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px}
.ap-proj-card{background:#0c0c0c;border:1px solid rgba(255,255,255,.06);border-radius:22px;padding:34px;position:relative;overflow:hidden;transition:border-color .3s,transform .3s}
.ap-proj-card::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:radial-gradient(circle,rgba(200,245,90,.05) 0%,transparent 70%);pointer-events:none}
.ap-proj-card:hover{border-color:rgba(200,245,90,.28);transform:translateY(-5px)}
.ap-proj-num{font-family:'Syne',sans-serif;font-size:10px;color:#1e1e1e;letter-spacing:3px;margin-bottom:26px}
.ap-proj-card h3{font-family:'Syne',sans-serif;font-size:23px;font-weight:800;letter-spacing:-.5px;margin-bottom:5px}
.ap-proj-stack{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c8f55a;margin-bottom:16px;display:block}
.ap-proj-card p{font-size:13px;color:#666;line-height:1.7;margin-bottom:18px}
.ap-proj-card ul{padding-left:17px;margin-bottom:24px}
.ap-proj-card li{font-size:12px;color:#555;line-height:1.8}
.ap-proj-link{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#ede9e3;text-decoration:none;border:1px solid rgba(255,255,255,.1);border-radius:100px;padding:7px 16px;transition:border-color .2s,color .2s}
.ap-proj-link:hover{border-color:rgba(200,245,90,.5);color:#c8f55a}

/* Education */
.ap-edu-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.ap-edu-card{background:#0c0c0c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:30px;transition:border-color .2s}
.ap-edu-card:hover{border-color:rgba(200,245,90,.2)}
.ap-edu-card h4{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:6px;line-height:1.3}
.ap-edu-sub{font-size:12px;color:#c8f55a;margin-bottom:8px}
.ap-edu-meta{font-size:11px;color:#444}
.ap-pub{background:#0c0c0c;border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:30px;margin-top:18px}
.ap-pub h4{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:5px}
.ap-pub-j{font-size:12px;color:#c8f55a;margin-bottom:12px}
.ap-pub p{font-size:13px;color:#666;line-height:1.65;margin-bottom:12px}
.ap-pub a{font-size:11px;color:#444;word-break:break-all;text-decoration:none;border-bottom:1px solid #1e1e1e}
.ap-pub a:hover{color:#c8f55a}

/* Contact */
.ap-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ap-contact-card{background:#0c0c0c;border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:24px 28px;display:flex;flex-direction:column;gap:5px;text-decoration:none;transition:border-color .2s,transform .15s}
.ap-contact-card:hover{border-color:rgba(200,245,90,.3);transform:translateY(-2px)}
.ap-contact-card label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#444}
.ap-contact-card span{font-size:14px;color:#ede9e3}

/* CTA */
.ap-cta{text-align:center;padding:140px 52px;border-top:1px solid rgba(255,255,255,.06)}
.ap-cta h2{font-family:'Syne',sans-serif;font-size:clamp(36px,6vw,74px);font-weight:800;letter-spacing:-3px;margin-bottom:36px;line-height:1}
.ap-cta h2 em{font-style:italic;color:#252525;font-weight:400}

/* Footer */
.ap-footer{border-top:1px solid rgba(255,255,255,.06);padding:32px 52px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#333}
.ap-footer span{color:#c8f55a}

.ap-hr{border:none;border-top:1px solid rgba(255,255,255,.05);margin:0}

@media(max-width:768px){
  .ap-nav{padding:16px 24px}
  .ap-nav-links{display:none}
  .ap-hero-content,.ap-section,.ap-par-content{padding-left:24px;padding-right:24px}
  .ap-hero-h1{letter-spacing:-2px}
  .ap-exp-item{grid-template-columns:1fr;gap:14px}
  .ap-edu-grid,.ap-contact-grid{grid-template-columns:1fr}
  .ap-stats{grid-template-columns:repeat(2,1fr)}
  .ap-stat{border-bottom:1px solid rgba(255,255,255,.06)}
  .ap-hero-meta,.ap-scroll-hint{display:none}
  .ap-footer{flex-direction:column;gap:10px;text-align:center}
}
`;

const MQ_ITEMS = [
  "Full Stack Dev","React","Node.js","MongoDB","MySQL",
  "JWT Auth","REST APIs","Java","Express.js","PHP",
  "Full Stack Dev","React","Node.js","MongoDB","MySQL",
  "JWT Auth","REST APIs","Java","Express.js","PHP",
];


const SKILLS = [
  { cat:"Programming", label:"Languages", tags:["Java","C++","JavaScript"] },
  { cat:"Frontend", label:"Frameworks", tags:["React.js","Node.js","Express.js","Angular"] },
  { cat:"Web", label:"Technologies", tags:["HTML5","CSS3","ES6+","REST APIs","JWT Auth"] },
  { cat:"Database & Tools", label:"Infrastructure", tags:["MySQL","MongoDB","SQL Server","Git","GitHub","Postman"] },
];

const PROJECTS = [
  { num:"01/02", title:"Digital Scrapyard", stack:"React · Node.js · MongoDB", desc:"E-commerce platform with integrated payment gateway, inventory tracking, and fully responsive UI/UX.", pts:["Integrated payment gateway & inventory tracking","Fully responsive for mobile & desktop","JWT auth + RESTful APIs for secure sessions"], link:"https://makex.onrender.com" },
  { num:"02/02", title:"COVID Management Service", stack:"PHP · MySQL", desc:"Real-time dashboard for COVID-19 case stats and vaccination rates with dynamic charts and a full admin panel.", pts:["Real-time stats & vaccination rate dashboard","Dynamic charts for live trend analysis","Admin panel for news & updates management"], link:null },
];

// SVG dot pattern encoded for CSS background-image
const DOT_PAT = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23c8f55a' fill-opacity='0.06'/%3E%3C/svg%3E")`;
const CROSS_PAT = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' fill='%23c8f55a' fill-opacity='0.05'/%3E%3C/g%3E%3C/svg%3E")`;

export default function AdityaPatilPortfolio() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const progressRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("@studio-freight/lenis"),
    ]).then(([gm, stm, lm]) => {
      const gsap = gm.default || gm.gsap;
      const { ScrollTrigger } = stm;
      const Lenis = lm.default;
      gsap.registerPlugin(ScrollTrigger);

      // Lenis smooth scroll
      const lenis = new Lenis({ lerp: 0.07, smooth: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);

      // Cursor
      const dot = dotRef.current, ring = ringRef.current;
      let mx=0,my=0,rx=0,ry=0;
      document.addEventListener("mousemove", e => {
        mx=e.clientX; my=e.clientY;
        gsap.set(dot,{x:mx,y:my});
      });
      (function animR(){
        rx+=(mx-rx)*0.1; ry+=(my-ry)*0.1;
        gsap.set(ring,{x:rx,y:ry});
        requestAnimationFrame(animR);
      })();
      document.querySelectorAll("a,button,.ap-skill-card,.ap-proj-card,.ap-contact-card,.ap-stat").forEach(el=>{
        el.addEventListener("mouseenter",()=>document.body.classList.add("ap-hov"));
        el.addEventListener("mouseleave",()=>document.body.classList.remove("ap-hov"));
      });

      // Progress bar
      gsap.to(progressRef.current,{
        width:"100%",ease:"none",
        scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:true},
      });

      // Nav scroll class
      ScrollTrigger.create({
        start:"80px top",
        onEnter:()=>navRef.current?.classList.add("scrolled"),
        onLeaveBack:()=>navRef.current?.classList.remove("scrolled"),
      });

      /* ══ HERO BACKGROUND PARALLAX ══
         Grid bg moves slower (30% of scroll) = depth layer
         Blob 1 rises faster (-40%)
         Blob 2 rises fastest (-60%)
         Hero h1 text drifts up (100px) = floating text
      */
      gsap.to(".ap-hero-bg",{
        yPercent:30, ease:"none",
        scrollTrigger:{trigger:".ap-hero-outer",start:"top top",end:"bottom top",scrub:1},
      });
      gsap.to(".ap-hero-blob",{
        yPercent:-40, ease:"none",
        scrollTrigger:{trigger:".ap-hero-outer",start:"top top",end:"bottom top",scrub:1.5},
      });
      gsap.to(".ap-hero-blob2",{
        yPercent:-60, ease:"none",
        scrollTrigger:{trigger:".ap-hero-outer",start:"top top",end:"bottom top",scrub:2},
      });
      gsap.to(".ap-hero-h1",{
        y:100, ease:"none",
        scrollTrigger:{trigger:".ap-hero-outer",start:"top top",end:"bottom top",scrub:0.8},
      });
      gsap.to(".ap-scroll-hint",{
        opacity:0,y:-10,ease:"none",
        scrollTrigger:{trigger:".ap-hero-outer",start:"20% top",end:"40% top",scrub:true},
      });

      /* ══ SECTION PARALLAX BACKGROUNDS ══
         Each .ap-par-bg image scrolls at 25% of section scroll
      */
      document.querySelectorAll(".ap-par-section").forEach(sec=>{
        const bg = sec.querySelector(".ap-par-bg");
        if(!bg) return;
        gsap.to(bg,{
          yPercent:25, ease:"none",
          scrollTrigger:{trigger:sec,start:"top bottom",end:"bottom top",scrub:1},
        });
      });

      // Hero entrance animation
      const tl = gsap.timeline({delay:0.2});
      tl.to(".ap-hero-h1 .ap-reveal-inner",{yPercent:0,duration:1.1,stagger:.1,ease:"expo.out"})
        .to(".ap-hero-tag",{opacity:1,y:0,duration:.8,ease:"power3.out"},"-=.5")
        .to(".ap-hero-sub",{opacity:1,y:0,duration:.8,ease:"power3.out"},"-=.5")
        .to(".ap-hero-actions",{opacity:1,y:0,duration:.8,ease:"power3.out"},"-=.4")
        .to(".ap-scroll-hint",{opacity:1,duration:.6},"-=.2")
        .to(".ap-hero-meta",{opacity:1,y:0,duration:.8,ease:"power3.out"},"-=.3");

      // Section titles
      document.querySelectorAll(".ap-title").forEach(t=>{
        const parts = t.innerHTML.split(/<br\s*\/?>/i);
        t.innerHTML = parts.map(p=>`<span class="ap-reveal"><span class="ap-reveal-inner">${p}</span></span>`).join("<br>");
        gsap.from(t.querySelectorAll(".ap-reveal-inner"),{
          yPercent:110,duration:1,stagger:.08,ease:"expo.out",
          scrollTrigger:{trigger:t,start:"top 87%"},
        });
      });

      // Labels
      document.querySelectorAll(".ap-label").forEach(el=>{
        gsap.from(el,{opacity:0,x:-20,duration:.6,ease:"power2.out",
          scrollTrigger:{trigger:el,start:"top 88%"}});
      });

      // Stagger cards
      [".ap-skill-card",".ap-proj-card",".ap-edu-card",".ap-contact-card"].forEach(sel=>{
        const items=document.querySelectorAll(sel);
        if(!items.length) return;
        gsap.from(items,{opacity:0,y:50,duration:.75,stagger:.1,ease:"power3.out",
          scrollTrigger:{trigger:items[0],start:"top 87%"}});
      });

      // Experience
      document.querySelectorAll(".ap-exp-item").forEach((el,i)=>{
        gsap.from(el,{opacity:0,x:-40,duration:.9,delay:i*.1,ease:"power3.out",
          scrollTrigger:{trigger:el,start:"top 86%"}});
      });

      // Pub & stat
      [".ap-pub",".ap-stat"].forEach(sel=>{
        document.querySelectorAll(sel).forEach(el=>{
          gsap.from(el,{opacity:0,y:30,duration:.7,ease:"power3.out",
            scrollTrigger:{trigger:el,start:"top 87%"}});
        });
      });

      // Counters
      document.querySelectorAll(".ap-stat-n[data-target]").forEach(el=>{
        const target=parseInt(el.dataset.target,10);
        const suffix=el.dataset.suffix||"";
        const obj={v:0};
        gsap.to(obj,{v:target,duration:2,ease:"power2.out",
          scrollTrigger:{trigger:el,start:"top 85%"},
          onUpdate:()=>{el.textContent=Math.round(obj.v)+suffix}});
      });

      // CTA
      gsap.from(".ap-cta .ap-reveal-inner",{
        yPercent:110,duration:1,stagger:.1,ease:"expo.out",
        scrollTrigger:{trigger:".ap-cta",start:"top 80%"},
      });

      return ()=>{ lenis.destroy(); ScrollTrigger.getAll().forEach(t=>t.kill()); };
    });
  },[]);

  return (
    <>
      <style>{CSS}</style>
      <div className="ap-dot-cur" ref={dotRef}/>
      <div className="ap-ring-cur" ref={ringRef}/>
      <div className="ap-progress" ref={progressRef}/>
      <div className="ap-noise"/>

      {/* NAV */}
      <nav className="ap-nav" ref={navRef}>
        <a className="ap-nav-logo" href="#top">AP<span style={{color:"#c8f55a"}}>.</span></a>
        <ul className="ap-nav-links">
          {["Skills","Experience","Projects","Education","Contact"].map(s=>(
            <li key={s}><a href={`#${s.toLowerCase()}`}>{s}</a></li>
          ))}
        </ul>
        <a className="ap-nav-cta" href="mailto:adityapatil0225@gmail.com">Hire Me</a>
      </nav>

      {/* HERO — bg grid + blobs all parallax independently */}
      <div className="ap-hero-outer" id="top">
        <div className="ap-hero-bg"/>
        <div className="ap-hero-blob"/>
        <div className="ap-hero-blob2"/>
        <div className="ap-hero-overlay"/>
        <div className="ap-hero-content">
          <div className="ap-hero-tag"><span className="ap-pulse"/>Available for opportunities</div>
          <h1 className="ap-hero-h1">
            <span className="ap-reveal"><span className="ap-reveal-inner">Aditya</span></span><br/>
            <span className="ap-reveal"><span className="ap-reveal-inner"><em>Patil</em><span style={{color:"#c8f55a"}}>.</span></span></span>
          </h1>
          <p className="ap-hero-sub">Full Stack Developer crafting modern web experiences with React, Node.js &amp; Java. Building clean, scalable products that matter.</p>
          <div className="ap-hero-actions">
            <a className="ap-btn-p" href="#projects">View Projects</a>
            <a className="ap-btn-o" href="mailto:adityapatil0225@gmail.com">Get in Touch</a>
          </div>
        </div>
        <div className="ap-scroll-hint"><div className="ap-scroll-line"/>Scroll</div>
        <div className="ap-hero-meta">
          {[["Location","Mahagaon, India"],["Role","Full Stack Developer"],["Edu","B.Tech CSE — SGMCE"]].map(([l,v])=>(
            <div className="ap-meta-item" key={l}><label>{l}</label><span>{v}</span></div>
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="ap-mq-wrap">
        <div className="ap-mq-track">
          {MQ_ITEMS.map((item,i)=>(
            <span className="ap-mq-item" key={i}><span className="ap-lime">✦</span>{item}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="ap-section" style={{paddingTop:80,paddingBottom:80}}>
        <div className="ap-stats">
          {[["2","+","Projects"],["1","","Internship"],["2","","Certifications"],["1","","Publication"]].map(([n,s,l])=>(
            <div className="ap-stat" key={l}>
              <div className="ap-stat-n" data-target={n} data-suffix={s}>0</div>
              <div className="ap-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="ap-hr"/>

      {/* SKILLS — cross pattern bg parallaxes behind cards */}
      <div className="ap-par-section" id="skills">
        <div className="ap-par-bg" style={{backgroundImage:CROSS_PAT,backgroundColor:"#060606"}}/>
        <div className="ap-par-overlay"/>
        <div className="ap-par-content">
          <div className="ap-label">02 — Skills</div>
          <h2 className="ap-title">What I<br/>work with</h2>
          <div className="ap-skills-grid">
            {SKILLS.map(s=>(
              <div className="ap-skill-card" key={s.label}>
                <div className="ap-skill-cat">{s.cat}</div>
                <h4>{s.label}</h4>
                <div className="ap-skill-tags">{s.tags.map(t=><span className="ap-skill-tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="ap-hr"/>

      {/* EXPERIENCE */}
      <div className="ap-section" id="experience">
        <div className="ap-label">03 — Experience</div>
        <h2 className="ap-title">Where I've<br/>worked</h2>
        <div className="ap-exp-item">
          <div className="ap-exp-left">
            <label>Duration</label><span>Jun 2024 – Sep 2024</span>
            <label>Type</label><span>Remote Internship</span>
            <label>Company</label><span>SparkLab IT Solutions</span>
          </div>
          <div className="ap-exp-right">
            <h3>Web Development Intern</h3>
            <div className="ap-exp-co">SparkLab IT Solutions</div>
            <ul>
              <li>Built front-end components with Angular following responsive UI principles.</li>
              <li>Constructed a Q&amp;A platform with secure auth and real-time interactions.</li>
              <li>Optimised MySQL queries to enhance back-end performance.</li>
              <li>Reduced vulnerability incidents by 50% via JWT authentication.</li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="ap-hr"/>

      {/* PROJECTS — dot pattern bg parallaxes */}
      <div className="ap-par-section" id="projects">
        <div className="ap-par-bg" style={{backgroundImage:DOT_PAT,backgroundColor:"#060606"}}/>
        <div className="ap-par-overlay"/>
        <div className="ap-par-content">
          <div className="ap-label">04 — Projects</div>
          <h2 className="ap-title">Things I've<br/>built</h2>
          <div className="ap-proj-grid">
            {PROJECTS.map(p=>(
              <div className="ap-proj-card" key={p.title}>
                <div className="ap-proj-num">{p.num} — 2024</div>
                <h3>{p.title}</h3>
                <span className="ap-proj-stack">{p.stack}</span>
                <p>{p.desc}</p>
                <ul>{p.pts.map(pt=><li key={pt}>{pt}</li>)}</ul>
                {p.link&&<a className="ap-proj-link" href={p.link} target="_blank" rel="noreferrer">↗ Visit Live</a>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="ap-hr"/>

      {/* EDUCATION */}
      <div className="ap-section" id="education">
        <div className="ap-label">05 — Education &amp; Certs</div>
        <h2 className="ap-title">My<br/>background</h2>
        <div className="ap-edu-grid">
          <div className="ap-edu-card">
            <h4>B.Tech — Computer Science &amp; Engineering</h4>
            <div className="ap-edu-sub">Sant Gajanan Maharaj College of Engineering</div>
            <div className="ap-edu-meta">Aug 2021 – May 2025 · Mahagaon</div>
          </div>
          <div>
            <div className="ap-edu-card" style={{marginBottom:16}}>
              <h4>Java Programming</h4>
              <div className="ap-edu-sub">NPTEL</div>
              <div className="ap-edu-meta">Certification</div>
            </div>
            <div className="ap-edu-card">
              <h4>Full Stack Web Development Bootcamp</h4>
              <div className="ap-edu-sub">Udemy</div>
              <div className="ap-edu-meta">Certification</div>
            </div>
          </div>
        </div>
        <div className="ap-pub">
          <h4>Creative Scrapyard</h4>
          <div className="ap-pub-j">IJSREM e-journal · Aditya Patil</div>
          <p>Published research on automated data extraction and analysis from online classified ad platforms — outcome of the Digital Scrapyard final year project.</p>
          <a href="https://ijsrem.com/download/creative-scrapyard-an-e-commerce-platform-for-sustainable-recycling-and-artistic-transformation/" target="_blank" rel="noreferrer">
            ijsrem.com/download/creative-scrapyard-an-e-commerce-platform…
          </a>
        </div>
      </div>

      <hr className="ap-hr"/>

      {/* CONTACT */}
      <div className="ap-section" id="contact">
        <div className="ap-label">06 — Contact</div>
        <h2 className="ap-title">Let's work<br/>together</h2>
        <div className="ap-contact-grid">
          {[
            {label:"Email",val:"adityapatil0225@gmail.com",href:"mailto:adityapatil0225@gmail.com"},
            {label:"Phone",val:"+91 86259 80781",href:"tel:+918625980781"},
            {label:"LinkedIn",val:"linkedin.com/in/aditya025",href:"https://linkedin.com/in/aditya025"},
            {label:"GitHub",val:"github.com/aditya25k",href:"https://github.com/aditya25k"},
          ].map(({label,val,href})=>(
            <a className="ap-contact-card" href={href} key={label} target={href.startsWith("http")?"_blank":undefined} rel="noreferrer">
              <label>{label}</label><span>{val}</span>
            </a>
          ))}
        </div>
      </div>

      {/* BIG CTA */}
      <div className="ap-cta">
        <h2>
          <span className="ap-reveal"><span className="ap-reveal-inner">Have a project</span></span><br/>
          <span className="ap-reveal"><span className="ap-reveal-inner"><em>in mind?</em></span></span>
        </h2>
        <a className="ap-btn-p" style={{fontSize:16,padding:"16px 36px"}} href="mailto:adityapatil0225@gmail.com">
          Say hello ↗
        </a>
      </div>

      <footer className="ap-footer">
        <span>Aditya Patil</span>
        <span style={{color:"#1e1e1e"}}>Full Stack Developer · Mahagaon, India · {new Date().getFullYear()}</span>
        <a href="https://github.com/aditya25k" target="_blank" rel="noreferrer" style={{color:"#333",textDecoration:"none"}}>github.com/aditya25k</a>
      </footer>
    </>
  );
}