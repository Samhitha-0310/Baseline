import type { ImageKey } from "../content/images.ts";

export const brand = {
  name: "Baseline Corp",
  email: "baselinecorp1@gmail.com",
  tagline: "A creative content studio for brands.",
  statement: "We create thoughtful visual content that brings brands to life.",
  phones: [
    { display: "+91 87904 59389", href: "tel:+918790459389" },
    { display: "+91 63009 39528", href: "tel:+916300939528" },
  ],
} as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "approach", label: "Approach" },
  { id: "contact", label: "Contact" },
] as const;

export const disciplines = [
  "Photography",
  "Film",
  "Reels",
  "Visual storytelling",
  "Creative content",
] as const;

export const principles = [
  {
    index: "01",
    title: "Attention",
    description: "We look closely at what makes a brand distinct before a camera is raised.",
  },
  {
    index: "02",
    title: "Story",
    description: "Every frame should say something true about the people, product, or place it represents.",
  },
  {
    index: "03",
    title: "Identity",
    description: "The work follows the brand: its tone, its details, and the way it wants to be seen.",
  },
  {
    index: "04",
    title: "Craft",
    description: "From the first brief to the final file, the finish should feel considered and complete.",
  },
] as const;

export const differentiators = [
  {
    index: "01",
    title: "Brand first",
    description: "We begin with the identity, not a generic look. The work should feel like the brand it belongs to.",
  },
  {
    index: "02",
    title: "Visual storytelling",
    description: "Photographs and films are made to carry meaning, atmosphere, and a clear point of view.",
  },
  {
    index: "03",
    title: "Careful execution",
    description: "Composition, light, and pacing are treated as decisions, not decoration.",
  },
  {
    index: "04",
    title: "Useful delivery",
    description: "Finished assets are organized for the places they need to live: sites, campaigns, and social frames.",
  },
] as const;

export const frameworkSteps = [
  {
    index: "01",
    title: "Discover",
    description: "Understand the brand, audience, objectives, and the visual direction the work should take.",
    image: "latteHand" satisfies ImageKey,
  },
  {
    index: "02",
    title: "Conceptualize",
    description: "Shape a clear visual approach: the mood, the frames, and the story the content needs to tell.",
    image: "pizzaDark" satisfies ImageKey,
  },
  {
    index: "03",
    title: "Create",
    description: "Produce the agreed photography, film, or digital visuals with attention to detail.",
    image: "garnishDrop" satisfies ImageKey,
  },
  {
    index: "04",
    title: "Deliver",
    description: "Organize and hand over the finished assets according to the scope of the project.",
    image: "icedCoffee" satisfies ImageKey,
  },
] as const;

export const projectTypes = [
  "Photography",
  "Videography",
  "Reels and short-form video",
  "Social media visuals",
  "Website and digital imagery",
  "Creative direction",
  "A mix of the above",
  "Something else",
] as const;

export const audiences = [
  "Consumer brands",
  "Product companies",
  "Hospitality",
  "Retail",
  "Professional practices",
  "Independent makers",
  "New ventures",
  "Established houses",
] as const;
