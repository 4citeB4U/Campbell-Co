# LeeWay Agent Capability Report

## Capability Status
FAIL - capability-linked design exists, but the final owner scenario does not successfully resolve through the live AdminOS flow.

## LeeWay Runtime Identity Verification
Result: `FAIL`

Capability-linked runtime artifacts now surface:
- agent ID
- role ID
- display name
- capability IDs
- workflow ID
- telemetry stream ID
- law references
- selected region and schema context

## Verified Capability Usage
Evidence artifact:
- `.leeway/runtime-evidence/selected-area-hero-image-runtime.json`

Observed in the final durable run:
- selected owner agent was captured as `Aura`
- the exact prompt was used
- the owner flow failed before a governed proposal or live capability-linked runtime result was produced
- capability IDs were therefore not proven in the final owner-flow artifact

## Observed Owner-Facing Exposure
- selected-region panel evidence was captured
- Agent Status Center and Runtime Trace proof for the exact scenario was not reached because the flow failed before proposal creation

## Validation
- `npm.cmd run lint` -> `PASS`
- `npm.cmd run build` -> `FAIL`
- `npm.cmd run leeway:audit` -> `PASS`
- `node .leeway/scripts/verify-selected-area-runtime-ui.mjs` -> `FAIL`

## Final Verdict
`FAIL - owner flow broken`
