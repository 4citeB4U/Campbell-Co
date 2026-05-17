# LeeWay AdminOS Final Handoff

## Architecture Overview

The Campbell & Co. AdminOS is a React-based application architected entirely under the LeeWay Governed Growth Doctrine. It is fundamentally split between the **Owner/AdminOS Interface** and the **Customer Storefront Projection**. 

### Public vs Admin Projection

The application uses a dual-routing strategy:
- The **Public Storefront** renders traditionally at `/` for standard visitors.
- The **AdminOS** mounts at `/admin` and operates as a unified command center. 
- The AdminOS embeds the public storefront internally using a `LivePublicPreview` (via `MemoryRouter`), allowing the owner to make draft CMS mutations and instantly visualize the impact on the client-facing website without altering the production database.

### Where Things Live

#### 1. Where Laws Live
- **`src/core/leeway/LeeWayLawSet.ts`**: The canonical registry of the 18 LeeWay laws.
- **`src/core/leeway/LeeWayAgentProposal.ts`**: The contract enforcing LAW-0005 (Proposal-Before-Mutation).
- **`.leeway/scripts/compliance-check.mjs`**: The CI/CD script that enforces these laws during builds.

#### 2. Where Registries Live
- **Agent Capabilities:** `src/core/leeway/LeeWayAgentCapabilityRegistry.ts` (Maps capabilities to Growth Lanes).
- **Skills:** `src/core/leeway/LeeWaySkillRegistry.ts` (Maps agent actions to laws).
- **Integrations/MCPs:** `src/core/leeway/LeeWayMCPRegistry.ts` (Maps external tool dependencies to truthful capability states).

#### 3. Where Agents Live
- **`src/components/admin/AdminAgents.tsx`**: The main interface for interacting with the AI workforce.
- Agent metadata and visual telemetry streams are governed by the registries above, producing proposals that the owner reviews directly via the UI.

#### 4. Where MCPs Live
- **`src/components/admin/AdminSettings.tsx`**: (MCP & Integrations Tab) Visually exposes the status of all configured or missing MCP connections.

---

## Developer Commands

### How to Run Quality Checks

1. **Type Checking:** 
   ```bash
   npm run lint
   ```
2. **Build Validation:**
   ```bash
   npm run build
   ```
3. **LeeWay Governance Audit:**
   ```bash
   npm run leeway:audit
   ```
   *Note: This command MUST return "✅ SYSTEM IS SOVEREIGN AND COMPLIANT" before pushing to production.*

### How to Deploy to GitHub Pages

1. Ensure the `package.json` contains the correct `"homepage": "/campbell-co-leeway-governed"` field.
2. Ensure you have run `npm install gh-pages -D` (if not already installed).
3. Execute the deployment command:
   ```bash
   npm run build:pages
   ```
   *(This script builds the app to `./dist` with relative paths mapped for GH pages, then pushes it to the `gh-pages` branch).*

### How to Validate Production Runtime

Once deployed to an environment without backend credentials (or on GitHub Pages), the system should automatically gracefully degrade to `STATIC_BOOTSTRAP_CONTENT` mode. 
1. Open the `/admin` URL.
2. Log in using the developer bypass/fallback.
3. Validate that the "Publish" button inside the **Publishing Console** is disabled.
4. Verify the red/amber alert banner is actively warning the user that production mutations are locked.
