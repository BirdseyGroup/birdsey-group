"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { clsx } from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./brandCarousel.module.css";

interface Affiliate {
  title: string;
  subtitle: string;
  description: string;
  logo: string;
  slideImage: string;
  website: string;
}

interface BrandCarouselProps {
  items: Affiliate[];
}

export function BrandCarousel({ items }: BrandCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    loop: true,
    breakpoints: {
      "(max-width: 768px)": { axis: "x" },
    },
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  return (
    <Section
      id="services"
      className={styles.brandCarousel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h2 className={clsx(sharedStyles.subtitle, styles.sectionTitle)}>
        Birdsey Group Affiliates
      </h2>
      <div className={styles.carouselWrapper}>
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {items.map((item, index) => (
              <div className={styles.emblaSlide} key={index}>
                <Flex container gap="600" alignSecondary="center">
                  <FlexItem size="major">
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.logoLink}
                    >
                      <div className={styles.logoContainer}>
                        <img
                          src={item.slideImage}
                          alt={`${item.title} ${item.subtitle}`}
                          className={styles.brandLogo}
                        />
                      </div>
                    </a>
                  </FlexItem>
                  <FlexItem size="major">
                    <Flex direction="column" gap="400" alignSecondary="center">
                      <h2
                        className={clsx(
                          sharedStyles.subtitle,
                          sharedStyles.subtitleCentered,
                        )}
                      >
                        {item.title} <br />
                        {item.subtitle}
                      </h2>
                      <div className={sharedStyles.divider} />
                      <p
                        className={clsx(
                          sharedStyles.subheading,
                          sharedStyles.subheadingCentered,
                        )}
                      >
                        {item.description}
                      </p>
                    </Flex>
                  </FlexItem>
                </Flex>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.emblaDots}>
          {items.map((_, index) => (
            <button
              key={index}
              className={clsx(styles.emblaDot, {
                [styles.emblaDotSelected]: index === selectedIndex,
              })}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
