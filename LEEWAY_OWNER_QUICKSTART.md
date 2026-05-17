# LeeWay Owner Quickstart — Avion Campbell

Welcome to the Campbell & Co. AdminOS. This command center gives you, the owner, complete sovereign control over the storefront, your AI workforce, and all underlying system settings.

## 1. Opening the AdminOS
Navigate to `/admin` on your deployed application URL. Once authenticated, you will arrive at the **Dashboard** which serves as the core command interface.

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
