"use client";

import {
  Footer,
  Header,
  Hero,
  TestimonialCard,
} from "@/components/compositions";
import { Flex, FlexItem, Section } from "@/components/layout";
import {
  Button,
  ButtonGroup,
  Image,
  TextContentHeading,
  TextContentTitle,
} from "@/components/primitives";
import { placeholder } from "@/components/images";
import sectionImage from "@/components/images/section-placeholder.png";

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
        <ButtonGroup align="justify">
          <Button variant="neutral">Button</Button>
          <Button variant="primary">Button</Button>
        </ButtonGroup>
      </Hero>

      {/* Image Section */}
      <Section className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-[var(--sds-color-slate-200)]">
          <Image
            src={sectionImage.src}
            alt="Section background"
            className="w-full h-full object-contain opacity-20"
          />
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section padding="1200">
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <TextContentHeading heading="Heading" subheading="Subheading" />
          <FlexItem>
            <Flex wrap type="third" gap="1200">
              <TestimonialCard
                heading="Quote"
                src={placeholder}
                name="Title"
                username="Description"
              />
              <TestimonialCard
                heading="Quote"
                src={placeholder}
                name="Title"
                username="Description"
              />
              <TestimonialCard
                heading="Quote"
                src={placeholder}
                name="Title"
                username="Description"
              />
              <TestimonialCard
                heading="Quote"
                src={placeholder}
                name="Title"
                username="Description"
              />
              <TestimonialCard
                heading="Quote"
                src={placeholder}
                name="Title"
                username="Description"
              />
              <TestimonialCard
                heading="Quote"
                src={placeholder}
                name="Title"
                username="Description"
              />
            </Flex>
          </FlexItem>
        </Flex>
      </Section>

      <Footer />
    </>
  );
}
