/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FFD700
FLUO=#FFEA00
PASTEL=#FFF9C4

ICON_ASCII:
family=lucide
glyph=wrench

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.SRC.LIB.PUBLIC_PATH.MAIN
DESCRIPTION: GitHub Pages safe URL helpers for public assets and HTML entries
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = publicPath.ts — governed module
WHY = Keep storefront assets and admin links working under Vite base paths
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/lib/publicPath.ts
WHEN = 2026-05-08
HOW = Prefix same-origin absolute URLs with import.meta.env.BASE_URL

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
const basePath = import.meta.env.BASE_URL || '/';

export function publicUrl(path: string) {
  if (!path) return path;
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;

  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${normalizedBase}${normalizedPath}`;
}

export function publicAssetUrl(path: string) {
  return path.startsWith('/assets/') ? publicUrl(path) : path;
}
