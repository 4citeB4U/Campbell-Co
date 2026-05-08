/*
LEEWAY HEADER — DO NOT REMOVE

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
import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  SITE_CONTENT_EVENT,
  SITE_CONTENT_STORAGE_KEY,
  SiteContent,
} from '../content/siteContent';

function loadLocalContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;

  try {
    const stored = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    return mergeSiteContent(DEFAULT_SITE_CONTENT, stored ? JSON.parse(stored) : null);
  } catch (error) {
    console.debug('Local site content unavailable', error);
    return DEFAULT_SITE_CONTENT;
  }
}

function storeLocalContent(content: SiteContent) {
  window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_EVENT, { detail: content }));
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(() => loadLocalContent());
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) {
      const handleUpdate = () => setContent(loadLocalContent());
      window.addEventListener(SITE_CONTENT_EVENT, handleUpdate);
      window.addEventListener('storage', handleUpdate);
      setLoading(false);
      return () => {
        window.removeEventListener(SITE_CONTENT_EVENT, handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      };
    }

    const unsubscribe = onSnapshot(
      doc(db, 'homepage', 'config'),
      (snapshot) => {
        setContent(mergeSiteContent(DEFAULT_SITE_CONTENT, snapshot.exists() ? snapshot.data() : null));
        setLoading(false);
      },
      (error) => {
        console.error('Site content unavailable', error);
        setContent(loadLocalContent());
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { content, loading };
}

export async function saveSiteContent(content: SiteContent) {
  const nextContent = mergeSiteContent(DEFAULT_SITE_CONTENT, content);

  if (!db) {
    storeLocalContent(nextContent);
    return;
  }

  await setDoc(
    doc(db, 'homepage', 'config'),
    {
      ...nextContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function resetLocalSiteContent() {
  window.localStorage.removeItem(SITE_CONTENT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_EVENT));
}
