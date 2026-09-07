# Lock down the portal: no direct database access from the browser

The app page currently reads and writes the database straight from the browser, has the sign-in library loaded twice, and keeps re-sending every saved change in a loop — that loop is what produced hundreds of backend calls. Payslips are also stored in a public folder, so their links are guessable by anyone.

## What changes

- **All member, savings, loan, commodity and guarantor data comes from the secure services only** (staff sign-in list, member dashboard, member update). No table is read or written from the browser again.
- **The duplicated code block is removed** — the page currently contains two near-identical copies of the sync layer. One stays, cleaned up; the shared connection is no longer exposed on the page for anyone to poke at from the browser console.
- **The runaway sync loop is deleted**: the save-interceptor, the offline queue, the repeating retry timer. Saving happens only when a screen actually asks for it, one call per action.
- **Member screens load in a single call** after sign-in; the staff console loads in a single call.
- **Payslips move to private storage**: max 5MB, PDF/JPG/PNG only, random file name, and only that file name is stored on the member record. Public links are removed entirely, so the screen shows "Uploaded" instead of a link until a secure download service exists.
- **Live chat is hidden for now**, with a note in the code, because its secure services are not deployed yet. It goes back on as soon as they exist. Nothing else about chat is deleted.
- **Offline caching never touches the backend**: backend, service and file traffic always goes to the network, so no private data is ever stored on the device by the cache.
- Member-only and staff-only entrances, the installable app and offline page loading all keep working exactly as they do today.

## Trade-offs you should know

- While chat is hidden, members and trustees cannot message each other in the app. That is deliberate: today any signed-in visitor can read everyone's messages.
- Payslip viewing is paused (upload still works) until the secure download service is added.
- Screens that relied on the browser writing directly to the database (bulk savings/loan/commodity syncing) now go through the member-update service; anything it does not yet support saves on the device only, and I will list those for you after the change.

## Technical notes

- Single client: keep one `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)` as `supabaseClient` (storage upload only). Remove `window.supabase`. Delete the second duplicated `<script type="module">` sync block (lines ~396-575) and its copies of the loaders.
- `EDGE_BASE = 'https://toccfmjgrctmxswephwf.supabase.co/functions/v1'` hardcoded as specified; `getEdgeHeaders()` adds `x-admin-secret` from `localStorage.nut_admin_secret` (one-time prompt) when `?portal=admin`; `edgeCall(fn, body)` parses JSON and throws `j.error`.
- `__nutSecureLogin` stores `nut_member_id`, `nut_employer_number`, `nut_member_name`; `__nutAdminGetMembers` / `__nutAdminUpdateMember` map to their functions; the existing `change-pin`, `update-member`, `update-savings`, `approve-guarantor`, `decline-guarantor`, `apply-commodity` actions keep routing through `admin-update-member` (one call per user action, no timers).
- `loadFromSupabase()` implemented exactly as specified: admin branch renders `data.members || data`; member branch calls `member-get-dashboard` with `{ memberId, employerNumber }` and clears the stored identity + shows sign-in on 403/not found/mismatch.
- Remove: `localStorage.setItem` monkey-patch, `OFFLINE_QUEUE_KEY`/`getQueue`/`setQueue`, `processQueue` + its `setInterval`, the global file-input interceptor, every `supabase.from(...)` (currently 14 occurrences) and both `getPublicUrl` calls.
- Payslip upload: private bucket `payslips`, `crypto.randomUUID() + '_' + sanitised name`, `upsert:false`, `contentType`; persist `payslip_path` via `admin-update-member`.
- `public/sw.js`: return early (network-only) for any URL containing `supabase.co`, `/functions/v1/`, or `/storage/`.
- `public/app/chat.js`: no code deleted, but the widget is not mounted — guarded early return plus `// TODO: deploy chat-get-messages / chat-send-message edges`. When they land, switch to `edgeCall` plus 5s polling and drop the realtime channel.
- Verification: grep for `.from('`, `getPublicUrl`, `OFFLINE_QUEUE`, `processQueue`, `localStorage.setItem = function` → zero hits; then a browser run of member sign-in (1234567 / 4321) and `/admin` counting exactly one dashboard call and one members call in the network log, and reporting the before/after `supabase.from` count (14 → 0).
