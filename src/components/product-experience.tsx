"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneMotion } from "./product-scene";

const ProductScene = dynamic(() => import("./product-scene"), { ssr: false });

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeToCapabilities = () => () => {};
let webglAvailable: boolean | undefined;

function getWebglAvailability() {
  if (webglAvailable === undefined) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    webglAvailable = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return webglAvailable;
}

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerWebglAvailability = () => null;
const getServerReducedMotion = () => false;

// Shared Tailwind utilities keep recurring layouts consistent.
const sectionClass = "relative h-svh min-h-[680px] px-[6%] pointer-events-none md:min-h-[700px] md:px-[7.1%] [&_a]:pointer-events-auto [&_button]:pointer-events-auto";
const eyebrowClass = "flex items-center gap-[7px] text-[7px] leading-[1.8] font-medium tracking-[1.4px] text-[#b6b8bc] md:gap-2.5 md:text-[9px] md:tracking-[2.2px]";
const tinyLabelClass = "text-[8px] leading-[1.7] tracking-[1.6px] text-[#9b9da3]";
const primaryButtonClass = "inline-flex min-h-[45px] min-w-[168px] items-center justify-between gap-[35px] rounded px-[17px] bg-[#91bfff] text-[10px] font-semibold text-[#111b2a] transition-[background,translate] duration-250 hover:-translate-y-0.5 hover:bg-[#bbd7ff] md:min-h-12 md:min-w-[185px] md:px-[22px] md:text-[11px] [&_span]:text-[17px] [&_span]:font-normal";
const headingClass = "my-[18px] text-[clamp(42px,10.5vw,68px)] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px] md:text-[clamp(48px,5.5vw,88px)]";
const copyClass = "absolute top-[59%] left-[7%] z-20 max-w-[86%] md:top-[33%] md:left-[7.1%] md:max-w-[40%]";
const descriptionClass = "max-w-[310px] text-xs leading-[1.7] text-[#999ca3] md:max-w-[290px] md:text-[13px] md:leading-[1.8]";
const sectionNumberClass = "absolute bottom-[42px] left-[7.1%] z-20 hidden text-[7px] tracking-[2px] text-[#686c73] md:inline";

// Editable editorial copy. Add technical specifications only after verification.
const features = [
  { id: "sound", name: "Sound", eyebrow: "01 / YOUR OWN FREQUENCY", title: ["Get lost in", "the listening."], description: "A little distance from the everyday. A little closer to your favorite sound.", detail: "ACOUSTIC HOUSING", note: "Your soundtrack, front and center." },
  { id: "comfort", name: "Comfort", eyebrow: "02 / MADE TO FIT YOUR DAY", title: ["Find your", "comfort zone."], description: "A soft silicone ear tip brings a considered touch to your everyday listening ritual.", detail: "SILICONE EAR TIP", note: "A softer point of contact." },
  { id: "controls", name: "Touch", eyebrow: "03 / A LITTLE TOUCH GOES FAR", title: ["Stay in", "your rhythm."], description: "Keep the moment moving with touch controls, right on the outer stem.", detail: "TOUCH SURFACE", note: "Right where you need it." },
  { id: "portability", name: "Portability", eyebrow: "04 / READY WHEN YOU ARE", title: ["Good things.", "Small package."], description: "Earbuds, charging case, and a place in your pocket. Bring your listening ritual along.", detail: "CHARGING CASE", note: "A home for your sound." },
];

export default function ProductExperience() {
  const root = useRef<HTMLElement>(null);
  const invalidate = useRef<() => void>(() => {});
  const motion = useRef<SceneMotion>({ phase: 0, pointerX: 0, pointerY: 0, reset: 0 });
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(0);
  const reduced = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
  const supported = useSyncExternalStore(subscribeToCapabilities, getWebglAvailability, getServerWebglAvailability);
  const [sceneFailed, setSceneFailed] = useState(false);
  const available = sceneFailed ? false : supported;
  const [loaded, setLoaded] = useState(false);
  const [availability, setAvailability] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const connector = useRef<SVGPolylineElement>(null);
  const hotspot = useRef<SVGCircleElement>(null);
  const onLoaded = useCallback(() => setLoaded(true), []);
  const onSceneError = useCallback(() => setSceneFailed(true), []);
  const onAnchor = useCallback((x: number, y: number) => {
    const mobile = window.innerWidth < 768;
    const endX = mobile ? 60 : 79;
    const endY = mobile ? 49 : 68;
    connector.current?.setAttribute("points", `${x},${y} ${endX - 4},${endY} ${endX - 1},${endY}`);
    hotspot.current?.setAttribute("cx", String(x));
    hotspot.current?.setAttribute("cy", String(y));
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = window.matchMedia(reducedMotionQuery);
    const trigger = ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "bottom bottom",
      onUpdate: self => {
        const value = self.progress * 7;
        motion.current.phase = value;
        setPhase(value);
        setActive(Math.min(3, Math.max(0, Math.round(value - 2))));
        invalidate.current();
      },
    });
    const labels = gsap.context(() => {
      if (media.matches) return;
      gsap.utils.toArray<HTMLElement>("[data-feature-copy]").forEach(label => {
        gsap.fromTo(label, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: label.closest("section"), start: "top 65%", end: "top 15%", scrub: true } });
        gsap.to(label, { opacity: 0, y: -20, ease: "none", immediateRender: false, scrollTrigger: { trigger: label.closest("section"), start: "top -35%", end: "top -80%", scrub: true } });
      });
    }, root);
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || media.matches || motion.current.phase > .9) return;
      motion.current.pointerX = (event.clientX / window.innerWidth - .5) * .15;
      motion.current.pointerY = (event.clientY / window.innerHeight - .5) * .08;
      invalidate.current();
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => { trigger.kill(); labels.revert(); window.removeEventListener("pointermove", pointer); };
  }, []);

  useEffect(() => {
    if (availability) dialog.current?.showModal();
    else dialog.current?.close();
  }, [availability]);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  }

  const exploring = phase >= 5.65 && phase < 6.65;

  return (
    <>
      <a className="fixed -top-[100px] left-5 z-[100] bg-[#91bfff] p-[15px] text-[#111] focus:top-[15px]" href="#features">Skip to product features</a>
      <header className="fixed inset-x-0 top-0 z-50 flex h-[75px] items-center md:h-22 justify-between border-b border-white/8 bg-[linear-gradient(#101113e8,#10111360)] px-6 backdrop-blur-[12px] md:px-12">
        <a href="#" className="relative pb-3 text-[22px] leading-none font-bold tracking-[-1.3px] md:text-[25px] [&_small]:absolute [&_small]:-bottom-px [&_small]:left-px [&_small]:text-[8px] [&_small]:font-normal [&_small]:tracking-[1.7px]" aria-label="Soundcore home">soundcore<span className="ml-0.5 inline-block -rotate-40 text-[26px]">◔</span><small>by Anker</small></a>
        <nav className="hidden items-center gap-9 text-xs text-white/55 md:flex" aria-label="Main navigation">
          <a className="transition hover:text-white" href="#reveal">Overview</a><a className="transition hover:text-white" href="#features">The details</a><a className="transition hover:text-white" href="#explore">Explore in 3D <span className="ml-1 text-blue-400">↗</span></a>
        </nav>
        <a href="#product" className="rounded-full border border-white/25 px-5 py-2.5 text-[11px] transition hover:border-blue-400 hover:bg-blue-400/10">Discover R50i <span className="ml-4">↗</span></a>
      </header>

      <div className={`fixed inset-0 z-10 h-svh [&_canvas]:relative [&_canvas]:z-[1] ${exploring ? "pointer-events-auto cursor-grab active:cursor-grabbing [&_canvas]:touch-pan-y!" : "pointer-events-none"}`} aria-label="3D Soundcore R50i product visualization">
        <div className="absolute top-[12%] left-[14%] h-[90%] w-[85%] rounded-full bg-[radial-gradient(ellipse,#41577519,#23272d17_40%,transparent_68%)]" />
        {available === true && <ProductScene motion={motion} invalidateRef={invalidate} reduced={reduced} interactive={exploring} onLoaded={onLoaded} onError={onSceneError} onAnchor={onAnchor} />}
        {available === false && <div className="absolute inset-x-[8%] top-[16%] bottom-[45%] flex items-center justify-center md:inset-x-[20%] md:top-[25%] md:bottom-[12%] [&_img]:max-h-full [&_img]:w-full [&_span]:absolute [&_span]:bottom-0 [&_span]:text-[7px] [&_span]:text-[#7d838b] md:[&_span]:text-[9px]"><Image width={800} height={650} src="/product-fallback.svg" alt="Black Soundcore charging case and earbuds" /><span>Product preview · 3D is unavailable on this device</span></div>}
        {available !== false && !loaded && <div className="absolute top-[62%] left-1/2 flex -translate-x-1/2 items-center gap-2 text-[9px] tracking-[1px] whitespace-nowrap text-[#a5b3c6]" role="status"><span className="size-3 rounded-full border border-[#91bfff33] border-t-[#91bfff] motion-safe:animate-spin" />Preparing your sound<span className="text-white/25"> / 3D</span></div>}
      </div>

      <main ref={root}>
        <section className={`${sectionClass} pt-[125px] md:pt-[clamp(130px,16vh,190px)]`} id="overview" aria-labelledby="hero-title">
          <div className="relative z-[11]">
            <div className={eyebrowClass}><span className="inline-block size-[5px] rounded-full bg-[#5aabff] shadow-[0_0_12px_#5aabff66]" /> SOUNDCORE R50i <span className="text-white/25">/</span> TRUE WIRELESS EARBUDS</div>
            <h1 className="mt-[22px] text-[clamp(61px,14.6vw,100px)] leading-[.98] font-heading font-black tracking-[-.075em] md:mt-[21px] md:text-[clamp(75px,8.6vw,144px)]" id="hero-title">Small size.<br /><span className="pl-[9%] md:pl-[16.6%]">Big sound<span className="text-blue-400">.</span></span></h1>
            <p className="mt-5 ml-[10%] text-[11px] tracking-[-.1px] text-[#a0a2a6] md:absolute md:top-[48%] md:right-0 md:m-0 md:text-[13px]">Meet the Soundcore R50i.</p>
          </div>
          <div className="absolute inset-x-[6%] bottom-[12%] z-20 flex items-center justify-between md:inset-x-[7.1%] md:bottom-[13.5%] md:items-end">
            <div className="hidden md:block [&_p]:mt-[15px] [&_p]:text-lg [&_p]:leading-normal [&_p]:tracking-[-.4px] [&_p]:text-[#d4d4d6]"><span className={tinyLabelClass}>LESS TO CARRY. MORE TO FEEL.</span><p>A small escape.<br />Always within reach.</p></div>
            <div className="flex flex-col items-start gap-[18px] md:items-center"><a className={primaryButtonClass} href="#reveal">Explore the sound <span aria-hidden="true">↗</span></a><a className="flex gap-[30px] text-[10px] text-[#a4a6ab] hover:text-white" href="#features">View features <span>↓</span></a></div>
            <div className="relative mb-[38px] pl-[19px] text-[7px] tracking-[1.2px] text-[#b6b8be] md:mb-[35px] md:text-[8px] [&_small]:mt-[9px] [&_small]:block [&_small]:text-[8px] [&_small]:text-[#62666e]"><span className="absolute -top-px left-0 size-2.5 rounded-full border border-[#64666a] bg-[#17191c] shadow-[0_0_0_3px_#ffffff06]" /> GRAPHITE BLACK<small>ANKER / A3949</small></div>
          </div>
          <a className="absolute bottom-[30px] left-[6%] z-20 flex items-center gap-[14px] text-[6px] tracking-[1.7px] text-[#777c83] md:bottom-[35px] md:left-[7.1%] md:text-[7px] [&>span:last-child]:text-[#c1c5cc]" href="#reveal"><span className="h-px w-8 bg-[#777c83]" /> SCROLL TO DISCOVER <span>↓</span></a>
          <span className="absolute right-[4%] bottom-2 text-[120px] leading-none font-semibold tracking-[-14px] text-[#ffffff02] md:text-[180px]" aria-hidden="true">R50i</span>
        </section>

        <section id="reveal" className={sectionClass} aria-labelledby="reveal-title">
          <div className={copyClass}><div className={eyebrowClass}>A LITTLE REVEAL</div><h2 className={headingClass} id="reveal-title">Open up.<br /><span className="text-white/40">Tune in.</span></h2><p className={descriptionClass}>Your everyday escape starts here.</p></div>
          <span className={sectionNumberClass}>01 — THE REVEAL</span>
        </section>

        <div id="features">
          {features.map((feature, index) => <section className={sectionClass} id={feature.id} key={feature.id} aria-labelledby={`${feature.id}-title`}>
            <div data-feature-copy className={copyClass}><div className={eyebrowClass}>{feature.eyebrow}</div><h2 className={headingClass} id={`${feature.id}-title`}>{feature.title.map((line, i) => <span key={line} className={i ? "text-white/40 block" : "block"}>{line}</span>)}</h2><p className={descriptionClass}>{feature.description}</p><div className="mt-[38px] hidden items-center gap-[14px] text-[9px] text-[#696e78] md:flex [&>span:first-child]:text-[#91bfff]"><span>0{index + 1}</span><span className="h-px w-[55px] bg-[#373b42]" /><span>04</span></div></div>
            <span className={sectionNumberClass}>02 — CONSIDERED IN EVERY DETAIL</span>
          </section>)}
        </div>

        <section id="explore" className={sectionClass} aria-labelledby="explore-title">
          <div className={copyClass}><div className={eyebrowClass}>EVERY ANGLE. YOURS.</div><h2 className={headingClass} id="explore-title">Take a<br /><span className="text-white/40">closer look.</span></h2><p className={`${descriptionClass} hidden md:block`}>A little curiosity looks good on you.</p></div>
          <div className="absolute bottom-[6%] left-[7%] z-20 flex w-[86%] flex-wrap items-center justify-center gap-3 text-[9px] text-[#878e99] md:bottom-[17%] md:left-[57%] md:w-[32%] md:gap-[22px] [&>span]:w-auto [&>span]:text-center [&>span]:text-[8px] md:[&>span]:w-full md:[&>span]:text-[9px] [&>span>span]:mr-2.5 [&>span>span]:text-[17px] [&>span>span]:text-[#aacbf8]"><span><span aria-hidden="true">↔</span> Drag to rotate · scroll to continue</span><button className="rounded-[30px] border border-[#ffffff25] px-[13px] py-2.5 text-[10px] text-[#c2c8d2] hover:border-[#91bfff] md:px-[18px] md:py-3 [&_span]:ml-4" onClick={() => { motion.current.reset++; motion.current.pointerX = motion.current.pointerY = 0; invalidate.current(); }}>Reset view <span aria-hidden="true">↺</span></button><div className="hidden gap-[7px] md:flex [&_button]:size-[35px] [&_button]:rounded-full [&_button]:border [&_button]:border-[#ffffff20] [&_button]:text-[#d0d8e6]" aria-label="Rotate product"><button aria-label="Rotate product left" onClick={() => { motion.current.pointerX -= .4; invalidate.current(); }}>←</button><button aria-label="Rotate product right" onClick={() => { motion.current.pointerX += .4; invalidate.current(); }}>→</button></div></div>
          <span className={sectionNumberClass}>03 — EXPLORE IN 3D</span>
        </section>

        <section id="product" className={sectionClass} aria-labelledby="product-title">
          <div className="absolute top-[54%] left-[7%] z-20 md:top-[24%] md:left-[58%]"><div className={eyebrowClass}><span className="inline-block size-[5px] rounded-full bg-[#5aabff] shadow-[0_0_12px_#5aabff66]" /> YOUR EVERYDAY SOUNDTRACK</div><h2 className="my-[13px] text-[43px] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px] md:text-[clamp(48px,5.5vw,88px)]" id="product-title">Go small.<br />Feel more<span className="text-blue-400">.</span></h2><p className="text-[13px] text-[#b2b6bc]">Soundcore R50i <span className="text-white/25">/</span> A3949</p><p className="mt-3 mb-[18px] text-[11px] leading-[1.8] text-[#7d838b] md:mt-[22px] md:mb-7 md:text-xs">A compact case. A personal soundtrack.<br />Make a little room for your sound.</p><button className={primaryButtonClass} onClick={() => setAvailability(true)}>Check availability <span aria-hidden="true">↗</span></button><span className={"mt-5 hidden text-[8px] leading-[1.7] tracking-[1.6px] text-white/35 md:block"}>GRAPHITE BLACK · BY ANKER</span></div>
          <footer className="absolute inset-x-[3.5%] bottom-0 z-20 flex items-center justify-between border-t border-[#ffffff10] px-[3%] py-5 text-[9px] text-[#727780] md:px-[3.8%] md:py-[27px] [&>a:first-child]:text-[15px] [&>a:first-child]:text-[#ddd] md:[&>a:first-child]:text-lg [&>span]:hidden md:[&>span]:inline"><a href="#" className="font-semibold tracking-tight">soundcore <span className="text-white/35 font-normal text-xs">by Anker</span></a><a href="#overview">Back to top ↑</a></footer>
        </section>
      </main>

      <div className={`pointer-events-none fixed inset-0 z-[21] transition-opacity duration-350 ${available && loaded && phase > 1.65 && phase < 5.55 ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
        <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline ref={connector} fill="none" stroke="#80b8ff" strokeWidth=".6" vectorEffect="non-scaling-stroke" /><circle ref={hotspot} r=".36" fill="#91bfff" /></svg>
        <div className="absolute top-[49%] left-[60%] max-w-[35%] motion-safe:animate-label-in md:top-[68%] md:left-[79%] md:max-w-[18%] [&_p]:mt-[5px] [&_p]:hidden [&_p]:text-[10px] [&_p]:leading-normal [&_p]:text-[#8b929e] md:[&_p]:block" key={active}><span className={"text-[7px] leading-[1.7] tracking-[1.6px] text-[#9b9da3] md:text-[8px]"}>{features[active].detail}</span><p>{features[active].note}</p></div>
      </div>

      <nav aria-label="Product features" className={`fixed bottom-[15px] left-1/2 z-40 flex w-max max-w-[96%] -translate-x-1/2 items-center gap-px rounded-[50px] border border-[#ffffff14] bg-[#191c22dd] p-[5px] backdrop-blur-[18px] transition-[opacity,translate] duration-350 md:bottom-9 md:w-auto md:gap-[5px] md:p-[7px] ${phase > 1.55 && phase < 5.6 ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"}`} inert={!(phase > 1.55 && phase < 5.6)}>
        <span className="hidden px-[13px] text-[7px] tracking-[1.5px] whitespace-nowrap text-[#636b79] md:inline">THE DETAILS</span>{features.map((f, i) => <button key={f.id} aria-current={active === i ? "step" : undefined} onClick={() => goTo(f.id)} className={`flex items-center gap-[6px] rounded-[30px] px-3 py-[11px] text-[9px] transition-[background,color] duration-250 md:gap-[9px] md:px-[17px] md:py-3 md:text-[10px] [&_span]:text-[7px] md:[&_span]:text-[8px] ${active === i ? "bg-[#3e72ad35] text-[#c2dcff] [&_span]:text-[#86b9ff]" : "text-[#b0b6bf] [&_span]:text-[#646b76]"}`}><span>0{i + 1}</span>{f.name}</button>)}
      </nav>

      <dialog ref={dialog} className="fixed m-auto w-[calc(100%_-_40px)] max-w-[460px] rounded-[10px] border border-[#ffffff20] bg-[#1b1e23] px-[35px] pt-[50px] pb-[35px] text-[#eee] backdrop:bg-[#000b] backdrop:backdrop-blur-[8px]" aria-labelledby="availability-title" onClose={() => setAvailability(false)} onClick={e => { if (e.target === e.currentTarget) setAvailability(false); }}><div className={eyebrowClass}>SOUNDCORE R50i / A3949</div><h2 className="my-[18px] text-[42px] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px]" id="availability-title">Find your sound.</h2><p className="mb-6 text-[13px] leading-[1.8] text-[#a1a8b2]">Availability varies by region. Visit Soundcore to find your local store and current product availability.</p><a className={primaryButtonClass} href="https://www.soundcore.com/" target="_blank" rel="noopener noreferrer">Visit Soundcore <span>↗</span></a><button autoFocus className="absolute top-[17px] right-[22px] text-[11px] text-[#aaa]" onClick={() => setAvailability(false)}>Close ×</button></dialog>
    </>
  );
}
