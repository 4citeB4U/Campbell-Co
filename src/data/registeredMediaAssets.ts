/*
LEEWAY HEADER - DO NOT REMOVE

REGION: DATA
TAG: DATA.SRC.DATA.REGISTERED_MEDIA_ASSETS.MAIN
DESCRIPTION: Governed registry of reusable media assets available for AdminOS selected-area agent actions.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = registeredMediaAssets.ts - governed media registry
WHY = Provide stable, auditable media asset options for selected-area agent proposals
WHO = LeeWay Innovations
WHERE = src/data/registeredMediaAssets.ts
WHEN = 2026-05-17
HOW = Static registry of approved public assets and their descriptive metadata

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export type RegisteredMediaAsset = {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  altText: string;
  caption?: string;
  storageAuthority: 'public-assets';
  owner: string;
  usagePermissions: string[];
};

export const REGISTERED_MEDIA_ASSETS: RegisteredMediaAsset[] = [
  {
    id: 'media.hero.diamond-macro',
    title: 'Diamond Macro Hero',
    type: 'image',
    url: '/assets/campbell/jewelry/diamond-macro.png',
    altText: 'Close-up Campbell & Co. diamond with bright reflective facets.',
    caption: 'Luxury diamond macro used for premium hero storytelling.',
    storageAuthority: 'public-assets',
    owner: 'Aura',
    usagePermissions: ['public.home.hero', 'public.home.promo'],
  },
  {
    id: 'media.editorial.women-collection',
    title: 'Women Collection Editorial',
    type: 'image',
    url: '/assets/campbell/editorial/women-collection.png',
    altText: 'Editorial Campbell & Co. women collection jewelry styling image.',
    caption: 'Editorial still suited for homepage storytelling and feature panels.',
    storageAuthority: 'public-assets',
    owner: 'Aura',
    usagePermissions: ['public.home.hero', 'public.home.collections', 'public.home.promo'],
  },
  {
    id: 'media.editorial.men-collection',
    title: 'Men Collection Editorial',
    type: 'image',
    url: '/assets/campbell/editorial/men-collection.png',
    altText: 'Editorial Campbell & Co. men collection jewelry styling image.',
    caption: 'Editorial still for masculine luxury campaigns.',
    storageAuthority: 'public-assets',
    owner: 'Aura',
    usagePermissions: ['public.home.hero', 'public.home.collections', 'public.home.promo'],
  },
  {
    id: 'media.video.brand-loop',
    title: 'Brand Loop Video',
    type: 'video',
    url: '/assets/campbell/editorial/brand-loop.mp4',
    altText: 'Short cinematic Campbell & Co. luxury brand loop video.',
    caption: 'Brand motion loop for supported hero or promo regions.',
    storageAuthority: 'public-assets',
    owner: 'Aura',
    usagePermissions: ['public.home.hero', 'public.home.collections', 'public.home.promo'],
  },
  {
    id: 'media.editorial.alt-missing',
    title: 'Alt Missing Editorial',
    type: 'image',
    url: '/assets/campbell/editorial/men-collection.png',
    altText: '',
    caption: 'Intentional no-alt asset used to verify governed alt text handling.',
    storageAuthority: 'public-assets',
    owner: 'Aura',
    usagePermissions: ['public.home.hero', 'public.home.collections', 'public.home.promo'],
  },
];

export function getRegisteredMediaAssetById(id: string) {
  return REGISTERED_MEDIA_ASSETS.find((asset) => asset.id === id);
}
