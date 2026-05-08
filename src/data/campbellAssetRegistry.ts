/*
LEEWAY HEADER — DO NOT REMOVE

REGION: DATA
TAG: DATA.SRC.DATA.CAMPBELL_ASSET_REGISTRY.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = campbellAssetRegistry.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/data/campbellAssetRegistry.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { Category, Gender } from '../types';
import { publicAssetUrl } from '../lib/publicPath';

type CategoryAssetKey =
  | 'women-rings'
  | 'men-rings'
  | 'women-chains'
  | 'men-chains'
  | 'women-pendants'
  | 'men-pendants'
  | 'women-bracelets'
  | 'men-bracelets'
  | 'stud-earrings'
  | 'loose-diamonds';

const ASSET_ROOT = '/assets/campbell/jewelry';

const RAW_CATEGORY_ASSETS: Record<CategoryAssetKey, string> = {
  'women-rings': `${ASSET_ROOT}/women-rings.png`,
  'men-rings': `${ASSET_ROOT}/men-rings.png`,
  'women-chains': `${ASSET_ROOT}/women-chains.png`,
  'men-chains': `${ASSET_ROOT}/men-chains.png`,
  'women-pendants': `${ASSET_ROOT}/women-pendants.png`,
  'men-pendants': `${ASSET_ROOT}/men-pendants.png`,
  'women-bracelets': `${ASSET_ROOT}/women-bracelets.png`,
  'men-bracelets': `${ASSET_ROOT}/men-bracelets.png`,
  'stud-earrings': `${ASSET_ROOT}/stud-earrings.png`,
  'loose-diamonds': `${ASSET_ROOT}/loose-diamonds.png`,
};

export const CATEGORY_ASSETS = Object.fromEntries(
  Object.entries(RAW_CATEGORY_ASSETS).map(([key, value]) => [key, publicAssetUrl(value)])
) as Record<CategoryAssetKey, string>;

const FALLBACK_CATEGORY_ASSETS: Partial<Record<CategoryAssetKey, string>> = {
  'women-pendants': `${ASSET_ROOT}/women-chains.png`,
  'men-pendants': `${ASSET_ROOT}/men-chains.png`,
};

export const DIAMOND_MACRO_IMAGE = publicAssetUrl(`${ASSET_ROOT}/diamond-macro.png`);

export function getCategoryAsset(gender: Gender, category: Category) {
  if (category === 'Stud Earrings') return CATEGORY_ASSETS['stud-earrings'];
  if (category === 'Loose Diamonds') return CATEGORY_ASSETS['loose-diamonds'];

  const normalizedGender = gender === 'men' ? 'men' : 'women';
  const categorySlug = category.toLowerCase().replace(' ', '-') as 'rings' | 'chains' | 'pendants' | 'bracelets';
  const key = `${normalizedGender}-${categorySlug}` as CategoryAssetKey;

  return publicAssetUrl(FALLBACK_CATEGORY_ASSETS[key] || CATEGORY_ASSETS[key]);
}

export function getExpectedCategoryAsset(gender: Gender, category: Category) {
  if (category === 'Stud Earrings') return CATEGORY_ASSETS['stud-earrings'];
  if (category === 'Loose Diamonds') return CATEGORY_ASSETS['loose-diamonds'];

  const normalizedGender = gender === 'men' ? 'men' : 'women';
  const categorySlug = category.toLowerCase().replace(' ', '-') as 'rings' | 'chains' | 'pendants' | 'bracelets';

  return publicAssetUrl(CATEGORY_ASSETS[`${normalizedGender}-${categorySlug}` as CategoryAssetKey]);
}
