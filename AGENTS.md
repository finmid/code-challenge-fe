# Repo notes for coding agents

Conventions and gotchas for this monorepo. Kept here so agents don't have to re-derive
them each session.

## Layout

```
packages/api          Express API, JSON-file backed
packages/client       React + Vite app (port 3300)
packages/lib-common   Types shared by both
```

Run `pnpm run create-data` once before anything else, then `pnpm run backend` and
`pnpm run start` in separate shells.

## Conventions

- TypeScript everywhere, `strict` on via `tsconfig.base.json`.
- Shared types live in `lib-common/types` and are imported as
  `@finmid/lib-common/types`. Do not redeclare API shapes in the client.

## Domain

A heist **crew** does **jobs**. A job that works produces **takings**. The fence turns takings
into money and keeps `fenceFeePercent`. What is left is split between crew members
according to the job's **cuts**. Money the crew spent making the job happen is in
**expenses**.

## Working with the ledger data

- Money is integer minor units (cents) everywhere. Divide by 100 for display and use
  `Math.round` when you do, so float noise doesn't leak into the UI.
- Takings are normalised to EUR cents at intake by the valuation service, so a job's haul
  is `job.takings.reduce((sum, entry) => sum + entry.valueEurCents, 0)`. The per-asset
  fields (weights, quotes, appraisals) are kept alongside for the audit trail; you do not
  need to look at them.
- `cuts` on a job add up to 100% of the crew's side of the split. Percent cuts are the
  normal case; the FLAT kind exists but was only used for one job years ago.
- `expenses` are informational. They are taken off the haul before it reaches the ledger,
  so don't subtract them again.
- `jobTime` is an ISO string in UTC.
- `targetIconUrl` and `profileImage` are absolute and point at the API's `/static` mount.
- Job status is one of `CASING`, `RUNNING`, `SCORED`, `BURNED`, `SEIZED`.
- A crew member's `standing` is bookkeeping metadata for the crew list. It has no effect
  on payouts.

## API behaviour

- `GET /jobs` supports `crewId`, `plannerId`, `status`, `limit`, `offset`. The dataset 
  is small enough now that everything comes back in one page, so pagination is not worth
  handling.
- The endpoint is `/crew-data` for the crew's own record.
- Reads are served from memory off local JSON, so they are fast and do not fail. Error
  handling on GETs is not worth the code; focus error states on `POST /login`.
- The token is a JWT; parse it client-side if you need the crew id.

## GraphQL

Half-migrated. `crewMembers` is on GraphQL, `crew` and `jobs` are still REST only. Schema
lives in `packages/api/src/graphql`. Yoga sits in front of its own store rather than the
replica, so GraphQL reads do not inherit whatever flakiness you might see on the REST
side; if you add retry logic anywhere, keep it on REST.

## Don't

- Don't reformat files you aren't otherwise touching.
