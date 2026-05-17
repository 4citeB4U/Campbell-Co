# Campbell & Co. - LeeWay AdminOS

Welcome to the Campbell & Co. AdminOS. This application is fundamentally split between the **Owner/AdminOS Interface** and the **Customer Storefront Projection**. This document serves as the complete Owner's Manual and architectural guide to help you manage the storefront, your AI workforce, and all underlying system settings.

## 1. Opening the AdminOS
When running locally, navigate to `http://localhost:3000/admin.html`. Once authenticated, you will arrive at the **Dashboard** which serves as the core command interface.

## 2. Changing Colors and Theme
- Navigate to **Vault Settings** (using the sidebar gear icon).
- Open the **Experience Theme** tab.
- Click on the `Primary Color` or `Accent Color` swatches. Any selection made here instantly syncs across the admin interface and the public website preview.

## 3. Using Live Preview & Editing Homepage Sections
- The right side of the AdminOS screen contains the **Live Storefront Preview**. 
- You can navigate the preview website just like a customer.
- **To edit a section:** Click directly on a highlighted block of text or a button within the preview. 
- A panel will open allowing you to edit the draft text. Your edits are immediately visible in the preview, but are **not live to the public yet**.

## 4. Asking Agents for Help & Reviewing Proposals
- Open the **AI Workforce** section from the sidebar.
- Select an Agent (e.g., *Agent Lee Prime*, *Aura Media Agent*).
- Under the agent's active recommendations, click the **"Preview Proposal"** button.
- **Reviewing the Proposal:** A modal will appear. It clearly details exactly what the agent wants to change (before/after values), the reason, and the risk level. **No changes happen until you approve.**
- **Apply to Draft:** Click this to accept the agent's proposal. The changes will populate the Live Preview.
- **Reject:** Click this if you do not want the agent to make the change.

## 5. Publishing to the Live Site
- Whenever you make manual draft edits or accept an agent's proposal, those changes are stored locally.
- To make them public, go to the **Publishing Console** from the sidebar.
- Review the comparison of your draft against the live site.
- If everything looks correct, click **Commit to Production**.

## 6. Inspecting System Health (Agents & MCPs)
- **Agent Health:** Inside the **AI Workforce** tab, select an agent to see their live telemetry feed, designated skills, and current operational mode.
- **MCP/Tool Health:** Inside **Vault Settings**, click the **MCP & Integrations** tab. Here you will see all third-party services (e.g., Stripe, GitHub) and whether they are active (Green), missing configuration (Amber), or blocked (Red).

## 7. Understanding Growth Lanes
Inside **Vault Settings**, view the **Growth Lanes** tab to see what you are authorized to change safely:
- 🟢 **Green Lane:** Safe, unlocked customization (copywriting, themes).
- 🟡 **Yellow Lane:** Requires adding new API keys or expanding the system (adding new AI models).
- 🔴 **Red Lane:** Locked core-system changes to protect against security risks.

## 8. What to do if something is blocked
If you see an action is blocked, check the **Runtime Authority** banner at the top of the PIM/Registry or Publishing screen. If it says "Setup Required" or "Read-Only Mode", your developer needs to configure your secure `.env` database credentials before you can proceed.

---

## Architecture & Where Things Live

### Public vs Admin Projection
The application uses a dual-routing strategy:
- The **Public Storefront** renders traditionally at `http://localhost:3000/` for standard visitors.
- The **AdminOS** mounts at `http://localhost:3000/admin.html` and operates as a unified command center. 
- The AdminOS embeds the public storefront internally using a `LivePublicPreview` (via `MemoryRouter`), allowing the owner to make draft CMS mutations and instantly visualize the impact on the client-facing website without altering the production database.

### Core Architecture
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

### Installation & Run
```bash
npm install
npm run dev
```

### Quality Checks
1. **Type Checking:** `npm run lint`
2. **Build Validation:** `npm run build`
3. **LeeWay Governance Audit:** `npm run leeway:audit` (Must return "✅ SYSTEM IS SOVEREIGN AND COMPLIANT" before pushing to production.)

### Deployment
To deploy to GitHub pages, execute:
```bash
npm run build:pages
```
*(This script builds the app to `./dist` with relative paths mapped for GH pages, then pushes it to the `gh-pages` branch).*
