/*
LEEWAY HEADER — DO NOT REMOVE

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
TAG: UI.SRC.COMPONENTS.TRUST_BAR.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = TrustBar.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/TrustBar.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { useSiteContent } from '../hooks/useSiteContent';
import { useLeeWayID } from '../hooks/useLeeWayID';

export default function TrustBar() {
  useLeeWayID({
    id: 'public.home.trustBar',
    label: 'Trust Assurance Bar',
    tag: 'UI.PUBLIC.HOME.TRUST',
    region: 'PUBLIC',
    ownerAgent: 'Aura',
    authority: 'AdminOS',
    tracePath: ['AdminOS', 'SiteContent', 'Published', 'CustomerSite', 'TrustBar'],
    auditCategory: 'content.publish',
    status: 'active',
    hardCoded: false,
  });

  const { content } = useSiteContent();

  return (
    <section 
      className="bg-black-soft border-t border-gray-border py-6 px-12"
      data-leeway-id="public.home.trustBar"
      data-leeway-tag="UI.PUBLIC.HOME.TRUST"
      data-owner-agent="Aura"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="text-[9px] uppercase tracking-[0.4em] font-bold text-gold">
          {content.trustBar.label}
        </div>
        
        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {content.trustBar.points.map((point) => (
            <div key={point} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_rgba(214,180,106,0.6)]"></div>
              <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-white/50">{point}</span>
            </div>
          ))}
        </div>

        <div className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/30 hidden lg:block">
          {content.trustBar.established}
        </div>
      </div>
    </section>
  );
}
