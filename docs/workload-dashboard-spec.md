# Feature Spec: Team Workload Dashboard

Source: `docs/workload-dashboard-scoping.md` (scoping brief), `docs/workload-dashboard-notes.md` (original notes). Produced by a `/grill-me` spec interview, 2026-11-13.

## Vision

A **team lead / engineering manager** opens the Team page to plan work and balance it across people. Right now the page only lists names and avatars, so to see who's drowning they have to dig through task lists one person at a time.

The dashboard's main job is to **flag who's overloaded, at a glance, without clicking**. Overload is measured by **open high + urgent tasks**, because that's where the pressure sits. Low-priority filler doesn't count toward the flag.

Demo moment: open Team, switch to Workload, and Rachel Torres is red before anyone touches anything. Click her to see the 11 high/urgent tasks behind the flag.

v1 is **read-only**. Its purpose is to show the imbalance. Rebalancing happens on the Tasks page for now.

## Constraints

- **Read-only.** v1 has no reassignment or editing. Triage from the dashboard is deferred to v2.
- **What counts as "open":** only `todo` and `in-progress`. `in-review` and `done` are excluded, because work under review is mostly off the person's plate.
- **Overload rule** (open high + urgent count per member):
  - **0–3** → normal
  - **4–6** → **at risk** (yellow, `--color-warning` / `--color-warning-light`)
  - **7+** → **overloaded** (red, `--color-error` / `--color-error-light`)
- **Thresholds are fixed constants in v1.** They are not configurable in Settings.
- **Computed on the server:** a new `GET /api/team/workload` endpoint in `server/routes/teams.js` using one aggregate SQL query, following the raw-SQL pattern of `GET /api/projects`.
- **Consistent with existing UI:** reuse the `MemberCard` look (avatar + name + role), `Badge` priority pills, the `Stats` card pattern for the summary row, and `Modal`. Inline style objects, design tokens only, no external UI libraries (see `docs/design-system.md`).
- **One app, one dev server.** All three variants live on the Team page as tabs. No separate prototypes or ports.
- The existing names-only Team list stays available. A **List / Workload** toggle sits in the top-right of the Team page header, and the Workload view has three variant tabs below the header.

## Acceptance Criteria

Ordered by priority. **AC2 is the must-have.**

1. **AC2 – Overload flag:** members with 7+ open high/urgent tasks show as **overloaded** (red), and those with 4–6 show as **at risk** (yellow). The state is visible on the card without clicking.
2. **AC1 – Priority breakdown:** the Workload view shows every team member with their open task count, split by priority (urgent / high / medium / low).
3. **AC7 – Explain the flag:** a legend (and/or a tooltip on the flag) states the rule, e.g. "Overloaded: 7+ open high/urgent tasks · At risk: 4–6".
4. **AC3 – Sort by load:** overloaded members sort first, then at-risk members, then everyone else.
5. **AC4 – Summary row:** shows total open tasks across the team, the number of overloaded members, and the number of at-risk members.
6. **AC5 – Drill-in:** clicking a member shows their open tasks, using existing data from `GET /api/team/:id/tasks`. How the detail appears is what differs between the variants.
7. **AC6 – Design consistency:** all styling uses tokens from `tokens.css`, there are no hardcoded colors, and the cards look related to the existing `MemberCard`.

## Edge Cases & Error States

| Scenario | Expected behavior |
|---|---|
| Member has **zero open tasks** | The card still renders, with a neutral/positive **"Has capacity"** note so the team lead can spot who has room. |
| Workload API **fails or times out** | An **inline error card with a Retry button** appears in the content area. This is the first rendered error state in the app. Retry calls `refetch()`. |
| **Unassigned** open tasks | **Ignored in v1.** The seed data has 0 unassigned open tasks today. Revisit in v2. |
| **Very loaded** member (e.g. Rachel, 12 open) | The drill-in must stay usable. In particular, Expandable Rows must not make the page unworkable (see Variant risks). |
| **Nobody** in the at-risk tier | The legend still explains yellow. The seed data is adjusted so yellow can be verified live (see Test Plan). |
| Drill-in task fetch fails | Show an inline error inside the detail area. The rest of the dashboard stays intact. |

## Variant Directions

All three variants share the same endpoint, overload rule, summary row, legend, and sorted member cards. They differ only in **what happens when you click a member**.

### Variant A: Expandable Rows
- **Interaction:** clicking a member's row expands it in place to list their open tasks. Other rows stay where they are, and several rows can be open at once.
- **Strongest argument:** **compare side by side.** You can open Rachel and James together to see who could absorb whose work.
- **Biggest risk:** **the page gets long.** Expanding Rachel's 12 tasks pushes everyone else off screen.
- **Mitigation to try:** cap the visible tasks in an expanded row (e.g. show the top items by priority with "+N more"), or make the expanded area scroll internally.

### Variant B: Slide-Out Panel
- **Interaction:** clicking a member slides in a panel from the right with their details. The member grid stays visible beside it, and clicking another member swaps the panel's contents.
- **Strongest argument:** **the overview stays visible.** The overload flags stay on screen while you read one person's detail.
- **Biggest risk:** **it's unclear who's selected.** It's easy to lose track of which card the panel belongs to.
- **Mitigation to try:** a strong selected state on the active card (`--color-primary` border + `--color-primary-light` background), plus the member's avatar and name prominent at the top of the panel.

### Variant C: Modal Deep-Dive
- **Interaction:** clicking a member opens a centered modal (reusing `Modal`) with a full breakdown: summary stats, a priority distribution bar, and tasks grouped by priority.
- **Strongest argument:** **it has the most room for context.** There's space for a priority chart, estimated hours, and grouped tasks.
- **Biggest risk:** **it hides the overview.** You can't compare Rachel to anyone while the modal is open.
- **Mitigation to try:** keep the modal content focused on one person, and make it fast to close (Esc, backdrop click, close button).

## Test Plan

### Visual verification (screenshot each)
- [ ] The Workload view under each of the 3 variant tabs
- [ ] Rachel's card is red/overloaded **before any click**
- [ ] Rachel's detail open in each variant
- [ ] The legend/tooltip explaining red and yellow
- [ ] An at-risk (yellow) member visible live (after the seed tweak)

### Functional verification
- [ ] `GET /api/team/workload`: Rachel = 11 open high/urgent, and `in-review` + `done` are excluded from all counts
- [ ] Overloaded members sort first, then at-risk members
- [ ] The summary row numbers match the API response
- [ ] Clicking a member shows that member's correct open tasks, in all 3 variants
- [ ] Slide-Out: the selected card is visibly highlighted, and clicking another card swaps the panel
- [ ] Modal: Esc, a backdrop click, and the close button each close it
- [ ] The List / Workload toggle switches views, and the List view is unchanged

### Edge case verification
- [ ] A member with 0 open tasks shows "Has capacity"
- [ ] With the API down (server stopped), the inline error + Retry renders, and Retry recovers once the server is back
- [ ] With Rachel expanded in Expandable Rows, the page is still usable
- [ ] No hardcoded colors in the new components (tokens only)

### Seed data adjustment
- Adjust `server/db/seed.sql` so **one member lands in the 4–6 at-risk tier** (e.g. raise Olivia Foster from 2 to 4 open high/urgent tasks by bumping the priority of two of her existing open tasks). Then reset the DB with `cd server && npm run db:reset` (using Node 22).
- Rachel must stay at 7+ (overloaded). Everyone else stays at 0–3.
