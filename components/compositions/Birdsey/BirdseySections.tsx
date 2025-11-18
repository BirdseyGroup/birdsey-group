"use client";

import { IconArrowUpRight } from "@/components/icons";
import { Flex, FlexItem, Section } from "@/components/layout";
import {
  Button,
  ButtonGroup,
  Input,
  Textarea,
  TextLink,
} from "@/components/primitives";
import Image from "next/image";
import styles from "./birdsey.module.css";

export function HeroSection() {
  return (
    <Section variant="brand" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          The Standard of Excellence in Real Estate Investment Services.
        </h1>
        <p className={styles.heroSubtitle}>
          One ecosystem. Trusted expertise. Results from capital to completion.
        </p>
        <ButtonGroup>
          <Button variant="primary" size="medium">
            Explore our expertise
          </Button>
          <Button variant="neutral" size="medium">
            Meet the affiliates
          </Button>
        </ButtonGroup>
      </div>
    </Section>
  );
}

export function SubHeroSection() {
  return (
    <Section variant="brand" className={styles.subHero}>
      <Flex container gap="600" alignSecondary="center">
        <FlexItem>
          <h2 className={styles.subtitle}>The Birdsey Standard</h2>
        </FlexItem>
        <FlexItem size="major">
          <p className={styles.subheading}>
            Building relationships. Bringing discipline to execution. Every
            Birdsey affiliate operates under the same promise: Quality, Urgency,
            Accountability, Resilience, Transparency.
          </p>
        </FlexItem>
      </Flex>
    </Section>
  );
}

export function AffiliatesSection() {
  const logos = [
    "/images/affiliate-1.png",
    "/images/construction-logo.png",
    "/images/affiliate-2.png",
    "/images/affiliate-3.png",
    "/images/affiliate-4.png",
  ];

  return (
    <Section className={styles.affiliates}>
      <Flex direction="column" gap="1200" alignSecondary="center">
        <h2 className={styles.sectionTitle}>From Capital to Completion</h2>
        <div className={styles.affiliatesLogos}>
          {logos.map((logo, i) => (
            <div key={i} className={styles.affiliateLogo}>
              <Image
                src={logo}
                alt={`Affiliate logo ${i + 1}`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </Flex>
    </Section>
  );
}

export function FamilyBrandsSection() {
  return (
    <Section className={styles.family}>
      <Flex container gap="600" alignSecondary="center">
        <FlexItem size="major">
          <div className={styles.imagePlaceholder} />
        </FlexItem>
        <FlexItem size="major">
          <Flex direction="column" gap="400" alignSecondary="center">
            <h2 className={styles.subtitle}>
              Build with Certainty. Deliver with Discipline.
            </h2>
            <div className={styles.divider} />
            <p className={styles.subheading}>
              Turns vision into performance through expert project execution.
            </p>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}

export function PerformanceSection() {
  const items = [
    { title: "$XB+", description: "Assets managed" },
    { title: "25+", description: "Years" },
    { title: "5", description: "Affiliates" },
    { title: "Nationwide", description: "Reach" },
  ];

  return (
    <Section className={styles.performance}>
      <Flex direction="column" gap="1200" alignSecondary="center">
        <h2 className={styles.sectionTitle}>Performance that Build Trust</h2>
        <Flex container gap="600">
          {items.map((item, i) => (
            <FlexItem key={i}>
              <Flex direction="column" gap="400" alignSecondary="center">
                <h3 className={styles.subtitle}>{item.title}</h3>
                <div className={styles.divider} />
                <p className={styles.subheading}>{item.description}</p>
              </Flex>
            </FlexItem>
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}

export function NewsSection() {
  const articles = [
    { date: "22 OCTOBER 2025", category: "ARTICLE", title: "Article Header" },
    { date: "22 OCTOBER 2025", category: "ARTICLE", title: "Article Header" },
    { date: "22 OCTOBER 2025", category: "ARTICLE", title: "Article Header" },
  ];

  return (
    <Section className={styles.news}>
      <Flex direction="column" gap="1200">
        <h2 className={styles.sectionTitle}>Insights & Recognition.</h2>
        <Flex direction="column" gap="0">
          {articles.map((article, i) => (
            <article key={i} className={styles.article}>
              <p className={styles.articleDate}>{article.date}</p>
              <div className={styles.articleImage} />
              <Flex direction="column" gap="400">
                <p className={styles.articleCategory}>{article.category}</p>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <TextLink href="#">READ MORE</TextLink>
              </Flex>
              <IconArrowUpRight />
            </article>
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}

export function CareersSection() {
  return (
    <Section className={styles.careers}>
      <Flex container gap="1200" alignSecondary="center">
        <FlexItem size="major">
          <div className={styles.imagePlaceholder} />
        </FlexItem>
        <FlexItem size="major">
          <Flex direction="column" gap="400">
            <h2 className={styles.subtitle}>Build Your Career on Trust.</h2>
            <div className={styles.divider} />
            <div className={styles.careersText}>
              <p>
                Every Birdsey company shares the same foundation: integrity,
                precision, and partnership. Whether you're managing assets,
                building projects, or structuring deals, you're part of
                something bigger.
              </p>
              <p>
                Join a team that values precision, partnership, and purpose.
              </p>
              <p>
                We are always interested in hearing from talented people. Send
                resume, cover letter, salary requirements and references to:
              </p>
              <p>
                <strong>careers@birdseygroup.com</strong>
              </p>
            </div>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}

export function ContactSection() {
  return (
    <Section className={styles.contact}>
      <Flex container gap="600" alignSecondary="start">
        <FlexItem size="major">
          <h2 className={styles.sectionTitle}>
            Let's Move Real Estate Forward.
          </h2>
        </FlexItem>
        <FlexItem>
          <div className={styles.contactForm}>
            <Flex direction="column" gap="600">
              <div className={styles.formHeader}>
                <div className={styles.formAccent} />
                <h3 className={styles.formTitle}>
                  Thank you for your interest in Birdsey.
                </h3>
                <p>
                  Please complete the form below, and we will get back with you
                  as soon as possible.
                </p>
              </div>

              <Input placeholder="Name" />
              <Input placeholder="Phone" />
              <Input placeholder="Email" />
              <Input placeholder="Company" />
              <Textarea placeholder="Comments" />

              <Button variant="primary" size="medium">
                SUBMIT
              </Button>
            </Flex>
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
