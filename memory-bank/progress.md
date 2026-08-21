# Progress

**What works**

- App compiles and builds in local-only mode without Prisma DB connections.
- Popular website checks no longer depend on database monitor lookups.
- Auth, monitors, alerts, checks/incidents, and SSL records operate from in-memory runtime state.

**Not started / backlog**

- Optional: remove unused Prisma/NextAuth packages from dependencies.
- Optional: add file-based persistence if local data should survive restarts.

**Known issues**

- In-memory store is non-persistent; all users/monitors/alerts reset after server restart.

_Keep bullets factual and small; link issues or PRs when useful._
