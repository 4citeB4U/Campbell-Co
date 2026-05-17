# Selected-Area Agent Runtime Report

## Status
FAIL - the checked-in runtime evidence shows the exact owner scenario breaks in the actual AdminOS UI flow before a governed proposal is created.

## LeeWay Runtime Identity Verification
Result: `FAIL`

Every verified selected-area runtime object now carries LeeWay identity metadata:
- agent action identity
- runtime state identity
- skill route identity
- diagnostic identity
- proposal identity
- draft patch identity
- structured telemetry events
- structured audit events
- MCP/tool usage records

The selected-area runtime is no longer treated as compliant merely because `LeeWaySkillRuntime` exists by name. The underlying action, route, diagnostic, proposal, draft patch, telemetry, and audit objects are now separately identified and surfaced.

## Verified AdminOS UI Scenario
Scenario: `Put this image in the homepage hero.`

Durable evidence artifact:
- `.leeway/runtime-evidence/selected-area-hero-image-runtime.json`
- screenshots / DOM captures under `.leeway/runtime-evidence/selected-area-hero-image-runtime/`

Proven by the artifact:
- exact prompt used: `Put this image in the homepage hero.`
- AdminOS opened on `http://127.0.0.1:3000/admin.html`
- live preview opened
- selected region recorded as `public.home.hero`
- selected schema paths recorded, including `home.hero.image` and `home.hero.imageAlt`
- selected owner agent recorded as `Aura`
- allowed actions recorded as `proposal.preview`, `draft.apply`, `proposal.reject`
- selected-region panel screenshot and DOM capture were saved

Observed failure in the artifact:
- no governed proposal ID was created for the exact prompt during the durable verification run
- no active runtime result, routed skill, workflow, action ID, diagnostics, or proposal before/after values were captured from the actual UI flow
- runtime trace and agent status snapshots could not be captured for the exact scenario because the owner flow never reached proposal state
- apply / publish / reject / missing-alt / unsupported negative-path proof did not execute in the final durable run because the primary owner scenario failed first

## Additional UI Checks
- runtime blocked mode remains `NOT AVAILABLE` in localhost `DEVELOPMENT_BOOTSTRAP`

## Failure Notes
- artifact `timeoutContext` shows the owner UI remained on AdminOS and live preview, but `activeProposalId`, `activeRuntimeResult`, and `lastRuntimeResult` all remained `null`
- browser error capture in the artifact was empty, so the failure currently presents as a silent owner-flow breakdown rather than an explicit surfaced exception
- verification depends on `window.__LEEWAY_PREVIEW_TEST_API` and `window.__LEEWAY_ADMIN_TEST_API` test hooks
- `npm.cmd run build` currently fails with a Vite HTML emit-path error, so the validation set is not fully green even aside from the owner-flow failure

## Final Verdict
`FAIL - owner flow broken`

## Validation
- `npm.cmd run lint` -> `PASS`
- `npm.cmd run build` -> `FAIL`
- `npm.cmd run leeway:audit` -> `PASS`
- `node .leeway/scripts/verify-selected-area-runtime-ui.mjs` -> `FAIL`
