# Flight Team Rivalry Board

A polished first-draft web app for the Florida Tech Flight Team that turns NIFA-style practice results into a friendly, growth-focused internal competition board. The prototype is intentionally frontend-only so it can be shown to the e-board quickly and hosted for free on GitHub Pages, Vercel, or Netlify.

## What is included

- Responsive mission-control dashboard for desktop and mobile.
- Overall, category, and event leaderboards.
- Member profiles with personal bests, badges, recent scores, privacy settings, and active rivalry context.
- Challenges/rivalries page with respectful head-to-head cards and suggested close-score rivals.
- Events page grouped into Knowledge, Landing, and Miscellaneous NIFA-style categories.
- E-board/admin panel for manual score entry, member/event creation, score visibility toggles, score deletion, announcement editing, and scoring weight changes.
- Mock data for 14 team members, 16 events, six weeks of score history, hidden-score examples, badges, challenges, and announcements.

## Tech stack

This first draft uses React, TypeScript, and Vite with custom CSS. That keeps the prototype easy to understand, inexpensive to host, and ready to migrate later to Supabase, Firebase, Google Sheets, or a small API.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Use the sidebar toggle to switch between member mode and e-board/admin mode.

> Note: in this Codex environment, `npm install` was blocked by registry policy. The source code is ready for a normal Node/Vite environment.

## Deployment options

### GitHub Pages

1. Run `npm run build`.
2. Publish the generated `dist/` directory with GitHub Pages or a `gh-pages` workflow.
3. The Vite config uses `base: './'`, which supports project pages and relative asset paths.

### Vercel or Netlify

1. Connect the repository.
2. Use build command `npm run build`.
3. Use publish directory `dist`.

## Scoring system

The composite score is designed not to reward only already-best members.

1. **Raw performance**: every score is normalized to 0-100. Higher-is-better events use `raw / max`; lower-is-better landing/message-drop events invert distance from the target.
2. **Category weighting**: Knowledge, Landing, and Miscellaneous category averages are weighted through editable e-board settings.
3. **Improvement score**: compares later weekly averages against earlier weekly averages, helping rookies and returning members compete against their own baseline.
4. **Consistency score**: rewards lower week-to-week variance, encouraging safe repeatable reps instead of one lucky result.
5. **Participation score**: rewards logged practice reps and streaks so effort and contribution matter.
6. **Privacy filter**: public leaderboards exclude scores hidden by the member. E-board mode can still see all scores for coaching and audit purposes.

## Data model notes

The TypeScript models are intentionally close to future database tables:

- `Member`
- `EventDefinition`
- `EventCategory`
- `ScoreEntry`
- `Challenge`
- `Badge`
- `Announcement`
- `UserRole`
- `VisibilitySettings`
- `ScoringWeights`

## Future backend paths

### Cheapest practical path: Google Sheets first

- Keep a Google Sheet with tabs for members, events, scores, challenges, and announcements.
- Add CSV export or a small Apps Script endpoint.
- Replace mock data imports with a `dataProvider` that fetches sheet rows.

### More app-like path: Supabase

- Supabase free tier can provide Postgres, authentication, storage, row-level security, and admin dashboards.
- Map the TypeScript models to tables.
- Add roles: member, officer, coach, admin.
- Store score visibility at the score level and enforce policy with RLS.

### Firebase path

- Good for realtime score updates and simple auth.
- Use Firestore collections matching the current models.
- Add cloud functions later for computed standings snapshots.

## CSV import roadmap

- Add an admin upload control.
- Parse CSV columns: `memberName,eventName,rawScore,date,isPublic,notes`.
- Validate unknown members/events before saving.
- Show a preview table and import errors before committing rows.

## Assumptions

- This prototype does not use official Florida Tech logos or protected brand assets.
- All names and scores are mock data for e-board feedback.
- Public score hiding is implemented in the client for the prototype; a real version should enforce it in the backend.
- The admin toggle is a prototype convenience, not authentication.

## Version 2 roadmap

1. Add real authentication and role-based permissions.
2. Replace mock data with Supabase or Google Sheets sync.
3. Add CSV import/export for low-cost operations.
4. Add editable challenge creation and challenge invitations.
5. Add season archives and historical trend charts.
6. Add mobile score-entry flow for practice sessions.
7. Add automated badge awarding rules.
8. Add audit logs for score edits and visibility changes.
