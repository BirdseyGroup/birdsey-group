"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { clsx } from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./brandCarousel.module.css";

const carouselSlides = [
  {
    title: "Commercial Mortgage",
    subtitle: "Diligence & Underwriting",
    description:
      "Provides a full range of commercial mortgage diligence and underwriting services. With experience in all property types, BGC has provided services on over 60,000 loans representing a loan balance of over $250 Billion.",
    logo: "https://birdseygroup.com/wp-content/uploads/2014/09/Birdsey-Commercial_Vertical.png",
    website: "https://birdseycommercial.com",
  },
  {
    title: "Residential Quality Control",
    subtitle: "& Due Diligence",
    description:
      "Provides quality control and due diligence services to the residential mortgage market. With a full suite of loan review services we help mortgage originators and buyers manage risk.",
    logo: "https://birdseygroup.com/wp-content/uploads/2018/04/Birdsey-Residential-PNG.png",
    website: "https://birdseyresidential.com",
  },
  {
    title: "REO Property",
    subtitle: "Preservation Services",
    description:
      "Provides commercial and residential REO preservation services. BPS provides a full range of property preservation services to lenders and managers of REO properties throughout the United States.",
    logo: "https://birdseygroup.com/wp-content/uploads/2014/09/bps-logo.png",
    website: "https://www.birdseypropertysolutions.com",
  },
  {
    title: "Turnkey Residential",
    subtitle: "Renovation Contractor",
    description:
      "A turnkey residential renovation contractor with full-time field superintendents in each market to renovate your asset to any finish level, delivering projects on time and on budget.",
    logo: "/images/birdsey-construction-management-squarejpg.jpg",
    website: "https://www.birdseyconstruction.com",
  },
  {
    title: "Commercial Real Estate",
    subtitle: "Debt Products",
    description:
      "Offers a full complement of commercial real estate debt products for commercial real estate owners and investors through a dedicated and direct capital channel.",
    logo: "https://birdseygroup.com/wp-content/uploads/2014/09/birdseycapital.png",
    website: "http://www.birdseycapital.com",
  },
];

export function BrandCarousel() {
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

  return (
    <Section id="services" className={styles.brandCarousel}>
      <h2 className={clsx(sharedStyles.subtitle, styles.sectionTitle)}>
        Birdsey Group Affiliates
      </h2>
      <div className={styles.carouselWrapper}>
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {carouselSlides.map((slide, index) => (
              <div className={styles.emblaSlide} key={index}>
                <Flex container gap="600" alignSecondary="center">
                  <FlexItem size="major">
                    <a
                      href={slide.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.logoLink}
                    >
                      <div className={styles.logoContainer}>
                        <img
                          src={slide.logo}
                          alt={`${slide.title} ${slide.subtitle} logo`}
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
                        {slide.title} <br />
                        {slide.subtitle}
                      </h2>
                      <div className={sharedStyles.divider} />
                      <p
                        className={clsx(
                          sharedStyles.subheading,
                          sharedStyles.subheadingCentered,
                        )}
                      >
                        {slide.description}
                      </p>
                    </Flex>
                  </FlexItem>
                </Flex>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.emblaDots}>
          {carouselSlides.map((_, index) => (
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
