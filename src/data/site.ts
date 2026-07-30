export const site = {
  name: "Simple Beauty",
  email: "contact@beauty-demo.cchk.uk",
  location: "United Kingdom",
  url: "https://beauty-demo.cchk.uk",
  description:
    "Simple Beauty is preparing a curated online destination for Korean and Asian beauty in the UK.",
} as const;

export const categories = [
  {
    name: "Skincare",
    image: "/images/skincare.webp",
    alt: "A drop of facial oil held above a hand in warm natural light",
    copy: "Thoughtful essentials for cleansing, hydration and everyday skin rituals.",
  },
  {
    name: "Makeup",
    image: "/images/makeup.webp",
    alt: "Makeup brushes and colour products arranged on a neutral surface",
    copy: "Modern colour, complexion and finishing products selected with care.",
  },
  {
    name: "Haircare",
    image: "/images/haircare.webp",
    alt: "Healthy hair photographed in warm editorial light",
    copy: "Scalp, wash-day and styling discoveries for considered routines.",
  },
  {
    name: "Body care",
    image: "/images/body-care.webp",
    alt: "A person applying an unbranded lotion to the back of their hand",
    copy: "Everyday cleansing, moisture and body-care rituals.",
  },
  {
    name: "Beauty tools",
    image: "/images/beauty-tools.webp",
    alt: "Beauty brushes and facial tools arranged as a flat lay",
    copy: "Practical tools designed to support simple, effective routines.",
  },
] as const;

export const launchSteps = [
  [
    "01",
    "Research",
    "Reviewing product categories and the needs of UK beauty shoppers.",
  ],
  [
    "02",
    "Relationships",
    "Exploring supply relationships with established beauty brands and distributors.",
  ],
  [
    "03",
    "Platform",
    "Currently developing our online platform and customer experience.",
  ],
  [
    "04",
    "Launch",
    "Product availability will be announced closer to launch.",
  ],
] as const;
