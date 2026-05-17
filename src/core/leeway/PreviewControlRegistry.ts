/*
LEEWAY HEADER — DO NOT REMOVE

REGION: GOVERNANCE
TAG: GOVERNANCE.SRC.CORE.LEEWAY.PREVIEW_CONTROL_REGISTRY
ID: core.leeway.preview-control-registry
DESCRIPTION: Governance mapping registry linking public preview elements to administrative CMS control paths.
AUTHORITY: LeeWay-Standards
OWNER_AGENT: Lee Prime
TRACE_PATH: AdminOS → PreviewControlRegistry
AUDIT_CATEGORY: standards.validation
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = PreviewControlRegistry.ts — click-to-edit governance mapping
WHY = Map public elements to specific administrative inputs and panels
WHO = Lee Prime
WHERE = src/core/leeway/PreviewControlRegistry.ts
WHEN = 2026-05-17
HOW = Static binding registry imported by LivePreviewPanel and AdminOS inspector

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type PreviewControlBinding = {
  leewayId: string;
  label: string;
  ownerAgent: "Lee Prime" | "Nova" | "Atlas" | "Shield" | "Aura";
  publicComponent: string;
  schemaPath?: string;
  productPath?: string;
  adminModule: string;
  adminPanel: string;
  auditCategory: string;
  editableFields: Array<{
    fieldId: string;
    label: string;
    schemaPath: string;
    inputType: "text" | "textarea" | "image" | "link" | "select" | "array" | "richText" | "number" | "boolean";
  }>;
};

export const PREVIEW_CONTROL_REGISTRY: PreviewControlBinding[] = [
  {
    leewayId: "public.header",
    label: "Global Storefront Header",
    ownerAgent: "Lee Prime",
    publicComponent: "src/components/Header.tsx",
    schemaPath: "header",
    adminModule: "site-control",
    adminPanel: "identity",
    auditCategory: "standards.header",
    editableFields: [
      { fieldId: "searchPlaceholder", label: "Search Input Placeholder", schemaPath: "header.searchPlaceholder", inputType: "text" },
      { fieldId: "mobileConciergeTitle", label: "Mobile Concierge Title", schemaPath: "header.mobileConciergeTitle", inputType: "text" },
      { fieldId: "mobileConciergeBody", label: "Mobile Concierge Body", schemaPath: "header.mobileConciergeBody", inputType: "textarea" },
      { fieldId: "conciergeGreeting", label: "AI Concierge Welcome Greeting", schemaPath: "header.conciergeGreeting", inputType: "textarea" }
    ]
  },
  {
    leewayId: "public.home.hero",
    label: "Homepage Hero Banner",
    ownerAgent: "Aura",
    publicComponent: "src/components/Hero.tsx",
    schemaPath: "home.hero",
    adminModule: "site-control",
    adminPanel: "hero",
    auditCategory: "standards.hero",
    editableFields: [
      { fieldId: "eyebrow", label: "Eyebrow Statement", schemaPath: "home.hero.eyebrow", inputType: "text" },
      { fieldId: "titleLineOne", label: "Headline (Line One)", schemaPath: "home.hero.titleLineOne", inputType: "text" },
      { fieldId: "titleLineTwo", label: "Headline (Line Two - Italic)", schemaPath: "home.hero.titleLineTwo", inputType: "text" },
      { fieldId: "body", label: "Hero Body Narrative", schemaPath: "home.hero.body", inputType: "textarea" },
      { fieldId: "primaryCtaLabel", label: "Primary CTA Label", schemaPath: "home.hero.primaryCta.label", inputType: "text" },
      { fieldId: "primaryCtaPath", label: "Primary CTA Path Link", schemaPath: "home.hero.primaryCta.path", inputType: "text" },
      { fieldId: "secondaryCtaLabel", label: "Secondary CTA Label", schemaPath: "home.hero.secondaryCta.label", inputType: "text" },
      { fieldId: "secondaryCtaPath", label: "Secondary CTA Path Link", schemaPath: "home.hero.secondaryCta.path", inputType: "text" },
      { fieldId: "image", label: "Featured Image Source Path", schemaPath: "home.hero.image", inputType: "image" },
      { fieldId: "imageAlt", label: "Featured Image Alt Text", schemaPath: "home.hero.imageAlt", inputType: "text" },
      { fieldId: "videoUrl", label: "Cinematic Video Source Path", schemaPath: "home.hero.videoUrl", inputType: "text" },
      { fieldId: "featureTitle", label: "Floating Badge Title", schemaPath: "home.hero.featureTitle", inputType: "text" },
      { fieldId: "featureSubtitle", label: "Floating Badge Subtitle", schemaPath: "home.hero.featureSubtitle", inputType: "text" },
      { fieldId: "priceEyebrow", label: "Pricing Subtitle", schemaPath: "home.hero.priceEyebrow", inputType: "text" },
      { fieldId: "priceText", label: "Pricing Label Value", schemaPath: "home.hero.priceText", inputType: "text" }
    ]
  },
  {
    leewayId: "public.home.collections",
    label: "Homepage Collections Split",
    ownerAgent: "Aura",
    publicComponent: "src/components/CollectionSplit.tsx",
    schemaPath: "home.collections",
    adminModule: "site-control",
    adminPanel: "collections",
    auditCategory: "standards.collections",
    editableFields: [
      { fieldId: "womenTitle", label: "Women Collection Title", schemaPath: "home.collections.women.title", inputType: "text" },
      { fieldId: "womenEyebrow", label: "Women Collection Eyebrow", schemaPath: "home.collections.women.eyebrow", inputType: "text" },
      { fieldId: "womenBody", label: "Women Collection Copy", schemaPath: "home.collections.women.body", inputType: "textarea" },
      { fieldId: "womenImage", label: "Women Collection Background Image", schemaPath: "home.collections.women.image", inputType: "image" },
      { fieldId: "menTitle", label: "Men Collection Title", schemaPath: "home.collections.men.title", inputType: "text" },
      { fieldId: "menEyebrow", label: "Men Collection Eyebrow", schemaPath: "home.collections.men.eyebrow", inputType: "text" },
      { fieldId: "menBody", label: "Men Collection Copy", schemaPath: "home.collections.men.body", inputType: "textarea" },
      { fieldId: "menImage", label: "Men Collection Background Image", schemaPath: "home.collections.men.image", inputType: "image" }
    ]
  },
  {
    leewayId: "public.home.promo",
    label: "Storefront Promotional Split",
    ownerAgent: "Aura",
    publicComponent: "src/components/PromoPanel.tsx",
    schemaPath: "home.promo",
    adminModule: "site-control",
    adminPanel: "promo",
    auditCategory: "standards.promo",
    editableFields: [
      { fieldId: "promoTitle", label: "Featured Promo Title", schemaPath: "home.promo.feature.title", inputType: "text" },
      { fieldId: "promoBody", label: "Featured Promo Copy", schemaPath: "home.promo.feature.body", inputType: "textarea" },
      { fieldId: "promoImage", label: "Promo Backdrop Image Path", schemaPath: "home.promo.feature.image", inputType: "image" },
      { fieldId: "popularStylesTitle", label: "Style Matrix Header Title", schemaPath: "home.promo.popularStylesTitle", inputType: "text" },
      { fieldId: "appointmentTitle", label: "Consultation Call Title", schemaPath: "home.promo.appointment.title", inputType: "text" },
      { fieldId: "appointmentBody", label: "Consultation Call Description", schemaPath: "home.promo.appointment.body", inputType: "textarea" }
    ]
  },
  {
    leewayId: "public.home.verification",
    label: "Ethical Sourcing Verification",
    ownerAgent: "Shield",
    publicComponent: "src/components/VerificationSection.tsx",
    schemaPath: "verification",
    adminModule: "site-control",
    adminPanel: "verification",
    auditCategory: "standards.verification",
    editableFields: [
      { fieldId: "eyebrow", label: "Verification Section Eyebrow", schemaPath: "verification.eyebrow", inputType: "text" },
      { fieldId: "title", label: "Verification Section Title", schemaPath: "verification.title", inputType: "text" },
      { fieldId: "body", label: "Ethical Sourcing Statement", schemaPath: "verification.body", inputType: "textarea" },
      { fieldId: "naturalTitle", label: "Natural Diamond Headline", schemaPath: "verification.naturalTitle", inputType: "text" },
      { fieldId: "labTitle", label: "Lab-Grown Diamond Headline", schemaPath: "verification.labTitle", inputType: "text" },
      { fieldId: "advantageTitle", label: "Blockchain Advantage Headline", schemaPath: "verification.advantageTitle", inputType: "text" },
      { fieldId: "advantageBody", label: "Blockchain Advantage Copy", schemaPath: "verification.advantageBody", inputType: "textarea" }
    ]
  },
  {
    leewayId: "public.home.trust",
    label: "Sovereign Trust Bar",
    ownerAgent: "Shield",
    publicComponent: "src/components/TrustBar.tsx",
    schemaPath: "trustBar",
    adminModule: "site-control",
    adminPanel: "trust",
    auditCategory: "standards.trust",
    editableFields: [
      { fieldId: "label", label: "Trust Bar Anchor Title", schemaPath: "trustBar.label", inputType: "text" },
      { fieldId: "established", label: "Brand Founding Year Mark", schemaPath: "trustBar.established", inputType: "text" }
    ]
  },
  {
    leewayId: "public.footer",
    label: "Global Storefront Footer",
    ownerAgent: "Lee Prime",
    publicComponent: "src/components/Footer.tsx",
    schemaPath: "footer",
    adminModule: "site-control",
    adminPanel: "footer",
    auditCategory: "standards.footer",
    editableFields: [
      { fieldId: "brandStatement", label: "Brand Legacy Statement", schemaPath: "footer.brandStatement", inputType: "textarea" },
      { fieldId: "newsletterTitle", label: "Newsletter Capture Header", schemaPath: "footer.newsletterTitle", inputType: "text" },
      { fieldId: "newsletterBody", label: "Newsletter Capture Subtitle", schemaPath: "footer.newsletterBody", inputType: "textarea" },
      { fieldId: "copyright", label: "Sovereign Copyright Notice", schemaPath: "footer.copyright", inputType: "text" }
    ]
  },
  {
    leewayId: "public.diamonds.guide",
    label: "Diamond Sourcing Guide",
    ownerAgent: "Atlas",
    publicComponent: "src/components/DiamondGuide.tsx",
    schemaPath: "diamondGuide",
    adminModule: "site-control",
    adminPanel: "guide",
    auditCategory: "standards.guide",
    editableFields: [
      { fieldId: "title", label: "Education Guide Title", schemaPath: "diamondGuide.title", inputType: "text" },
      { fieldId: "subtitle", label: "Education Guide Subtitle", schemaPath: "diamondGuide.subtitle", inputType: "text" },
      { fieldId: "description", label: "Diamond Philosophy Copy", schemaPath: "diamondGuide.description", inputType: "textarea" }
    ]
  },
  {
    leewayId: "public.payments.overview",
    label: "Sovereign Payment Pathways",
    ownerAgent: "Shield",
    publicComponent: "src/apps/CustomerSite.tsx#PaymentOptionsPage",
    schemaPath: "payments",
    adminModule: "site-control",
    adminPanel: "payments",
    auditCategory: "standards.payments",
    editableFields: [
      { fieldId: "title", label: "Payment Overview Title", schemaPath: "payments.title", inputType: "text" },
      { fieldId: "body", label: "Payment Overview Copy", schemaPath: "payments.body", inputType: "textarea" },
      { fieldId: "rolloutTitle", label: "Expansion Rollout Title", schemaPath: "payments.rolloutTitle", inputType: "text" },
      { fieldId: "rolloutBody", label: "Expansion Rollout Copy", schemaPath: "payments.rolloutBody", inputType: "textarea" }
    ]
  },
  {
    leewayId: "public.checkout.portal",
    label: "Secure Acquisition Checkout",
    ownerAgent: "Shield",
    publicComponent: "src/components/Checkout.tsx",
    schemaPath: "checkout",
    adminModule: "site-control",
    adminPanel: "checkout",
    auditCategory: "standards.checkout",
    editableFields: [
      { fieldId: "detailsTitle", label: "Checkout Form Headline", schemaPath: "checkout.detailsTitle", inputType: "text" },
      { fieldId: "paymentOptionsCaption", label: "Installment Terms Caption", schemaPath: "checkout.paymentOptionsCaption", inputType: "text" },
      { fieldId: "confirmationTitle", label: "Acquisition Clear Title", schemaPath: "checkout.confirmationTitle", inputType: "text" },
      { fieldId: "confirmationBody", label: "Acquisition Next Steps Copy", schemaPath: "checkout.confirmationBody", inputType: "textarea" },
      { fieldId: "securityBadgeTitle", label: "Compliance Shield Header", schemaPath: "checkout.securityBadgeTitle", inputType: "text" },
      { fieldId: "securityBadgeBody", label: "Compliance Shield Copy", schemaPath: "checkout.securityBadgeBody", inputType: "textarea" },
      { fieldId: "agreementText", label: "Client Purchase Contract Text", schemaPath: "checkout.agreementText", inputType: "textarea" }
    ]
  }
];

export function getBindingForLeewayId(id: string): PreviewControlBinding | undefined {
  return PREVIEW_CONTROL_REGISTRY.find(binding => binding.leewayId === id);
}
