/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SRC.HOOKS.USE_PAGE_ANALYTICS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = usePageAnalytics.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/hooks/usePageAnalytics.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackSiteEvent } from '../services/siteAnalytics';

export function usePageAnalytics() {
  const location = useLocation();

  useEffect(() => {
    void trackSiteEvent('page_view', {
      route: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);
}
