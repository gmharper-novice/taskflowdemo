# Scoping Brief: Team Workload Dashboard

Source: `docs/workload-dashboard-notes.md`. Context: `docs/architecture-overview.md`.

**The idea:** turn the Team page from a list of names into a view that shows who's overloaded at a glance. It should show task counts per person broken down by priority, plus a visual warning when someone is overloaded. Triage (reassigning tasks from the dashboard) is marked "v1 or later?"

---

## What You'd Need to Build

1. **A workload API endpoint.** For example, `GET /api/team/workload` in `server/routes/teams.js`. It returns each member with their open task count, counts by priority, and probably the total `estimated_hours`. This is a single `GROUP BY` query over `tasks` joined to `team_members`. Today, `GET /api/team` returns only name, role, email and avatar color, with no task data at all.
2. **An overload rule.** A defined threshold that decides when someone gets flagged. It could live in the endpoint or on the client. It needs a product decision first (see Unknowns).
3. **A workload-aware member card.** This would extend `client/src/components/team/MemberCard.jsx`, or wrap it in a new `WorkloadCard`, to add a priority breakdown (Badge-style counts) and an overload indicator (border or icon using `--color-error` / `--color-warning`). The notes ask for it to "reuse the existing team cards," so this should stay visually consistent.
4. **An updated Team page.** `client/src/pages/Team.jsx` would call the new endpoint instead of (or alongside) `useTeam()`. It could add a summary row on top (team total, number of overloaded people) and sort or highlight overloaded members first.
5. **(If triage is in v1) A per-person drill-in and a reassign action.** This would be a Modal listing a member's tasks with an assignee dropdown per task. It needs the PUT path to be wired up from the UI for the first time.

## What Already Exists

| Need | Reuse | File |
|---|---|---|
| Member cards + grid | `MemberCard`, `MemberList` (auto-fill grid, empty state) | `client/src/components/team/` |
| Priority pills | `Badge` with the priority colour map | `client/src/components/common/Badge.jsx` |
| Summary numbers on top | Stat card grid pattern | `client/src/components/dashboard/Stats.jsx` |
| Priority/status colours | `--color-priority-*`, `--color-error`, `--color-warning` (+ `-light`) | `client/src/styles/tokens.css` |
| Data fetching | `useApi(endpoint)` → `{data, loading, error, refetch}` | `client/src/hooks/useApi.js` |
| Per-person task list (drill-in) | `GET /api/team/:id/tasks` already exists, but nothing in the UI calls it yet | `server/routes/teams.js` |
| Reassigning a task | `PUT /api/tasks/:id` accepts `assignee_id`. `useTasks.updateTask` exists but is never called | `server/routes/tasks.js`, `client/src/hooks/useTasks.js` |
| Drill-in container | `Modal` | `client/src/components/common/Modal.jsx` |
| Task rows inside drill-in | `TaskRow` | `client/src/components/tasks/TaskRow.jsx` |

## Dependencies & Unknowns

- **What does "overloaded" mean?** This is the biggest open question, because it decides what the endpoint has to return.
  - The notes use **task count** ("Rachel has 14, James has 3"), but count treats a 1-hour task the same as a 20-hour one.
  - `tasks.estimated_hours` exists in the schema and the form collects it, but nothing displays it today. Hours might be a better signal.
  - Should a threshold be absolute (e.g. >8 open tasks), relative to the team average, or weighted by priority?
- **The notes don't match the data.** In the current seed data:
  - Rachel Torres has 13 tasks (12 open, 11 of them high/urgent, ~103 estimated hours).
  - James Wilson has 9 (6 open), not 3.
  - The imbalance is real but different from what the notes say. The PM's mental model was out of date, and that's an argument for the dashboard itself.
- **Which tasks count?** Probably everything except `done`. Do `in-review` tasks still count toward someone's load? Do overdue tasks count extra?
- **Triage is in or out of v1.** Including it adds a write path, which brings permission questions (there's no auth, and `req.user` is a hardcoded mock) plus the need to refresh both the old and the new assignee's numbers.
- **Unassigned tasks.** Should the dashboard show the backlog nobody owns? Those tasks have `assignee_id = NULL` and won't appear on anyone's card.
- **Thresholds in Settings?** If the overload limit should be configurable, it would go in the `settings` table. But the Settings page doesn't save anything today, because its toggles aren't wired up.

## Where the Difficulty Is

**Straightforward:**
- **The read-only dashboard.** The data is already in the `tasks` table, so this needs no schema change. The endpoint is one aggregate query following the same raw-SQL pattern as `GET /api/projects` (which already computes `task_count`/`completed_count` with subqueries). The UI is existing cards, badges, tokens and the `useApi` hook arranged in a new way.
- **The drill-in list.** The endpoint already exists and only needs a UI that calls it.

**Needs more thought:**
- **The overload rule.** It's simple to code but hard to agree on. If you pick the wrong signal (count vs. hours vs. priority), the dashboard flags the wrong people and loses the team's trust. This needs to be settled before building.
- **Triage/reassign.** It would be the first edit action in the whole UI:
  - Nothing in the client calls a PUT endpoint today.
  - There's no UI error handling pattern: hooks return `error`, but no page renders it, and the create flows have no `try/catch`.
  - The data has to stay consistent across two people's numbers after a reassign.
  - The task-creation trace (`docs/task-creation-flow.md`) showed the codebase handles writes with a full `refetch()` that blanks the page with a Spinner. That will feel clunky in an interactive triage view.
  - Splitting it into a v2 makes v1 noticeably simpler.
- **Card layout.** `MemberCard` is a horizontal avatar + text layout with hardcoded sizes (`48px` avatar, `#fff`). Adding a priority breakdown means either extending that card or making a new variant. That's minor, but it decides whether the existing Team page changes too.

**Questions to bring to engineering:**
- Should we compute workload on the server (a new endpoint) or on the client (fetch all tasks and group them)? A new endpoint is cleaner, but with this little data the client approach would also work.
- Should triage use the existing `PUT /api/tasks/:id` as-is? It updates only the fields you send, so changing `assignee_id` alone works. Do we need an audit trail of reassignments?
- Is now the time to add a shared error-handling pattern, since triage would be the first edit flow?
