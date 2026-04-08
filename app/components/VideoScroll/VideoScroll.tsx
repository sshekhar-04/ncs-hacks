"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 160;
const FOLDER_PATH = "/ezgif-4228b47dc4eb8e89-jpg";

const VideoScroll = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // We'll store the current frame index here to use in the GSAP animation
  const playhead = useRef({ frame: 0 });

  useEffect(() => {
    // Prevent re-initialization if already loaded
    if (imagesLoaded) return;

    gsap.registerPlugin(ScrollTrigger);

    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);

      const promises = [];
      for (let i = 1; i <= FRAME_COUNT; i++) {
        promises.push(new Promise<void>((resolve) => {
          const img = new Image();
          const paddedIndex = i.toString().padStart(3, "0");
          img.src = `${FOLDER_PATH}/ezgif-frame-${paddedIndex}.jpg`;

          img.onload = () => {
            loadedImages[i - 1] = img;
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${paddedIndex}`);
            resolve(); // Resolve anyway so we don't block forever
          };
        }));
      }

      await Promise.all(promises);
      
      imagesRef.current = loadedImages.filter(Boolean);
      setImagesLoaded(true);
    };

    loadImages();
  }, [imagesLoaded]);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = imagesRef.current;

    // Set initial canvas size based on window
    const resizeCanvas = () => {
      // Use devicePixelRatio for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      // You can adjust canvas size logic. Using viewport dimensions here.
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      renderFrame(playhead.current.frame);
    };

    const renderFrame = (index: number) => {
      // Clamp index within bounds
      const validIndex = Math.min(Math.max(Math.floor(index), 0), images.length - 1);
      const img = images[validIndex];
      if (!img) return;

      const cw = canvas.width / (window.devicePixelRatio || 1);
      const ch = canvas.height / (window.devicePixelRatio || 1);

      // Draw image covering the whole canvas like CSS object-fit: cover
      const imageAspect = img.width / img.height;
      const canvasAspect = cw / ch;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > imageAspect) {
        drawWidth = cw;
        drawHeight = cw / imageAspect;
        offsetX = 0;
        offsetY = (ch - drawHeight) / 2;
      } else {
        drawWidth = ch * imageAspect;
        drawHeight = ch;
        offsetX = (cw - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Set up GSAP ScrollTrigger
    const st = gsap.to(playhead.current, {
      frame: images.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
      onUpdate: () => renderFrame(playhead.current.frame),
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, [imagesLoaded]);

  return (
    <section 
      ref={containerRef} 
      style={{ width: "100%", height: "400vh", position: "relative", backgroundColor: "#000" }}
    >
      <div 
        style={{
          width: "100%",
          height: "100dvh",
          position: "sticky",
          top: 0,
          left: 0,
          overflow: "hidden"
        }}
      >
        {!imagesLoaded && (
          <div 
            style={{ 
              position: "absolute", 
              inset: 0, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "white" 
            }}
          >
            Loading...
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </section>
  );
};

export default VideoScroll;
