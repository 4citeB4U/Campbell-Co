/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CONTENT
TAG: CONTENT.SRC.CONTENT.SITE_CONTENT.MAIN
DESCRIPTION: No-code editable storefront content defaults and helpers
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = siteContent.ts — governed module
WHY = Provide public-site content defaults for admin controlled editing
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/content/siteContent.ts
WHEN = 2026-05-08
HOW = Typed defaults consumed by storefront components and admin editor

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
export type LinkTarget = {
  label: string;
  path: string;
};

export type ImageStoryBlock = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  cta: LinkTarget;
};

export type SiteContent = {
  header: {
    benefits: string[];
    searchPlaceholder: string;
    mobileConciergeTitle: string;
    mobileConciergeBody: string;
    mobileConciergeCta: LinkTarget;
  };
  home: {
    hero: {
      eyebrow: string;
      titleLineOne: string;
      titleLineTwo: string;
      body: string;
      primaryCta: LinkTarget;
      secondaryCta: LinkTarget;
      image: string;
      imageAlt: string;
      featureTitle: string;
      featureSubtitle: string;
      priceEyebrow: string;
      priceText: string;
      scrollText: string;
    };
    collections: {
      women: ImageStoryBlock;
      men: ImageStoryBlock;
    };
    promo: {
      feature: ImageStoryBlock;
      popularStylesTitle: string;
      popularStyles: Array<{
        label: string;
        image: string;
        path: string;
      }>;
      appointment: {
        title: string;
        body: string;
        cta: LinkTarget;
      };
    };
  };
  verification: {
    eyebrow: string;
    title: string;
    body: string;
    naturalTitle: string;
    naturalBullets: string[];
    naturalCta: LinkTarget;
    labTitle: string;
    labBullets: string[];
    labCta: LinkTarget;
    advantageTitle: string;
    advantageBody: string;
    proofPoints: Array<{ value: string; label: string }>;
  };
  trustBar: {
    label: string;
    points: string[];
    established: string;
  };
  footer: {
    brandStatement: string;
    newsletterTitle: string;
    newsletterBody: string;
    copyright: string;
    badges: Array<{
      title: string;
      body: string;
    }>;
  };
  pages: {
    about: {
      eyebrow: string;
      title: string;
      body: string;
      image: string;
      cta: LinkTarget;
    };
    faq: {
      eyebrow: string;
      title: string;
      body: string;
      questions: Array<{ question: string; answer: string }>;
    };
    contact: {
      eyebrow: string;
      title: string;
      body: string;
      primaryCta: LinkTarget;
      secondaryCta: LinkTarget;
    };
    journal: {
      eyebrow: string;
      title: string;
      body: string;
      posts: Array<{ title: string; excerpt: string; path: string }>;
    };
  };
  theme: {
    primaryColor: string;
    headingFont: string;
  };
};

export const SITE_CONTENT_STORAGE_KEY = 'campbell-site-content';
export const SITE_CONTENT_EVENT = 'campbell-site-content-updated';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  header: {
    benefits: ['Free Insured Shipping', 'Lifetime Warranty', 'Authenticity Guaranteed'],
    searchPlaceholder: 'Search premium diamonds, necklaces, rings...',
    mobileConciergeTitle: 'Diamond Concierge',
    mobileConciergeBody: 'Professionally verified pieces only. All stones are hand-inspected.',
    mobileConciergeCta: { label: 'Book a Consultation', path: '/contact' },
  },
  home: {
    hero: {
      eyebrow: 'The Narrative Luxury House',
      titleLineOne: 'The House of',
      titleLineTwo: 'Movement.',
      body: 'Sourcing Artifacts of Status and Identity. A modern diamond lineage focused on ethical intelligence and cinematic craftsmanship.',
      primaryCta: { label: 'Browse the House', path: '/shop' },
      secondaryCta: { label: 'Enter the Vault', path: '/diamonds' },
      image: '/assets/campbell/jewelry/diamond-macro.png',
      imageAlt: 'Diamond close-up',
      featureTitle: 'The Brilliant',
      featureSubtitle: 'Hand-Selected Diamonds',
      priceEyebrow: 'Excellence Starting from',
      priceText: '$425.00',
      scrollText: 'Discover the Movement',
    },
    collections: {
      women: {
        eyebrow: 'The Feminine Selection',
        title: 'Shop Women',
        body: 'Ethereal designs. Timeless brilliance. Curated for the modern woman of distinction.',
        image: '/assets/campbell/editorial/women-collection.png',
        imageAlt: "Women's luxury jewelry",
        cta: { label: 'Explore Collection', path: '/women/rings' },
      },
      men: {
        eyebrow: 'The Masculine Selection',
        title: 'Shop Men',
        body: 'Bold silhouettes. Structural integrity. Engineered for the masculine aesthetic.',
        image: '/assets/campbell/editorial/men-collection.png',
        imageAlt: "Men's luxury jewelry",
        cta: { label: 'Explore Collection', path: '/men/rings' },
      },
    },
    promo: {
      feature: {
        eyebrow: '',
        title: 'Strength. Style. Legacy.',
        body: "Premium men's collections crafted to elevate every look.",
        image: '/assets/campbell/editorial/men-collection.png',
        imageAlt: 'Promotion',
        cta: { label: "Shop Men's Collections", path: '/men/rings' },
      },
      popularStylesTitle: 'Popular Styles',
      popularStyles: [
        { image: '/assets/campbell/jewelry/men-chains.png', label: 'Miami Cuban', path: '/men/chains' },
        { image: '/assets/campbell/jewelry/women-chains.png', label: 'Rope Chains', path: '/men/chains' },
        { image: '/assets/campbell/editorial/figaro-links.png', label: 'Figaro Links', path: '/men/chains' },
      ],
      appointment: {
        title: 'Expert Guide',
        body: 'Our specialists are here to help you find the perfect match.',
        cta: { label: 'Book Appointment', path: '/contact' },
      },
    },
  },
  verification: {
    eyebrow: 'The Movement',
    title: 'Transparency in Brilliance',
    body: "We've eliminated the gatekeepers. All Campbell & Co. diamonds are professionally verified and authenticated through our elite international sourcing network.",
    naturalTitle: 'Natural Diamonds',
    naturalBullets: [
      'GIA / IGI Dual-Certified',
      'Ethically sourced origins',
      'Rare geological rarities',
      'Timeless investment value',
    ],
    naturalCta: { label: 'View Natural Collection', path: '/diamonds/natural' },
    labTitle: 'Lab Diamonds',
    labBullets: [
      'Optically & chemically identical',
      'Environmental priority sourcing',
      'Advanced crystalline growth',
      'Superior value for brilliance',
    ],
    labCta: { label: 'View Lab Collection', path: '/diamonds/lab' },
    advantageTitle: 'The Direct Link Advantage',
    advantageBody: 'Why our pricing is different? We bypass traditional retail overhead and luxury mall markups. By connecting you directly to our international supplier network, we deliver the same certified quality for significantly less.',
    proofPoints: [
      { value: '0%', label: 'Retail Markup' },
      { value: 'Direct', label: 'Global Sourcing' },
      { value: 'Elite', label: 'Trust Network' },
    ],
  },
  trustBar: {
    label: 'Cultural Luxury // Global Access',
    points: ['Direct Sourcing', 'Zero Retail Markup', 'Certified Brilliance'],
    established: 'Established 2026',
  },
  footer: {
    brandStatement: 'Diamonds. Crafted for a lifetime. An emerging luxury jewelry house with global sourcing connections and modern luxury culture.',
    newsletterTitle: 'Stay Connected',
    newsletterBody: 'Be the first to know about new arrivals, exclusive offers, and more.',
    copyright: '© 2026 Campbell & Co.',
    badges: [
      { title: 'Free Insured Shipping', body: 'Worldwide, fully insured.' },
      { title: 'Lifetime Warranty', body: 'We stand behind every piece.' },
      { title: 'Authenticity Guaranteed', body: 'Every stone is tested & verified.' },
      { title: 'Secure Checkout', body: 'Your payment information is safe.' },
      { title: 'Easy Returns', body: 'Hassle-free 30-day returns.' },
    ],
  },
  pages: {
    about: {
      eyebrow: 'Our House',
      title: 'A Modern Jewelry House Built on Trust',
      body: 'Campbell & Co. connects cinematic jewelry design, global sourcing relationships, and practical transparency for clients who want beautiful pieces without mystery or pressure.',
      image: '/assets/campbell/editorial/women-collection.png',
      cta: { label: 'Explore the Collection', path: '/shop' },
    },
    faq: {
      eyebrow: 'Client Care',
      title: 'Questions, Answered Clearly',
      body: 'The essentials customers ask before choosing a piece, written in plain language.',
      questions: [
        { question: 'Are the diamonds certified?', answer: 'Many stones include IGI, GIA, or GCAL certification. Product pages show available certification details.' },
        { question: 'Do you offer insured shipping?', answer: 'Yes. Campbell & Co. includes secure insured shipping on every order.' },
        { question: 'Can I request help choosing a piece?', answer: 'Yes. Use the contact page or appointment buttons to request a guided recommendation.' },
      ],
    },
    contact: {
      eyebrow: 'Concierge Desk',
      title: 'Tell Us What You Are Looking For',
      body: 'Share the occasion, style, budget, or stone preference. A Campbell & Co. specialist can guide the next step.',
      primaryCta: { label: 'Email the Concierge', path: 'mailto:hello@campbell.example' },
      secondaryCta: { label: 'Browse First', path: '/shop' },
    },
    journal: {
      eyebrow: 'House Journal',
      title: 'Notes on Diamonds, Style, and Ownership',
      body: 'A place for guides, launch notes, care advice, and stories behind the collection.',
      posts: [
        { title: 'How to Read a Diamond Certificate', excerpt: 'A plain-English guide to the terms that actually matter.', path: '/diamonds' },
        { title: 'Choosing Gold Tone by Wardrobe', excerpt: 'A practical way to pick yellow, white, rose, or platinum.', path: '/shop' },
        { title: 'The Case for Lab Diamonds', excerpt: 'Where value, brilliance, and sourcing priorities meet.', path: '/diamonds/lab' },
      ],
    },
  },
  theme: {
    primaryColor: '#D6B46A',
    headingFont: 'Playfair Display',
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function mergeSiteContent(base: SiteContent, incoming: unknown): SiteContent {
  if (!isObject(incoming)) return base;

  const mergeValue = (baseValue: unknown, incomingValue: unknown): unknown => {
    if (Array.isArray(baseValue)) {
      return Array.isArray(incomingValue) ? incomingValue : baseValue;
    }

    if (isObject(baseValue)) {
      const incomingObject = isObject(incomingValue) ? incomingValue : {};
      return Object.fromEntries(
        Object.entries(baseValue).map(([key, value]) => [key, mergeValue(value, incomingObject[key])])
      );
    }

    return incomingValue === undefined || incomingValue === null ? baseValue : incomingValue;
  };

  return mergeValue(base, incoming) as SiteContent;
}
