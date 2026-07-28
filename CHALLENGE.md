# finmid Frontend Challenge — Crew Ledger

Somewhere in this city there is a crew that robs places, and like every other business they have a bookkeeper.
Their bookkeeper currently works out of a notebook and is losing arguments about money every week.

You are building her one screen: the crew's job ledger, and what each member is owed.

This task is deliberately small. It is **not** a race to build the most features.
We are looking at the decisions you make, not the number of screens you produce.

## Ground rules about LLM

Use whatever tooling you normally use — Claude Code, Cursor, Copilot, plain autocomplete,
nothing at all. We use these tools every day and we assume you do too. There is no
penalty for LLM-assisted code, and no bonus for hand-writing everything.

Would you chose to use LLMs, You are also asked to hand in a short prompt log (see Deliverables).
We are not grading prompt style.
We want to see where the tool helped and where it led you somewhere wrong.

## What to build

A small app, behind a login, for the bookkeeper.

We are not going to describe the screens. We will describe what she is trying to get done with it.
What it is made of, what it shows first, and what it does when she interacts with it are yours — that is most of the work we are looking at.

**Her jobs, in her words:**

- *"When the crew asks me how we're doing, I want to answer with one number I can stand
  behind — so I stop being talked over by whoever shouts the biggest figure."*
- *"When I sit down with the ledger, I want to see the jobs we've done and what each one
  brought in — so I can find the one being argued about without paging through my
  notebook."*
- *"When a member comes to me about one job, I want to tell them exactly what they are
  owed from it and how I got there — so the answer holds up when they check it with
  someone else."*
- *"When I only care about one kind of job, I want to look at just those — so a night that
  went wrong doesn't sit in the middle of what I'm reconciling."*
- *"When something the ledger tells me is uncertain, I want it to say so — so I find out
  from the screen and not from the crew."*

**Must use** TypeScript and React. Everything else — state management, styling, router,
UI kit, test runner — is your call. We do not have a required stack for this task.

### The API is yours too

The backend is mid-migration to GraphQL: the server is set up and `crewMembers` is already
migrated, `crew` and `jobs` are not. Finish enough of that migration to serve the screen
you are building, and drive the dashboard off GraphQL. `auth` stays REST.

This is not a translation exercise, and it is not a backend test. The point is that the
API shape is a frontend decision here: the REST shape is not automatically the right
GraphQL shape, and the filtering, pagination and field selection your screen needs are
yours to design. Migrate what the screen needs, leave what it doesn't, and say which is
which in `DECISIONS.md`.

Playground at `http://localhost:3000/graphql`.

## What the spec does not tell you

Those jobs are what a product manager would hand you in a hurry, and they leave out things
that matter. Some of what is missing is cosmetic. At least one of the gaps will produce a
number on screen that is wrong in a way the bookkeeper would notice and complain about —
and money the crew is arguing over is exactly the kind of number you do not want to be
confidently wrong about.

Finding those gaps, deciding what to do, and being able to defend the decision is the
actual task. We are not going to tell you which gap is which — that would be the whole
exercise. We are also not looking for the maximum number of edge cases handled; we would
rather see three deliberate decisions than fifteen defensive `if` statements.

The API is mock data served from local JSON. It is not a well-behaved API.


## Deliverables

1. **The app.** Runs with the commands below, no undocumented setup steps.
2. **The deployment.** We want to see how excatly you'd deploy this app live.
3. **`DECISIONS.md`** — short, prose or bullets, no template to fill in. Cover:
   - the product calls you made where the spec was silent, and why;
   - anything you deliberately did not build.
4. **`PROMPTS.md`** — in case of LLM usage. Raw and unedited, or a link to a shared session. Partial is fine.


## How we evaluate

We look at
- Frontend craft
- Product judgment
- API design
- Ownership 
- Taste

## Submission

Clone this repository and create a **private** repo with your submission on the default
branch. Please avoid pull requests. Add [@finmid-hr](https://github.com/finmid-hr) as a
collaborator. If you do not hear back from us, email
[people@finmid.com](mailto:people@finmid.com).

---

# The API

Express, backed by generated JSON files. Swagger UI at `http://localhost:3000/docs`,
GraphQL playground at `http://localhost:3000/graphql`.

## The domain, briefly

A **crew** does **jobs**. A job has a status, and if it worked it has **takings** — what
came out of the building. A **fence** converts takings into money and keeps
`fenceFeePercent`. The crew's **cuts** say how the rest is divided between members.
**Expenses** are what the job cost to run.

Everything else about how those fit together is either in the data or a decision you make.

## Packages

| Package name | Description | Available at | Swagger Docs |
| ------------ | ----------- | ------------ | ------------ |
| api | Simple Express.js API | http://localhost:3000 | http://localhost:3000/docs |
| client | React application | http://localhost:3300 | N/A |
| lib-common | Common types shared by the API and potentially the client | N/A | N/A |

## Mock data and running the services

### `pnpm run create-data`

Data lives in `packages/api/src/data` as `json`. Run this first.

```
$ pnpm run create-data

✨ Created Crew Members: packages/api/src/data/crew-members.json
   Logins and passwords:
      gandalf.the.grey@test.com / 123code
      frodo.baggins@test.com / 123code
      gollum@test.com / 123code
      bill.ferny@test.com / 123code
✨ Created Crews: packages/api/src/data/crews.json
✨ Created Jobs: packages/api/src/data/jobs.json
```

### `pnpm run start`

Serves the React application using Vite.

### `pnpm run backend`

Starts the Node API.
