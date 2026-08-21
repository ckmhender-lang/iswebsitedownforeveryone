# Active context

**Current focus** (one short paragraph):
Converted app runtime to local-only mode: removed Prisma and NextAuth dependencies from active code paths, switched auth/session + monitors/alerts/check/incident/SSL state to in-memory local store, and kept existing UI/API response shapes compatible.

**In progress**:

- [x] Replace Prisma-backed storage with local in-memory store
- [x] Replace NextAuth credential flow with local auth endpoints and cookie session
- [x] Rewire dashboard/monitor/alert APIs and pages to local data access

**Decisions (recent)**:

- Local store lives in `src/lib/local-store.ts` and is process-memory only (resets on restart)
- Session cookie key is `iswd_session`; login/logout now use `/api/auth/login` and `/api/auth/logout`
- Build no longer runs Prisma generation; `db:*` scripts now print local-mode disabled message

**Open questions**:

- None

_Update when the task or branch focus changes._
