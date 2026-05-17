/*
LEEWAY HEADER - DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FF3131
FLUO=#FF5757
PASTEL=#FF9191

ICON_ASCII:
family=lucide
glyph=layout

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_CMS.MAIN
DESCRIPTION: Universal Site Control Command Center (Full Coverage)
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = AdminCMS.tsx - 100% full site control workspace
WHY = Give the owner absolute power over every text, image, and setting on the public storefront
WHO = Leeway Innovations
WHERE = src/components/admin/AdminCMS.tsx
WHEN = 2026-05-16
HOW = React + Recursive Inspector + Interactive Preview Cards

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Monitor, 
  Save, 
  Smartphone, 
  Sparkles, 
  Type, 
  Video, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Layout, 
  Layers, 
  Search, 
  Footprints, 
  ShieldCheck, 
  HelpCircle, 
  BookOpen, 
  Palette,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquare,
  Lock
} from 'lucide-react';
import { Diamond } from 'lucide-react';
import { motion } from 'motion/react';
import { LeeWayHelpTrigger } from './LeeWayHelpTrigger';
import { SiteContent } from '../../content/siteContent';
import { saveSiteContent, useSiteContent } from '../../hooks/useSiteContent';

type EditorSectionId = 
  | 'identity'
  | 'hero' 
  | 'collections'
  | 'promo' 
  | 'verification'
  | 'trust'
  | 'footer' 
  | 'pages'
  | 'legal'
  | 'payments'
  | 'checkout'
  | 'guide'
  | 'theme'
  | 'layout';

type EditorField = {
  label: string;
  path: string;
  kind?: 'text' | 'textarea' | 'color' | 'select' | 'image' | 'array' | 'link';
  options?: Array<{ label: string; value: string }>;
  itemFields?: EditorField[]; // For arrays of objects
};

type EditorSection = {
  id: EditorSectionId;
  name: string;
  icon: any;
  summary: string;
  fields: EditorField[];
};

const SECTIONS: EditorSection[] = [
  {
    id: 'identity',
    name: 'Site Identity',
    icon: Search,
    summary: 'Global header settings, search behavior, and top trust benefits.',
    fields: [
      { label: 'Header Benefits', path: 'header.benefits', kind: 'array' },
      { label: 'Search Placeholder', path: 'header.searchPlaceholder' },
      { label: 'Concierge Title (Mobile)', path: 'header.mobileConciergeTitle' },
      { label: 'Concierge Body (Mobile)', path: 'header.mobileConciergeBody', kind: 'textarea' },
      { label: 'Concierge CTA', path: 'header.mobileConciergeCta', kind: 'link' },
      { label: 'AI Concierge Greeting', path: 'header.conciergeGreeting', kind: 'textarea' },
    ],
  },
  {
    id: 'guide',
    name: 'Diamond Guide',
    icon: Diamond,
    summary: 'The educational core of the site. Manage stone quality points and available types.',
    fields: [
      { label: 'Title', path: 'diamondGuide.title' },
      { label: 'Subtitle', path: 'diamondGuide.subtitle' },
      { label: 'Description', path: 'diamondGuide.description', kind: 'textarea' },
      { 
        label: 'Quality Guide', 
        path: 'diamondGuide.qualityGuide', 
        kind: 'array',
        itemFields: [
          { label: 'Label', path: 'label' },
          { label: 'Sub-label', path: 'sub' },
          { label: 'Description', path: 'desc', kind: 'textarea' },
          { label: 'Icon Path', path: 'icon', kind: 'image' },
        ]
      },
      { 
        label: 'Stone Types', 
        path: 'diamondGuide.stoneTypes', 
        kind: 'array',
        itemFields: [
          { label: 'Name', path: 'name' },
          { label: 'Description', path: 'desc', kind: 'textarea' },
          { label: 'CTA Label', path: 'shop' },
          { label: 'Icon Path', path: 'icon', kind: 'image' },
        ]
      },
    ],
  },
  {
    id: 'hero',
    name: 'Hero Banner',
    icon: Layout,
    summary: 'The massive headline and cinematic media at the very top of the storefront.',
    fields: [
      { label: 'Eyebrow', path: 'home.hero.eyebrow' },
      { label: 'Title Line One', path: 'home.hero.titleLineOne' },
      { label: 'Title Line Two', path: 'home.hero.titleLineTwo' },
      { label: 'Body Statement', path: 'home.hero.body', kind: 'textarea' },
      { label: 'Primary CTA', path: 'home.hero.primaryCta', kind: 'link' },
      { label: 'Secondary CTA', path: 'home.hero.secondaryCta', kind: 'link' },
      {
        label: 'Media Type',
        path: 'home.hero.mediaType',
        kind: 'select',
        options: [
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
        ],
      },
      { label: 'Image Source', path: 'home.hero.image', kind: 'image' },
      { label: 'Video Source URL', path: 'home.hero.videoUrl' },
      { label: 'Feature Badge Title', path: 'home.hero.featureTitle' },
      { label: 'Feature Badge Subtitle', path: 'home.hero.featureSubtitle' },
      { label: 'Price Label', path: 'home.hero.priceEyebrow' },
      { label: 'Price Value', path: 'home.hero.priceText' },
      { label: 'Scroll Prompt', path: 'home.hero.scrollText' },
    ],
  },
  {
    id: 'collections',
    name: 'Collections',
    icon: Layers,
    summary: 'High-level entrance stories for the primary collection tiers.',
    fields: [
      { label: 'Women Title', path: 'home.collections.women.title' },
      { label: 'Women Eyebrow', path: 'home.collections.women.eyebrow' },
      { label: 'Women Story', path: 'home.collections.women.body', kind: 'textarea' },
      { label: 'Women Image', path: 'home.collections.women.image', kind: 'image' },
      { label: 'Women CTA', path: 'home.collections.women.cta', kind: 'link' },
      { label: 'Men Title', path: 'home.collections.men.title' },
      { label: 'Men Eyebrow', path: 'home.collections.men.eyebrow' },
      { label: 'Men Story', path: 'home.collections.men.body', kind: 'textarea' },
      { label: 'Men Image', path: 'home.collections.men.image', kind: 'image' },
      { label: 'Men CTA', path: 'home.collections.men.cta', kind: 'link' },
    ],
  },
  {
    id: 'promo',
    name: 'Promotions',
    icon: Sparkles,
    summary: 'Secondary features, popular quick-links, and the expert guide prompt.',
    fields: [
      { label: 'Promo Title', path: 'home.promo.feature.title' },
      { label: 'Promo Body', path: 'home.promo.feature.body', kind: 'textarea' },
      { label: 'Promo CTA', path: 'home.promo.feature.cta', kind: 'link' },
      { label: 'Promo Image', path: 'home.promo.feature.image', kind: 'image' },
      { label: 'Popular Styles Title', path: 'home.promo.popularStylesTitle' },
      { 
        label: 'Popular Style Items', 
        path: 'home.promo.popularStyles', 
        kind: 'array',
        itemFields: [
          { label: 'Label', path: 'label' },
          { label: 'Path', path: 'path' },
          { label: 'Image', path: 'image', kind: 'image' },
        ]
      },
      { label: 'Appointment Title', path: 'home.promo.appointment.title' },
      { label: 'Appointment Body', path: 'home.promo.appointment.body', kind: 'textarea' },
      { label: 'Appointment CTA', path: 'home.promo.appointment.cta', kind: 'link' },
    ],
  },
  {
    id: 'verification',
    name: 'Verification',
    icon: ShieldCheck,
    summary: 'The Movement: Transparency, ethical sourcing, and certification details.',
    fields: [
      { label: 'Eyebrow', path: 'verification.eyebrow' },
      { label: 'Title', path: 'verification.title' },
      { label: 'Main Body', path: 'verification.body', kind: 'textarea' },
      { label: 'Natural Title', path: 'verification.naturalTitle' },
      { label: 'Natural Bullets', path: 'verification.naturalBullets', kind: 'array' },
      { label: 'Lab Title', path: 'verification.labTitle' },
      { label: 'Lab Bullets', path: 'verification.labBullets', kind: 'array' },
      { label: 'Advantage Title', path: 'verification.advantageTitle' },
      { label: 'Advantage Body', path: 'verification.advantageBody', kind: 'textarea' },
      { 
        label: 'Proof Points', 
        path: 'verification.proofPoints', 
        kind: 'array',
        itemFields: [
          { label: 'Value', path: 'value' },
          { label: 'Label', path: 'label' },
        ]
      },
    ],
  },
  {
    id: 'trust',
    name: 'Trust Bar',
    icon: Footprints,
    summary: 'Sticky trust layer showing credentials and established status.',
    fields: [
      { label: 'Bar Label', path: 'trustBar.label' },
      { label: 'Trust Points', path: 'trustBar.points', kind: 'array' },
      { label: 'Established Date', path: 'trustBar.established' },
    ],
  },
  {
    id: 'footer',
    name: 'Global Footer',
    icon: Type,
    summary: 'Final brand statement, newsletter, and trust badges at the bottom.',
    fields: [
      { label: 'Brand Statement', path: 'footer.brandStatement', kind: 'textarea' },
      { label: 'Newsletter Title', path: 'footer.newsletterTitle' },
      { label: 'Newsletter Body', path: 'footer.newsletterBody', kind: 'textarea' },
      { label: 'Copyright Notice', path: 'footer.copyright' },
      { 
        label: 'Trust Badges', 
        path: 'footer.badges', 
        kind: 'array',
        itemFields: [
          { label: 'Title', path: 'title' },
          { label: 'Body', path: 'body', kind: 'textarea' },
        ]
      },
    ],
  },
  {
    id: 'pages',
    name: 'Other Pages',
    icon: BookOpen,
    summary: 'Deep-level content for About, FAQ, Contact, and Journal.',
    fields: [
      { label: 'About Title', path: 'pages.about.title' },
      { label: 'About Body', path: 'pages.about.body', kind: 'textarea' },
      { 
        label: 'FAQ Items', 
        path: 'pages.faq.questions', 
        kind: 'array',
        itemFields: [
          { label: 'Question', path: 'question' },
          { label: 'Answer', path: 'answer', kind: 'textarea' },
        ]
      },
      { label: 'Contact Title', path: 'pages.contact.title' },
      { label: 'Contact CTA', path: 'pages.contact.primaryCta', kind: 'link' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    icon: ShieldCheck,
    summary: 'Manage privacy policy and terms of service.',
    fields: [
      { label: 'Privacy Title', path: 'legal.privacy.title' },
      { label: 'Privacy Intro', path: 'legal.privacy.intro', kind: 'textarea' },
      { 
        label: 'Privacy Sections', 
        path: 'legal.privacy.sections', 
        kind: 'array',
        itemFields: [
          { label: 'Title', path: 'title' },
          { label: 'Body', path: 'body', kind: 'textarea' },
        ]
      },
      { label: 'Terms Title', path: 'legal.terms.title' },
      { label: 'Terms Intro', path: 'legal.terms.intro', kind: 'textarea' },
      { 
        label: 'Terms Sections', 
        path: 'legal.terms.sections', 
        kind: 'array',
        itemFields: [
          { label: 'Title', path: 'title' },
          { label: 'Body', path: 'body', kind: 'textarea' },
        ]
      },
    ],
  },
  {
    id: 'payments',
    name: 'Payment Methods',
    icon: Sparkles,
    summary: 'Manage flexible payment options and rollout strategies.',
    fields: [
      { label: 'Title', path: 'payments.title' },
      { label: 'Body', path: 'payments.body', kind: 'textarea' },
      { 
        label: 'Payment Pathways', 
        path: 'payments.pathways', 
        kind: 'array',
        itemFields: [
          { label: 'Eyebrow', path: 'eyebrow' },
          { label: 'Title', path: 'title' },
          { label: 'Body', path: 'body', kind: 'textarea' },
        ]
      },
      { label: 'Rollout Title', path: 'payments.rolloutTitle' },
      { label: 'Rollout Body', path: 'payments.rolloutBody', kind: 'textarea' },
    ],
  },
  {
    id: 'checkout',
    name: 'Checkout Flow',
    icon: Lock,
    summary: 'Configure the secure acquisition portal messaging.',
    fields: [
      { label: 'Details Title', path: 'checkout.detailsTitle' },
      { label: 'Payment Options Caption', path: 'checkout.paymentOptionsCaption' },
      { label: 'Confirmation Title', path: 'checkout.confirmationTitle' },
      { label: 'Confirmation Body', path: 'checkout.confirmationBody', kind: 'textarea' },
      { label: 'Security Badge Title', path: 'checkout.securityBadgeTitle' },
      { label: 'Security Badge Body', path: 'checkout.securityBadgeBody', kind: 'textarea' },
      { label: 'Agreement Text', path: 'checkout.agreementText', kind: 'textarea' },
    ],
  },
  {
    id: 'theme',
    name: 'Brand Theme',
    icon: Palette,
    summary: 'Primary accent color and heading font used across the public storefront.',
    fields: [
      { label: 'Primary Accent Color', path: 'theme.primaryColor', kind: 'color' },
      {
        label: 'Heading Font Family',
        path: 'theme.headingFont',
        kind: 'select',
        options: [
          { label: 'Playfair Display', value: 'Playfair Display' },
          { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
          { label: 'Cinzel', value: 'Cinzel' },
          { label: 'Outfit', value: 'Outfit' },
          { label: 'Inter', value: 'Inter' },
        ],
      },
    ],
  },
  {
    id: 'layout',
    name: 'Layout Structure',
    icon: Layout,
    summary: 'Control section visibility and ordering for the public storefront.',
    fields: [
      {
        label: 'Homepage Sections',
        path: 'layout.homepage',
        kind: 'array',
        itemFields: [
          { label: 'Section ID', path: 'id' },
          { label: 'Enabled (true/false)', path: 'enabled' },
          { label: 'Display Order', path: 'order' },
        ]
      }
    ]
  }
];

import { useLeeWayID } from '../../hooks/useLeeWayID';

import { saveDraftContent, publishSiteContent, useDraftSiteContent, isFirebaseEnabled, getRuntimeAuthorityMode, RUNTIME_METADATA } from '../../hooks/useSiteContent';

export function AdminCMS({
  sharedDraft,
  onChangeDraft,
  initialSection = 'hero'
}: {
  sharedDraft?: SiteContent | null;
  onChangeDraft?: (d: SiteContent) => void;
  initialSection?: EditorSectionId;
} = {}) {
  useLeeWayID({
    id: 'admin.os.site-control',
    label: 'Visual Site Manager',
    tag: 'ADMIN.OS.SITE_CONTROL',
    region: 'ADMIN',
    ownerAgent: 'Lee Prime',
    authority: 'AdminOS',
    tracePath: ['AdminOS', 'SiteContent', 'Draft'],
    auditCategory: 'content.edit',
    status: 'active',
    hardCoded: false,
  });
  
  const { content, loading } = useDraftSiteContent();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [selectedSection, setSelectedSection] = useState<EditorSectionId>(initialSection);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialSection) {
      setSelectedSection(initialSection);
    }
  }, [initialSection]);

  useEffect(() => {
    if (sharedDraft) {
      setDraft(sharedDraft);
    } else if (content && !draft) {
      setDraft(JSON.parse(JSON.stringify(content)));
    }
  }, [sharedDraft, content, draft]);

  const activeSection = useMemo(
    () => SECTIONS.find((section) => section.id === selectedSection) || SECTIONS[1],
    [selectedSection]
  );

  const updateDraft = (path: string, value: any) => {
    const activeDraft = draft || sharedDraft;
    if (!activeDraft) return;

    const next = JSON.parse(JSON.stringify(activeDraft));
    const keys = path.split('.');
    let current: any = next;

    keys.slice(0, -1).forEach((key) => {
      current = current[key];
    });

    current[keys[keys.length - 1]] = value;
    setDraft(next);
    if (onChangeDraft) {
      onChangeDraft(next);
    }
    setHasChanges(true);
    setStatus('UNPUBLISHED DRAFT');
  };

  const syncDraft = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await saveDraftContent(draft);
      setStatus('DRAFT SAVED');
      window.setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus('SAVE FAILED');
    } finally {
      setSaving(false);
    }
  };

  const publishChanges = async () => {
    if (!draft) return;
    setSaving(true);

    try {
      await publishSiteContent(draft);
      setHasChanges(false);
      setStatus('LIVE ON STOREFRONT');
      window.setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus('PUBLISH FAILED');
    } finally {
      setSaving(false);
    }
  };

  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];

  const renderRuntimeBanner = () => {
    switch (mode) {
      case 'PRODUCTION_AUTHORITY':
        return (
          <div className="rounded-[1.5rem] bg-stone-900 border border-amber-500/30 p-6 mb-8 flex items-start gap-5 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-[300px] h-full bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08)_0%,transparent_75%)] pointer-events-none" />
            <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl border border-amber-500/20">
              <ShieldCheck size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">PRODUCTION_AUTHORITY — FIRESTORE ACTIVE</h3>
                <span className="text-[8px] bg-green-500/10 text-green-500 border border-green-500/25 px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Publish Enabled</span>
              </div>
              <p className="text-[11px] text-stone-300 max-w-4xl tracking-wide leading-relaxed">
                The storefront is operating with full <strong>Sovereign Production Authority</strong>. All edits modify the draft schema and publish live transactions in real-time.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-stone-400 font-black">
                <span>ID: <span className="text-amber-500">{meta.id}</span></span>
                <span>Agent: <span className="text-amber-500">{meta.ownerAgent}</span></span>
                <span>Risk: <span className="text-amber-500">{meta.riskLevel}</span></span>
                <span>Trace: <span className="text-amber-500">{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span className="text-amber-500">{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
      case 'DEVELOPMENT_BOOTSTRAP':
        return (
          <div className="rounded-[1.5rem] bg-amber-50 border border-amber-200 p-6 mb-8 flex items-start gap-5 shadow-md text-left">
            <div className="bg-amber-100 text-amber-700 p-3 rounded-xl border border-amber-200">
              <Sparkles size={24} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-amber-900">DEVELOPMENT_BOOTSTRAP — LOCAL DEVELOPER MODE</h3>
                <span className="text-[8px] bg-amber-600/10 text-amber-700 border border-amber-600/20 px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Staging Sandbox</span>
              </div>
              <p className="text-[11px] text-amber-800 max-w-4xl leading-relaxed">
                Running in local developer staging mode. Edits save to localStorage keys (<code className="bg-amber-100/50 px-1 rounded">campbell-site-content-draft</code>). <strong>Visibly NOT production authority.</strong>
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-amber-900/60 font-black">
                <span>ID: <span>{meta.id}</span></span>
                <span>Agent: <span>{meta.ownerAgent}</span></span>
                <span>Risk: <span>{meta.riskLevel}</span></span>
                <span>Trace: <span>{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span>{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
      case 'STATIC_BOOTSTRAP_CONTENT':
        return (
          <div className="rounded-[1.5rem] bg-stone-50 border border-stone-200 p-6 mb-8 flex items-start gap-5 shadow-sm text-left">
            <div className="bg-stone-200 text-stone-600 p-3 rounded-xl">
              <Monitor size={24} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-stone-800">STATIC_BOOTSTRAP_CONTENT — BUILD-TIME DEFAULTS</h3>
                <span className="text-[8px] bg-stone-600/10 text-stone-600 border border-stone-600/20 px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Publish Disabled</span>
              </div>
              <p className="text-[11px] text-stone-600 max-w-4xl leading-relaxed">
                Rendered with build-time static default constants. No dynamic authority is active. Edits and publishing are disabled.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-stone-600/60 font-black">
                <span>ID: <span>{meta.id}</span></span>
                <span>Agent: <span>{meta.ownerAgent}</span></span>
                <span>Risk: <span>{meta.riskLevel}</span></span>
                <span>Trace: <span>{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span>{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
      case 'CONFIGURATION_BLOCKED':
      default:
        return (
          <div className="rounded-[1.5rem] bg-rose-50 border border-rose-200 p-6 mb-8 flex items-start gap-5 shadow-lg text-left">
            <div className="bg-rose-100 text-rose-700 p-3 rounded-xl border border-rose-200">
              <Lock size={24} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-rose-900">CONFIGURATION_BLOCKED — CRITICAL SECURITY INTERCEPT</h3>
                <span className="text-[8px] bg-rose-600 text-white px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Publish Disabled</span>
              </div>
              <p className="text-[11px] text-rose-800 max-w-4xl leading-relaxed font-bold">
                {meta.missingConfigDetail} The system refuses to pretend to have dynamic database authority. Publish and Draft modifications are strictly disabled.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-rose-900/60 font-black">
                <span>ID: <span>{meta.id}</span></span>
                <span>Agent: <span>{meta.ownerAgent}</span></span>
                <span>Risk: <span>{meta.riskLevel}</span></span>
                <span>Trace: <span>{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span>{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading || !draft) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div id="admin-cms-root" className="space-y-8 pb-32">
      {renderRuntimeBanner()}
      <div className="rounded-[2.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <span className="text-[10px] uppercase tracking-[1em] text-amber-700 font-black">Absolute Control</span>
               <div className="h-px w-12 bg-stone-200" />
            </div>
            <h2 className="text-4xl font-serif uppercase tracking-[0.12em] text-stone-900">Visual Site Manager</h2>
            <p className="max-w-3xl text-[11px] uppercase tracking-widest leading-loose text-stone-500 font-bold opacity-60">
              Complete authority over storefront narrative, aesthetics, and trust layers. Changes reflect in the preview below instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-full border border-stone-200 bg-stone-50 p-1.5 flex gap-1 shadow-inner">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all flex items-center gap-3 ${
                  previewMode === 'desktop' ? 'bg-white text-stone-900 shadow-sm border border-stone-100' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Monitor size={14} />
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all flex items-center gap-3 ${
                  previewMode === 'mobile' ? 'bg-white text-stone-900 shadow-sm border border-stone-100' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Smartphone size={14} />
                Mobile
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={syncDraft}
                disabled={saving || !meta.publishPermission}
                className={`rounded-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 bg-stone-100 text-stone-900 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Save size={14} />
                Save Draft
              </button>
              <LeeWayHelpTrigger helpId="help.action.saveDraft" />
            </div>

            <div className="space-y-2">
              <button
                onClick={publishChanges}
                disabled={saving || !hasChanges || !meta.publishPermission}
                className={`rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all transform active:scale-95 flex items-center gap-4 disabled:opacity-40 disabled:cursor-not-allowed ${
                  hasChanges && meta.publishPermission ? 'bg-amber-600 text-white shadow-lg hover:bg-stone-900' : 'bg-stone-100 text-stone-400'
                }`}
              >
                <Sparkles size={14} />
                {saving ? 'Synchronizing...' : 'Publish Live'}
              </button>
              <LeeWayHelpTrigger helpId="help.action.publishLive" />
            </div>
          </div>
        </div>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 rounded-[1.5rem] border px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-between ${
              status === 'PUBLISH FAILED' ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            <span>{status}</span>
            {hasChanges && <span className="opacity-50">Local Buffer Only</span>}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="space-y-6">
          <div className="flex items-center justify-between px-6">
             <div className="flex flex-col gap-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Preview Workspace</h3>
                <p className="text-[11px] font-bold text-stone-900 uppercase tracking-widest">Real-time narrative synchronization</p>
             </div>
             <span className="px-4 py-1.5 rounded-full bg-stone-900 text-white text-[9px] font-black uppercase tracking-widest shadow-xl">
               {previewMode} ACTIVE
             </span>
          </div>

          <div className="rounded-[3rem] bg-[#fdfaf5] border border-stone-200/60 p-6 md:p-10 shadow-inner">
            <div className={`mx-auto overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-2xl transition-all duration-700 ${previewMode === 'mobile' ? 'max-w-[400px]' : 'max-w-full'}`}>
              <div className="border-b border-stone-100 px-8 py-5 flex items-center justify-between bg-stone-50/50">
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-900">CAMPBELL &amp; CO.</p>
                   <p className="text-[8px] uppercase tracking-widest text-stone-400 font-bold italic">Draft Environment</p>
                </div>
                <div className="flex gap-2.5">
                   {[1,2,3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-stone-200" />)}
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-8 overflow-y-auto max-h-[800px] custom-scrollbar">
                {/* Visual Preview of Sections */}
                {selectedSection === 'identity' && (
                  <PreviewBlock title="Global Identity">
                     <div className="flex flex-col gap-6">
                        <div className="flex gap-3">
                           {draft.header.benefits.map(b => (
                             <span key={b} className="text-[8px] uppercase tracking-widest px-2 py-1 bg-stone-50 border border-stone-100 rounded-sm font-bold text-stone-400">{b}</span>
                           ))}
                        </div>
                        <div className="h-12 border border-stone-100 flex items-center px-4 rounded-sm bg-stone-50/30 text-[9px] tracking-widest text-stone-300 font-bold">
                           {draft.header.searchPlaceholder}
                        </div>
                     </div>
                  </PreviewBlock>
                )}

                {selectedSection === 'hero' && (
                  <PreviewBlock title="Hero Presentation">
                     <div className="relative aspect-video rounded-xl bg-stone-900 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 opacity-40">
                           {draft.home.hero.mediaType === 'image' ? (
                             <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                                <ImageIcon size={40} className="text-stone-600" />
                             </div>
                           ) : (
                             <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                                <Video size={40} className="text-stone-600" />
                             </div>
                           )}
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                           <p className="text-[8px] uppercase tracking-[0.4em] text-amber-500 font-black">{draft.home.hero.eyebrow}</p>
                           <h4 className="text-2xl font-serif text-white uppercase leading-none" style={{ fontFamily: draft.theme.headingFont }}>
                              {draft.home.hero.titleLineOne} <br/> {draft.home.hero.titleLineTwo}
                           </h4>
                           <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest max-w-[80%]">{draft.home.hero.body.substring(0, 100)}...</p>
                        </div>
                     </div>
                  </PreviewBlock>
                )}

                {selectedSection === 'collections' && (
                   <div className="grid grid-cols-2 gap-4">
                      <PreviewBlock title="Women">
                         <div className="h-32 bg-stone-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            <ImageIcon size={20} className="text-stone-300" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">{draft.home.collections.women.title}</p>
                      </PreviewBlock>
                      <PreviewBlock title="Men">
                         <div className="h-32 bg-stone-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            <ImageIcon size={20} className="text-stone-300" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">{draft.home.collections.men.title}</p>
                      </PreviewBlock>
                   </div>
                )}

                {selectedSection === 'promo' && (
                  <div className="space-y-6">
                    <PreviewBlock title="Featured Promo">
                       <div className="relative aspect-[4/5] rounded-xl bg-stone-900 overflow-hidden group">
                          <div className="absolute inset-0 bg-black/40 z-10" />
                          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 z-20 space-y-4 text-left">
                             <h4 className="text-xl font-serif text-white uppercase tracking-widest">{draft.home.promo.feature.title}</h4>
                             <p className="text-[9px] text-white/60 font-bold uppercase tracking-widest leading-loose max-w-[180px]">{draft.home.promo.feature.body}</p>
                             <div className="px-4 py-2 bg-amber-600 text-white text-[8px] font-black uppercase tracking-widest">{draft.home.promo.feature.cta.label}</div>
                          </div>
                       </div>
                    </PreviewBlock>
                    <PreviewBlock title="Quick Navigation">
                       <div className="grid grid-cols-3 gap-3">
                          {draft.home.promo.popularStyles.map((item: any, i: number) => (
                            <div key={i} className="aspect-square bg-stone-100 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                               <div className="h-10 w-10 bg-white rounded-full mb-2 flex items-center justify-center text-stone-300">
                                  <ImageIcon size={14} />
                               </div>
                               <span className="text-[7px] font-black uppercase tracking-widest text-stone-600">{item.label}</span>
                            </div>
                          ))}
                       </div>
                    </PreviewBlock>
                  </div>
                )}

                {selectedSection === 'verification' && (
                  <div className="space-y-6">
                    <PreviewBlock title="The Movement">
                       <div className="text-center space-y-4">
                          <p className="text-[8px] uppercase tracking-[0.4em] text-amber-600 font-black">{draft.verification.eyebrow}</p>
                          <h4 className="text-xl font-serif text-stone-900 uppercase tracking-widest">{draft.verification.title}</h4>
                          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest leading-loose">{draft.verification.body.substring(0, 100)}...</p>
                       </div>
                    </PreviewBlock>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 border border-stone-100 rounded-xl bg-stone-50/30">
                          <h5 className="text-[9px] font-black uppercase tracking-widest mb-3">{draft.verification.naturalTitle}</h5>
                          {draft.verification.naturalBullets.slice(0, 3).map((b: string) => (
                            <div key={b} className="flex items-center gap-2 mb-1.5">
                               <div className="h-1 w-1 bg-amber-600 rounded-full" />
                               <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">{b}</span>
                            </div>
                          ))}
                       </div>
                       <div className="p-4 border border-stone-100 rounded-xl bg-stone-50/30">
                          <h5 className="text-[9px] font-black uppercase tracking-widest mb-3">{draft.verification.labTitle}</h5>
                          {draft.verification.labBullets.slice(0, 3).map((b: string) => (
                            <div key={b} className="flex items-center gap-2 mb-1.5">
                               <div className="h-1 w-1 bg-stone-300 rounded-full" />
                               <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">{b}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {selectedSection === 'trust' && (
                  <PreviewBlock title="Sticky Trust Layer">
                     <div className="flex flex-col items-center gap-4 py-4">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-amber-700">{draft.trustBar.label}</span>
                        <div className="flex gap-4">
                           {draft.trustBar.points.map((p: string) => (
                             <span key={p} className="text-[7px] font-bold uppercase tracking-widest text-stone-400">/ {p}</span>
                           ))}
                        </div>
                        <span className="text-[7px] font-bold uppercase tracking-widest text-stone-300">{draft.trustBar.established}</span>
                     </div>
                  </PreviewBlock>
                )}

                {selectedSection === 'footer' && (
                  <div className="space-y-6">
                    <PreviewBlock title="Brand Message">
                       <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest leading-loose text-center">{draft.footer.brandStatement}</p>
                    </PreviewBlock>
                    <PreviewBlock title="Trust Badges">
                       <div className="grid grid-cols-2 gap-4">
                          {draft.footer.badges.slice(0, 4).map((b: any) => (
                            <div key={b.title} className="p-3 bg-stone-50 rounded-lg">
                               <h6 className="text-[8px] font-black uppercase tracking-widest mb-1 text-stone-900">{b.title}</h6>
                               <p className="text-[7px] text-stone-400 font-bold uppercase tracking-widest">{b.body.substring(0, 30)}...</p>
                            </div>
                          ))}
                       </div>
                    </PreviewBlock>
                  </div>
                )}

                {selectedSection === 'guide' && (
                  <div className="space-y-6">
                    <PreviewBlock title="Educational Masterpiece">
                       <div className="text-center space-y-4">
                          <h4 className="text-xl font-serif text-stone-900 uppercase tracking-widest">{draft.diamondGuide.title}</h4>
                          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest leading-loose">{draft.diamondGuide.description.substring(0, 100)}...</p>
                       </div>
                    </PreviewBlock>
                    <div className="grid grid-cols-2 gap-4">
                       {draft.diamondGuide.qualityGuide.slice(0, 2).map((item: any) => (
                         <div key={item.label} className="p-4 border border-stone-100 rounded-xl bg-stone-50/30 text-center">
                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-700">{item.label}</span>
                            <div className="text-xs font-serif uppercase tracking-widest my-1">{item.sub}</div>
                            <p className="text-[7px] text-stone-400 font-bold uppercase tracking-widest">{item.desc}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {selectedSection === 'pages' && (
                  <PreviewBlock title="Knowledge Depth">
                     <div className="space-y-6">
                        <div className="text-center">
                           <h4 className="text-xl font-serif text-stone-900 uppercase tracking-widest">{draft.pages.faq.title}</h4>
                        </div>
                        <div className="space-y-3">
                           {draft.pages.faq.questions.slice(0, 2).map((q: any) => (
                             <div key={q.question} className="p-4 border border-stone-100 rounded-xl bg-stone-50/20">
                                <p className="text-[9px] font-black uppercase tracking-widest text-amber-700 mb-1">{q.question}</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">{q.answer.substring(0, 60)}...</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </PreviewBlock>
                )}

                {selectedSection === 'theme' && (
                  <PreviewBlock title="Aesthetic Engine">
                     <div className="flex items-center gap-8 py-6">
                        <div className="h-16 w-16 rounded-[1.5rem] shadow-xl border-4 border-white" style={{ backgroundColor: draft.theme.primaryColor }} />
                        <div className="flex flex-col gap-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Typographic Anchor</p>
                           <p className="text-2xl uppercase tracking-widest text-stone-900" style={{ fontFamily: draft.theme.headingFont }}>{draft.theme.headingFont}</p>
                        </div>
                     </div>
                  </PreviewBlock>
                )}

                {selectedSection === 'layout' && (
                  <PreviewBlock title="Homepage Section Order">
                     <div className="space-y-3">
                        {[...draft.layout.homepage].sort((a, b) => a.order - b.order).map((section: any) => (
                           <div key={section.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-xl bg-stone-50/50">
                              <div className="flex items-center gap-4">
                                 <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest w-8">#{section.order}</div>
                                 <div className="text-[9px] font-black uppercase tracking-widest text-stone-900">{section.id}</div>
                              </div>
                              <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${section.enabled ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'}`}>
                                 {section.enabled ? 'VISIBLE' : 'HIDDEN'}
                              </div>
                           </div>
                        ))}
                     </div>
                  </PreviewBlock>
                )}

                {/* Simplified Card for other sections when not focused */}
                <div className="space-y-4">
                   {SECTIONS.filter(s => s.id !== selectedSection).map(section => (
                     <button 
                       key={section.id} 
                       onClick={() => setSelectedSection(section.id)}
                       className="w-full flex items-center justify-between p-6 border border-stone-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-all text-left group"
                     >
                        <div className="flex items-center gap-5">
                           <div className="h-10 w-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-white group-hover:text-amber-600 group-hover:shadow-sm transition-all">
                              <section.icon size={18} />
                           </div>
                           <div className="flex flex-col gap-1">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">{section.name}</h5>
                              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Click to refine section</p>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-stone-300" />
                     </button>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
           <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg">
                    <activeSection.icon size={22} />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Inspector</h3>
                    <h4 className="text-xl font-serif uppercase tracking-[0.1em] text-stone-900">{activeSection.name}</h4>
                 </div>
              </div>

              <div className="space-y-6 max-h-[1000px] overflow-y-auto custom-scrollbar pr-2 pb-6">
                {activeSection.fields.map((field) => (
                  <FieldEditor
                    key={field.path}
                    field={field}
                    value={getValue(draft, field.path)}
                    onChange={(value) => updateDraft(field.path, value)}
                  />
                ))}
              </div>
           </div>

           <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900 mb-6">Section Navigator</h3>
              <div className="grid grid-cols-1 gap-2">
                 {SECTIONS.map(s => (
                   <button 
                     key={s.id}
                     onClick={() => setSelectedSection(s.id)}
                     className={`flex items-center gap-4 p-4 rounded-xl transition-all border ${
                       selectedSection === s.id 
                        ? 'bg-stone-900 border-stone-900 text-white' 
                        : 'bg-stone-50 border-stone-100 text-stone-500 hover:bg-white hover:border-amber-200 hover:text-stone-900'
                     }`}
                   >
                      <s.icon size={16} />
                      <span className="text-[9px] font-black uppercase tracking-[0.25em]">{s.name}</span>
                   </button>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

function PreviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-stone-100" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-300">{title}</span>
          <div className="h-px flex-1 bg-stone-100" />
       </div>
       <div className="rounded-2xl border border-stone-50 bg-stone-50/20 p-4">
          {children}
       </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: EditorField;
  value: any;
  onChange: (value: any) => void;
}) {
  const label = (
    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-stone-400 group-hover:text-amber-700 transition-colors">
      {field.label}
    </span>
  );

  if (field.kind === 'array') {
    const items = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-4 border-l-2 border-stone-100 pl-6 py-2">
        <div className="flex items-center justify-between">
          {label}
          <button 
            onClick={() => {
              const newItem = field.itemFields 
                ? Object.fromEntries(field.itemFields.map(f => [f.path, ''])) 
                : '';
              onChange([...items, newItem]);
            }}
            className="p-2 rounded-lg bg-stone-50 text-stone-400 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="relative group/item bg-stone-50/50 rounded-xl p-4 border border-stone-100">
               <button 
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 p-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-stone-300 hover:text-red-500"
               >
                  <Trash2 size={12} />
               </button>
               {field.itemFields ? (
                 <div className="space-y-4 pt-2">
                    {field.itemFields.map(f => (
                      <FieldEditor 
                        key={f.path} 
                        field={f} 
                        value={item[f.path]} 
                        onChange={(v) => {
                          const next = [...items];
                          next[index] = { ...item, [f.path]: v };
                          onChange(next);
                        }}
                      />
                    ))}
                 </div>
               ) : (
                 <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = e.target.value;
                    onChange(next);
                  }}
                  className="w-full bg-transparent text-[11px] font-bold uppercase tracking-widest text-stone-700 outline-none"
                 />
               )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (field.kind === 'link') {
    return (
      <div className="space-y-4 bg-stone-50/30 p-4 rounded-xl border border-stone-100">
        <div className="flex items-center gap-3">
           <LinkIcon size={14} className="text-stone-300" />
           {label}
        </div>
        <div className="grid grid-cols-1 gap-3">
           <input 
            type="text" 
            placeholder="LABEL"
            value={value?.label || ''} 
            onChange={(e) => onChange({ ...value, label: e.target.value })}
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-amber-400"
           />
           <input 
            type="text" 
            placeholder="PATH (/shop, mailto:...)"
            value={value?.path || ''} 
            onChange={(e) => onChange({ ...value, path: e.target.value })}
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-[10px] font-mono tracking-widest outline-none focus:border-amber-400"
           />
        </div>
      </div>
    );
  }

  if (field.kind === 'image') {
     return (
       <div className="space-y-3 group">
          {label}
          <div className="flex gap-4">
             <div className="h-12 w-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden border border-stone-200">
                {value ? <img src={value} className="w-full h-full object-cover grayscale" /> : <ImageIcon size={18} className="text-stone-300" />}
             </div>
             <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-[10px] font-mono text-stone-600 outline-none transition focus:border-amber-300 focus:bg-white"
                placeholder="/assets/..."
             />
          </div>
       </div>
     )
  }

  if (field.kind === 'textarea') {
    return (
      <label className="block space-y-3 group">
        {label}
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-[11px] font-bold leading-loose text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white uppercase tracking-widest"
        />
      </label>
    );
  }

  if (field.kind === 'select') {
    return (
      <label className="block space-y-3 group">
        {label}
        <div className="relative">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full appearance-none rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-stone-400">
             <ChevronDown size={14} />
          </div>
        </div>
      </label>
    );
  }

  if (field.kind === 'color') {
    return (
      <label className="block space-y-3 group">
        {label}
        <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
          <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-14 rounded-lg border-0 bg-transparent cursor-pointer" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="flex-1 bg-transparent text-[11px] font-mono text-stone-700 outline-none uppercase"
          />
        </div>
      </label>
    );
  }

  return (
    <label className="block space-y-3 group">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white"
      />
    </label>
  );
}

function ChevronDown({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function getValue(source: any, path: string) {
  if (!source) return '';
  return path.split('.').reduce<any>((current, key) => current?.[key], source);
}
