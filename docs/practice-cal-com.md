# Practice: Exploring the Cal.com Codebase

My homework from Builder Lesson 2 (Exploring Codebases), 2026-11-11: run the same exploration skills on a real, public codebase.

**Repo:** https://github.com/calcom/cal.com (an open-source scheduling app, like Calendly)

## Setup steps

Run these in a terminal, outside the TaskFlow practice folder:

```bash
cd ~/Desktop
git clone --depth 1 https://github.com/calcom/cal.com
mkdir -p cal.com/.claude/skills
cp -r ~/Desktop/taskflowdemo/.claude/skills/explore-codebase ~/Desktop/taskflowdemo/.claude/skills/scope-feature cal.com/.claude/skills/
```

- `--depth 1` downloads only the latest version, not the full history, which makes it much faster.
- The `cp` step copies the skills over, because skills only exist inside the project where they're saved.

Then open Claude Code in `~/Desktop/cal.com` and run:

```
/explore-codebase
```

## Tips

- **Cal.com is big.** It's a monorepo (several apps and packages in one repo) and is much larger than TaskFlow. Look at the top-level folders first, then point the exploration at one area, e.g. "focus on the booking flow."
- **The output saves to `cal.com/docs/architecture-overview.md`**, inside that repo, not here.
- **Next steps once it's mapped:**
  1. Trace one flow end to end (e.g. "trace how a booking gets created").
  2. Write rough notes for a feature idea and run `/scope-feature @docs/<your-notes>.md`.
- **Portfolio angle:** the architecture overview, a flow trace, and a scoping brief on a real product make a strong PM interview story.

## Log

| Date | What I did | Notes |
|---|---|---|
| | Cloned repo | |
| | Ran `/explore-codebase` | |
| | Traced a flow | |
| | Scoped a feature | |
