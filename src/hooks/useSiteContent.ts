/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=cpu

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CONTENT
TAG: CONTENT.SRC.HOOKS.USE_SITE_CONTENT.MAIN
DESCRIPTION: Loads and saves no-code editable storefront content
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = useSiteContent.ts — governed module
WHY = Share admin-managed site content with public storefront components
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/hooks/useSiteContent.ts
WHEN = 2026-05-08
HOW = Firestore backed when configured, local storage backed in demo mode

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { useEffect, useState, createContext, useContext } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  SITE_CONTENT_EVENT,
  SITE_CONTENT_STORAGE_KEY,
  SiteContent,
} from '../content/siteContent';
import { RuntimeAuthorityMode, RuntimeModeMetadata } from '../types';

export const SiteContentContext = createContext<{ content: SiteContent; loading: boolean } | null>(null);

const DRAFT_STORAGE_KEY = `${SITE_CONTENT_STORAGE_KEY}-draft`;

export function getRuntimeAuthorityMode(): RuntimeAuthorityMode {
  if (Boolean(db)) {
    return 'PRODUCTION_AUTHORITY';
  }
  
  const isLocalDev = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.port === '3000' ||
     localStorage.getItem('campbell-dev-mode') === 'true');
     
  if (isLocalDev) {
    return 'DEVELOPMENT_BOOTSTRAP';
  }
  
  const isStaticBootstrap = typeof window !== 'undefined' && 
    (window.location.pathname.startsWith('/shop') || 
     window.location.pathname.includes('/product/') ||
     window.location.pathname === '/' ||
     window.location.pathname === '/index.html');
     
  if (isStaticBootstrap) {
    return 'STATIC_BOOTSTRAP_CONTENT';
  }

  return 'CONFIGURATION_BLOCKED';
}

export const RUNTIME_METADATA: Record<RuntimeAuthorityMode, RuntimeModeMetadata> = {
  PRODUCTION_AUTHORITY: {
    id: 'runtime.authority.production',
    label: 'PRODUCTION_AUTHORITY — Firestore active — Publish enabled',
    tag: 'SYSTEM.RUNTIME.PRODUCTION',
    ownerAgent: 'Shield',
    authority: 'AdminOS',
    riskLevel: 'None',
    allowedEnvironment: 'production',
    publishPermission: true,
    persistenceSource: 'Firestore',
    tracePath: ['AdminOS', 'Firebase', 'Firestore', 'ProductionRegistry'],
    auditCategory: 'standards.production',
  },
  DEVELOPMENT_BOOTSTRAP: {
    id: 'runtime.authority.development-bootstrap',
    label: 'DEVELOPMENT_BOOTSTRAP — Local developer mode — Not production authority',
    tag: 'SYSTEM.RUNTIME.DEV_BOOTSTRAP',
    ownerAgent: 'Atlas',
    authority: 'AdminOS',
    riskLevel: 'Low',
    allowedEnvironment: 'development',
    publishPermission: true,
    persistenceSource: 'LocalStorage',
    tracePath: ['AdminOS', 'LocalStorage', 'StagingRegistry'],
    auditCategory: 'standards.development',
  },
  STATIC_BOOTSTRAP_CONTENT: {
    id: 'runtime.authority.static-bootstrap-content',
    label: 'STATIC_BOOTSTRAP_CONTENT — Build-time defaults — Not admin-authoritative',
    tag: 'SYSTEM.RUNTIME.STATIC_BOOTSTRAP',
    ownerAgent: 'Aura',
    authority: 'Static Defaults',
    riskLevel: 'Medium',
    allowedEnvironment: 'all',
    publishPermission: false,
    persistenceSource: 'Memory',
    tracePath: ['AdminOS', 'StaticDefaults', 'BuildTimeCatalog'],
    auditCategory: 'standards.static',
  },
  CONFIGURATION_BLOCKED: {
    id: 'runtime.authority.configuration-blocked',
    label: 'CONFIGURATION_BLOCKED — Firestore missing — Publish disabled',
    tag: 'SYSTEM.RUNTIME.BLOCKED',
    ownerAgent: 'Shield',
    authority: 'Blocked',
    riskLevel: 'High',
    allowedEnvironment: 'none',
    publishPermission: false,
    persistenceSource: 'None',
    tracePath: ['AdminOS', 'SecurityGuard', 'Blocker'],
    auditCategory: 'standards.security',
    missingConfigDetail: 'Firestore database instance is unconfigured and local dev-mode is inactive. Publishing is disabled.',
  }
};

function loadLocalContent(isDraft: boolean): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;

  try {
    const key = isDraft ? DRAFT_STORAGE_KEY : SITE_CONTENT_STORAGE_KEY;
    const stored = window.localStorage.getItem(key);
    return mergeSiteContent(DEFAULT_SITE_CONTENT, stored ? JSON.parse(stored) : null);
  } catch (error) {
    console.debug('Local site content unavailable', error);
    return DEFAULT_SITE_CONTENT;
  }
}

function storeLocalContent(content: SiteContent, isDraft: boolean) {
  const key = isDraft ? DRAFT_STORAGE_KEY : SITE_CONTENT_STORAGE_KEY;
  window.localStorage.setItem(key, JSON.stringify(content));
  if (!isDraft) {
    window.dispatchEvent(new CustomEvent(SITE_CONTENT_EVENT, { detail: content }));
  } else {
    window.dispatchEvent(new CustomEvent(SITE_CONTENT_EVENT + '-draft', { detail: content }));
  }
}

export const isFirebaseEnabled = Boolean(db);

export function useSiteContent() {
  const contextValue = useContext(SiteContentContext);
  if (contextValue) {
    return contextValue;
  }

  const mode = getRuntimeAuthorityMode();
  const [content, setContent] = useState<SiteContent>(() => {
    if (mode === 'CONFIGURATION_BLOCKED') {
      return DEFAULT_SITE_CONTENT;
    }
    return loadLocalContent(false);
  });
  const [loading, setLoading] = useState(mode === 'PRODUCTION_AUTHORITY');

  useEffect(() => {
    if (mode === 'CONFIGURATION_BLOCKED') {
      setContent(DEFAULT_SITE_CONTENT);
      setLoading(false);
      return;
    }

    if (mode !== 'PRODUCTION_AUTHORITY') {
      const handleUpdate = () => setContent(loadLocalContent(false));
      window.addEventListener(SITE_CONTENT_EVENT, handleUpdate);
      window.addEventListener('storage', handleUpdate);
      setLoading(false);
      return () => {
        window.removeEventListener(SITE_CONTENT_EVENT, handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      };
    }

    const unsubscribe = onSnapshot(
      doc(db!, 'homepage', 'config'),
      (snapshot) => {
        setContent(mergeSiteContent(DEFAULT_SITE_CONTENT, snapshot.exists() ? snapshot.data() : null));
        setLoading(false);
      },
      (error) => {
        console.error('Site content unavailable', error);
        setContent(loadLocalContent(false));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [mode]);

  return { content, loading };
}

export function useDraftSiteContent() {
  const mode = getRuntimeAuthorityMode();
  const [content, setContent] = useState<SiteContent>(() => {
    if (mode === 'CONFIGURATION_BLOCKED') {
      return DEFAULT_SITE_CONTENT;
    }
    return loadLocalContent(true);
  });
  const [loading, setLoading] = useState(mode === 'PRODUCTION_AUTHORITY');

  useEffect(() => {
    if (mode === 'CONFIGURATION_BLOCKED') {
      setContent(DEFAULT_SITE_CONTENT);
      setLoading(false);
      return;
    }

    if (mode !== 'PRODUCTION_AUTHORITY') {
      const handleUpdate = () => setContent(loadLocalContent(true));
      window.addEventListener(SITE_CONTENT_EVENT + '-draft', handleUpdate);
      window.addEventListener('storage', handleUpdate);
      setLoading(false);
      return () => {
        window.removeEventListener(SITE_CONTENT_EVENT + '-draft', handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      };
    }

    const unsubscribe = onSnapshot(
      doc(db!, 'homepage', 'draft_config'),
      (snapshot) => {
        if (snapshot.exists()) {
          setContent(mergeSiteContent(DEFAULT_SITE_CONTENT, snapshot.data()));
        } else {
          onSnapshot(doc(db!, 'homepage', 'config'), (pubSnap) => {
             setContent(mergeSiteContent(DEFAULT_SITE_CONTENT, pubSnap.exists() ? pubSnap.data() : null));
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Draft site content unavailable', error);
        setContent(loadLocalContent(true));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [mode]);

  return { content, loading };
}

export async function saveDraftContent(content: SiteContent) {
  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];
  if (!meta.publishPermission) {
    throw new Error(`Publish Blocked: Current mode ${mode} has no publish permission.`);
  }

  const nextContent = mergeSiteContent(DEFAULT_SITE_CONTENT, content);

  if (mode === 'DEVELOPMENT_BOOTSTRAP') {
    storeLocalContent(nextContent, true);
    return;
  }

  await setDoc(
    doc(db!, 'homepage', 'draft_config'),
    {
      ...nextContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function publishSiteContent(content: SiteContent) {
  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];
  if (!meta.publishPermission) {
    throw new Error(`Publish Blocked: Current mode ${mode} has no publish permission.`);
  }

  const nextContent = mergeSiteContent(DEFAULT_SITE_CONTENT, content);

  if (mode === 'DEVELOPMENT_BOOTSTRAP') {
    storeLocalContent(nextContent, false);
    storeLocalContent(nextContent, true);
    return;
  }

  await setDoc(
    doc(db!, 'homepage', 'config'),
    {
      ...nextContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await setDoc(
    doc(db!, 'homepage', 'draft_config'),
    {
      ...nextContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveSiteContent(content: SiteContent) {
  await publishSiteContent(content);
}

export function resetLocalSiteContent() {
  window.localStorage.removeItem(SITE_CONTENT_STORAGE_KEY);
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_EVENT));
}
