# Campbell & Co. AdminOS Release Notes

**Version:** 1.0.0 (Sovereign Handoff Release)
**Date:** 2026-05-17

## Major Features Completed

- **AdminOS Visual Command Center:** A unified, fully governed administrative interface designed for the non-technical owner (Avion), prioritizing transparency, authority, and aesthetic alignment with the Campbell & Co. brand.
- **Live Public Preview:** A persistent, interactive preview of the public storefront running within the AdminOS. Allows the owner to visually inspect and edit draft content without leaving the workspace.
- **Product Registry Sovereignty:** Full lifecycle control over product staging, editing, and publishing. Integrates smoothly with the Live Public Preview to ensure draft products are verified visually prior to deployment.
- **Runtime Authority Modes:** System intelligently classifies operational modes (`PRODUCTION_AUTHORITY`, `DEVELOPMENT_BOOTSTRAP`, `STATIC_BOOTSTRAP_CONTENT`). Ensures safe mutation boundaries by disabling production publishing until connected to live databases.
- **LeeWay Laws (1-18):** Full adherence to the 18 LeeWay architectural laws enforcing sovereign intelligence, transparency, traceability, and truthful capability degradation across all layers of the codebase.
- **Governed Agent Proposals (LAW-0005):** Completely eliminated silent AI mutations. All agent tasks now generate a `LeeWayAgentProposal` for explicit human review, outlining before/after states, telemetry, and exact law references.
- **MCP Visual Registry:** Dedicated control panel exposing live status (`MCP_CONNECTED`, `MCP_BLOCKED_BY_DEFAULT`, `MCP_CONFIGURATION_MISSING`) of all local integrations. Honest communication of system capabilities without faux simulations.
- **Owner Settings & Growth Lanes:** Interactive dashboard defining current capabilities categorized into Green, Yellow, and Red lanes (LAW-0017). Allows Avion to safely guide system expansion within auditable paths.

## Compliance Status

- **System Governance:** 100% compliant with the `leeway:audit` Sovereign Checker.
- **Files Scanned:** 68/68 perfectly traced and formatted.
- **Owner Acceptance:** 🟢 READY. All workflows pass human-readability standards.

## Known Limitations & Exceptions

- **Browser MCP Blocked By Default:** Browser automation is actively blocked by default to prevent unregulated DOM execution. Explicit developer unlock and Puppeteer credentials are required to use testing flows (`EXC-002`).
- **GitHub Workflow Disabled:** Requires a valid `GH_TOKEN` securely injected into the `.env.local` file to execute CI/CD workflows and automated repository updates (`EXC-001`).
- **Media Upload Pending Configuration:** Direct cloud image uploads via the Media Library tab are currently pending final integration with a configured Cloudinary/Firebase storage bucket (`EXC-004`).
- **Catalog Database Pending Configuration:** Publishing edits to live products requires a bound `VITE_FIREBASE_` environment variables configuration (`EXC-003`).

*(For full exception tracking, see `artifacts/leeway_exceptions_register.md`)*
