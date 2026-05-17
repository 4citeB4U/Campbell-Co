/*
LEEWAY HEADER — DO NOT REMOVE

REGION: GOVERNANCE
TAG: GOVERNANCE.SRC.CORE.LEEWAY.REGISTRY
ID: core.leeway.governance-registry
DESCRIPTION: Central registry of governed modules and components.
AUTHORITY: LeeWay-Standards
OWNER_AGENT: Lee Prime
TRACE_PATH: AdminOS → GovernanceRegistry
AUDIT_CATEGORY: standards.validation
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = GovernanceRegistry.ts — central governance registry
WHY = Provide runtime discoverability of governed units
WHO = Lee Prime
WHERE = src/core/leeway/GovernanceRegistry.ts
WHEN = 2026-05-16
HOW = Singleton registry used by useLeeWayID and compliance tools

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type GovernedUnit = {
  id: string;
  label: string;
  tag: string;
  region: "CORE" | "ADMIN" | "PUBLIC" | "CONTENT" | "AGENT" | "GOVERNANCE" | "DATA" | "HOOK" | "LIB";
  ownerAgent: "Lee Prime" | "Nova" | "Atlas" | "Shield" | "Aura";
  authority: string;
  filePath?: string;
  route?: string;
  schemaPath?: string;
  adminControlPath?: string;
  publicRenderPath?: string;
  tracePath: string[];
  auditCategory?: string;
  status: "active" | "draft" | "deprecated" | "needs-review";
  hardCoded: boolean;
};

class GovernanceRegistryService {
  private registry = new Map<string, GovernedUnit>();

  register(unit: GovernedUnit) {
    this.registry.set(unit.id, unit);
  }

  get(id: string): GovernedUnit | undefined {
    return this.registry.get(id);
  }

  getAll(): GovernedUnit[] {
    return Array.from(this.registry.values());
  }

  getAuditCategories(): string[] {
    const categories = new Set<string>();
    this.registry.forEach(unit => {
      if (unit.auditCategory) categories.add(unit.auditCategory);
    });
    return Array.from(categories);
  }
}

export const GovernanceRegistry = new GovernanceRegistryService();
