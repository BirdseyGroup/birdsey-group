"use client";

import { clsx } from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCustomMediaQuery } from "hooks";
import { AnimatedWord } from "../AnimatedWord";
import sharedStyles from "../shared.module.css";
import styles from "./brandShowcase.module.css";

interface Affiliate {
  title: string;
  subtitle: string;
  description: string;
  logo: string;
  slideImage: string;
  website: string;
}

interface BrandShowcaseProps {
  heading: string;
  items: Affiliate[];
}

export function BrandShowcase({ heading, items }: BrandShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDot, setSelectedDot] = useState(0);

  // Match the CSS media query breakpoint (768px)
  const isMobile = useCustomMediaQuery("(max-width: 768px)");

  // Embla carousel for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedDot(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      // Determine active slide based on which content item is near the middle
      contentRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const itemRect = ref.getBoundingClientRect();
        const triggerPoint = window.innerHeight / 2;

        // Check if this item is in the trigger zone
        if (itemRect.top <= triggerPoint && itemRect.bottom >= triggerPoint) {
          setActiveSlide(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items.length]);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.scrollContainer}>
        <section id="services" className={styles.stickySection}>
          <AnimatedWord
            imagePath="/images/words/Trust.svg"
            alt="Trust"
            direction="left-to-right"
            speed={0.5}
            className={styles.trustWord}
          />
          {/* Left Column - Sticky Images with Heading */}
          <div className={styles.imageColumn}>
            <div className={styles.stickyWrapper}>
              <h2 className={styles.stickyHeading}>{heading}</h2>
              <div className={styles.stickyImageWrapper}>
                {items.map((item, index) => (
                  <a
                    key={index}
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(styles.brandImage, {
                      [styles.activeImage]: index === activeSlide,
                    })}
                  >
                    <img
                      src={item.slideImage}
                      alt={`${item.title} ${item.subtitle}`}
                      className={styles.brandLogo}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Scrolling Content (Desktop) */}
          {!isMobile && (
            <div className={styles.contentColumn}>
              {items.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }}
                  className={styles.contentItem}
                >
                  <h2
                    className={clsx(
                      sharedStyles.subtitle,
                      sharedStyles.subtitleCentered,
                      styles.title
                    )}
                  >
                    {item.title}
                  </h2>
                  <h3 className={styles.subtitle}>{item.subtitle}</h3>
                  <div className={sharedStyles.divider} />
                  <p
                    className={clsx(
                      sharedStyles.subheading,
                      sharedStyles.subheadingCentered,
                      styles.description
                    )}
                  >
                    {item.description}
                  </p>
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visitLink}
                  >
                    Visit Website
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Carousel */}
          {isMobile && (
            <div className={styles.mobileCarouselWrapper}>
              <div className={styles.emblaViewport} ref={emblaRef}>
                <div className={styles.emblaContainer}>
                  {items.map((item, index) => (
                    <div key={index} className={styles.emblaSlide}>
                      <h2
                        className={clsx(
                          sharedStyles.subtitle,
                          sharedStyles.subtitleCentered,
                          styles.title
                        )}
                      >
                        {item.title}
                      </h2>
                      <h3 className={styles.subtitle}>{item.subtitle}</h3>
                      <div className={sharedStyles.divider} />
                      <p
                        className={clsx(
                          sharedStyles.subheading,
                          sharedStyles.subheadingCentered,
                          styles.description
                        )}
                      >
                        {item.description}
                      </p>
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.visitLink}
                      >
                        Visit Website
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 17 17 7M9 7h8v8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.emblaDots}>
                {items.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={clsx(styles.emblaDot, {
                      [styles.emblaDotActive]: index === selectedDot,
                    })}
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
