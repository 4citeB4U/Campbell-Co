/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#1F51FF
FLUO=#0096FF
PASTEL=#A7C7E7

ICON_ASCII:
family=lucide
glyph=database

AGENTS:
ASSESS
ALIGN
AUDIT

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
    conciergeGreeting: string;
  };
  diamondGuide: {
    title: string;
    subtitle: string;
    description: string;
    qualityGuide: Array<{ label: string; sub: string; desc: string; icon: string }>;
    stoneTypes: Array<{ name: string; desc: string; shop: string; icon: string }>;
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
      mediaType?: 'image' | 'video';
      videoUrl?: string;
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
      feature: ImageStoryBlock & {
        mediaType?: 'image' | 'video';
        videoUrl?: string;
      };
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
  legal: {
    privacy: { eyebrow: string; title: string; intro: string; sections: Array<{ title: string; body: string }> };
    terms: { eyebrow: string; title: string; intro: string; sections: Array<{ title: string; body: string }> };
  };
  payments: {
    eyebrow: string;
    title: string;
    body: string;
    examplePrice: number;
    pathways: Array<{ eyebrow: string; title: string; body: string; bullets: string[] }>;
    rolloutTitle: string;
    rolloutBody: string;
    rolloutPhases: string[];
  };
  checkout: {
    detailsEyebrow: string;
    detailsTitle: string;
    paymentOptionsCaption: string;
    confirmationEyebrow: string;
    confirmationTitle: string;
    confirmationBody: string;
    confirmationCta: string;
    securityBadgeTitle: string;
    securityBadgeBody: string;
    agreementText: string;
  };
  theme: {
    primaryColor: string;
    headingFont: string;
  };
  layout: {
    homepage: Array<{ id: string; enabled: boolean; order: number }>;
  };
};

export const SITE_CONTENT_STORAGE_KEY = 'campbell-site-content';
export const SITE_CONTENT_EVENT = 'campbell-site-content-updated';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  header: {
    benefits: ['Free Insured Shipping', 'Lifetime Warranty', 'Authenticity Guaranteed'],
    searchPlaceholder: 'Search premium diamonds, necklaces, rings...',
    mobileConciergeTitle: 'Concierge Avion',
    mobileConciergeBody: 'Speak with our intelligent concierge for personalized artifact curation.',
    mobileConciergeCta: {
      label: 'Consult C&C',
      path: '/contact'
    },
    conciergeGreeting: "Good afternoon. I am Concierge Avion, your guide to the House of Campbell. Whether you seek technical precision or the narrative behind our latest artifacts, I am here to assist."
  },
  diamondGuide: {
    title: "DIAMOND & GEMSTONE GUIDE",
    subtitle: "EXPLORE OUR PREMIUM STONES",
    description: "Hand-selected for brilliance, fire, and exceptional quality. Every stone in our collection meets the most rigorous standards of the Campbell & Co. vault.",
    qualityGuide: [
      { label: 'CUT', sub: 'EXCELLENT', desc: 'Ideal proportions for maximum brilliance and fire.', icon: '/assets/campbell/jewelry/diamond-macro.png' },
      { label: 'COLOR', sub: 'D - F', desc: 'Colorless. The highest grade for exceptional purity.', icon: '/assets/campbell/diamonds/color.png' },
      { label: 'CLARITY', sub: 'VS1+', desc: 'Very Slightly Included. Premium clarity grade.', icon: '/assets/campbell/jewelry/loose-diamonds.png' },
      { label: 'CARAT', sub: '1.00 CT+', desc: 'Weight refers to the size of the diamond.', icon: '/assets/campbell/diamonds/carat.png' },
    ],
    stoneTypes: [
      { name: 'LAB GROWN DIAMONDS', desc: 'Ethical. Sustainable. Identical brilliance.', shop: 'SHOP LAB DIAMONDS', icon: '/assets/campbell/diamonds/emerald.png' },
      { name: 'NATURAL DIAMONDS', desc: 'Timeless. Rare. Formed by nature.', shop: 'SHOP NATURAL DIAMONDS', icon: '/assets/campbell/diamonds/round.png' },
      { name: 'VERIFIED DIAMONDS', desc: 'IGI / GIA / GCAL Certified. Maximum confidence.', shop: 'SHOP VERIFIED', icon: '/assets/campbell/jewelry/loose-diamonds.png' },
      { name: 'UNVERIFIED DIAMONDS', desc: 'Beautiful quality. Better pricing.', shop: 'SHOP UNVERIFIED', icon: '/assets/campbell/diamonds/carat.png' },
      { name: 'LOOSE DIAMONDS', desc: 'Hand-selected stones. Perfect for custom pieces.', shop: 'SHOP LOOSE DIAMONDS', icon: '/assets/campbell/jewelry/diamond-macro.png' },
    ]
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
      mediaType: 'image',
      videoUrl: '',
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
        mediaType: 'image',
        videoUrl: '',
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
    copyright: '(c) 2026 Campbell & Co.',
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
  legal: {
    privacy: {
      eyebrow: 'Privacy',
      title: 'Privacy Policy',
      intro: 'A plain-language overview of how Campbell & Co. handles browsing activity, inquiries, and customer information across the storefront and internal operating system.',
      sections: [
        {
          title: 'Information We Collect',
          body: 'Campbell & Co. may collect information you provide directly, including contact details, consultation requests, purchase information, and communications submitted through the site.',
        },
        {
          title: 'How Information Is Used',
          body: 'Information is used to respond to inquiries, support orders, improve the customer experience, manage operations, and maintain the performance and security of the application.',
        },
        {
          title: 'Operational Services',
          body: 'Portions of the application may rely on third-party infrastructure such as hosting, analytics, authentication, storage, and payment-related services needed to operate the platform responsibly.',
        },
        {
          title: 'Customer Requests',
          body: 'Customers may request clarification, updates, or removal of submitted information by contacting Campbell & Co. through the available concierge or support pathways.',
        },
      ]
    },
    terms: {
      eyebrow: 'Terms',
      title: 'Terms of Service',
      intro: 'These terms describe the general expectations for using the Campbell & Co. storefront, content, and administrative services.',
      sections: [
        {
          title: 'Use of the Site',
          body: 'Visitors may browse the storefront and request services for lawful personal or business purposes. Misuse, unauthorized access attempts, or interference with the platform is prohibited.',
        },
        {
          title: 'Product and Content Presentation',
          body: 'Campbell & Co. aims to present product details, imagery, availability, and guidance accurately, but offerings, pricing, and availability may change without notice.',
        },
        {
          title: 'Orders and Requests',
          body: 'Submitting a request or initiating checkout does not guarantee final acceptance. Orders, consultations, and operational actions may require confirmation, review, or follow-up communication.',
        },
        {
          title: 'Platform Governance',
          body: 'The application is maintained under LeeWay Standards for structured governance, technical continuity, and operational control. Administrative access is restricted to authorized users only.',
        },
      ]
    }
  },
  payments: {
    eyebrow: 'Payments',
    title: 'Flexible Ways To Acquire',
    body: 'Campbell & Co. can present a premium payment experience that supports immediate card checkout, monthly installment options, reserve deposits, and Bitcoin-style settlement without making the customer guess how the process works.',
    examplePrice: 4200,
    pathways: [
      {
        eyebrow: 'Pay In Full',
        title: 'Cards, Debit, and Wallet Checkout',
        body: 'Campbell & Co. can be prepared to accept major credit cards, debit cards, and wallet-based checkout for immediate authorization and secure capture.',
        bullets: ['Visa, Mastercard, Amex, and debit cards', 'Wallet-ready checkout such as Apple Pay and Google Pay', 'Fastest activation path for standard online payments'],
      },
      {
        eyebrow: 'Pay Over Time',
        title: 'Installments and Monthly Financing',
        body: 'For clients who want flexibility, the storefront can present monthly installment options at checkout and approval-based financing for higher-ticket pieces.',
        bullets: ['Clear disclosure language can live next to the product price and inside checkout'],
      },
      {
        eyebrow: 'Digital Assets',
        title: 'Bitcoin and Crypto Settlement',
        body: 'The storefront can also offer Bitcoin and selected digital asset settlement through a dedicated crypto payment partner for clients who prefer alternative payment rails.',
        bullets: ['Bitcoin-first presentation with room for additional approved assets', 'Manual or hosted payment link flow for private orders', 'Confirmation review before release or fulfillment'],
      },
    ],
    rolloutTitle: 'Launch in layers, not all at once.',
    rolloutBody: 'The cleanest rollout is usually cards and debit first, monthly installments second, reserve deposit flows third, and Bitcoin or crypto settlement after the core checkout is proven.',
    rolloutPhases: [
      'Phase 1: cards, debit, and wallet checkout',
      'Phase 2: installment messaging on product pages and in checkout',
      'Phase 3: private reserve deposit plans for higher-ticket orders',
      'Phase 4: Bitcoin and selected crypto by hosted payment link or direct settlement partner',
    ]
  },
  checkout: {
    detailsEyebrow: 'Acquisition Portal',
    detailsTitle: 'Review Details',
    paymentOptionsCaption: 'Select Payment Route',
    confirmationEyebrow: 'Transaction Verified',
    confirmationTitle: 'Registry Confirmed',
    confirmationBody: 'Your artifacts have been secured in our primary vault. A private acquisition officer will contact you within the hour to coordinate hand-delivery details.',
    confirmationCta: 'Return to the House',
    securityBadgeTitle: 'Encrypted Line Secured',
    securityBadgeBody: 'This transaction is protected by the House of Campbell Multi-Sig security protocol. Your data is purged immediately following registry verification.',
    agreementText: 'By authorizing this acquisition, you agree to the House of Campbell Charter, ensuring the legacy of these artifacts for a minimum of one generational cycle.',
  },
  theme: {
    primaryColor: '#D6B46A',
    headingFont: 'Playfair Display',
  },
  layout: {
    homepage: [
      { id: 'hero', enabled: true, order: 0 },
      { id: 'collections', enabled: true, order: 1 },
      { id: 'globalAcquisitions', enabled: true, order: 2 },
      { id: 'promo', enabled: true, order: 3 },
      { id: 'curatedSelection', enabled: true, order: 4 },
      { id: 'verification', enabled: true, order: 5 },
      { id: 'recentlyViewed', enabled: true, order: 6 },
      { id: 'trustBar', enabled: true, order: 7 },
    ]
  }
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
