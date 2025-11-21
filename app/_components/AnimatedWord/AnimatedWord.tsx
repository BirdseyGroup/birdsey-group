"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./animatedWord.module.css";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedWordProps {
  /** Path to the SVG word image */
  imagePath: string;
  /** Alt text for accessibility */
  alt: string;
  /** Direction of movement: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' */
  direction?: "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top";
  /** Speed multiplier for the animation (default: 1) */
  speed?: number;
  /** Optional class name for positioning */
  className?: string;
}

export function AnimatedWord({
  imagePath,
  alt,
  direction = "left-to-right",
  speed = 1,
  className,
}: AnimatedWordProps) {
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordRef.current) return;

    const element = wordRef.current;

    // Determine animation values based on direction
    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {};

    switch (direction) {
      case "left-to-right":
        fromVars = { x: "-100%" };
        toVars = { x: "100%", ease: "none" };
        break;
      case "right-to-left":
        fromVars = { x: "100%" };
        toVars = { x: "-100%", ease: "none" };
        break;
      case "top-to-bottom":
        fromVars = { y: "-100%" };
        toVars = { y: "100%", ease: "none" };
        break;
      case "bottom-to-top":
        fromVars = { y: "100%" };
        toVars = { y: "-100%", ease: "none" };
        break;
    }

    // Set initial position and opacity
    gsap.set(element, { ...fromVars, opacity: 0 });

    // Create the animation
    gsap.to(element, {
      ...toVars,
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5 / speed,
        onUpdate: (self) => {
          const progress = self.progress;
          // Show when section is in view
          if (progress > 0.1 && progress < 0.9) {
            element.style.visibility = "visible";
            // Fade in from 10% to 30% of animation
            if (progress < 0.3) {
              element.style.opacity = String((progress - 0.1) * 5);
            }
            // Fade out from 70% to 90% of animation
            else if (progress > 0.7) {
              element.style.opacity = String((0.9 - progress) * 5);
            }
            // Full opacity in the middle
            else {
              element.style.opacity = "1";
            }
          } else {
            element.style.visibility = "hidden";
          }
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element.parentElement) {
          trigger.kill();
        }
      });
    };
  }, [direction, speed]);

  return (
    <div className={`${styles.animatedWord} ${className || ""}`} ref={wordRef}>
      <Image
        src={imagePath}
        alt={alt}
        width={407}
        height={121}
        className={styles.wordImage}
        priority
      />
    </div>
  );
}
