# Two separate portals: members and admin

Right now one page holds both sign-ins, and once you visit the member address the browser tab keeps showing the member portal even at the old address — that's why the admin sign-in disappeared.

## What you'll get

Two clearly separated entrances, same features as today:

- **Member portal** — the main address (`/`). Opens straight into member sign-in: overview and balance, loan eligibility (2 x savings minus outstanding), savings history, my loans and loan application, guarantor requests, commodity requests, profile and change PIN, Messages page plus the chat bubble. No staff sign-in anywhere on it.
- **Admin portal** — its own address (`/admin`). Opens straight into staff sign-in with the full admin console: members register, savings and Oracle deduction status, loans, commodity orders, deduction schedules, reports and printing, settings and trustees, and the trustee chat inbox.
- A small "Staff sign-in" link at the foot of the member sign-in page and a "Member portal" link on the admin sign-in page, so nobody gets stuck.
- Member mode no longer sticks to the tab: each address always shows its own portal, even after refresh.

The member portal also becomes installable on a phone home screen (app name, icon, splash colours) so members can open it like an app.

## What stays the same

All screens, calculations, data and secure sign-in behaviour are untouched — this is a split of the entrances, not a rewrite of the features.

## Technical notes

- Keep one shared app engine (`public/app/index.html` plus `chat.js`) as the single source of truth for all screens, so member and admin views can never drift apart. Instead of duplicating the 578-line file into `admin/index.html`, add a mode flag resolved at load: `portal=member` or `portal=admin`.
- Routes: `src/routes/index.tsx` -> member mode; new `src/routes/admin.tsx` -> admin mode; keep `/member` as an alias of `/`.
- Rewrite `public/app/portal.js` into a two-mode shell: read the mode from the URL (not sticky session state), stamp `data-nut-portal`, hide the opposite login pill, auto-select the right one, block the other console view, and inject the Messages tab only in member mode. Add the cross-links.
- Add `public/manifest.webmanifest` plus `icon-192.png` / `icon-512.png` and the manifest/theme-color/apple-touch-icon head tags for member installability. No service worker and no offline caching unless you want the portal to work without internet — say the word and I'll add it with the guarded setup.
- Verify with a browser run: `/` shows member-only sign-in and 1234567 / 4321 works; `/admin` shows staff sign-in and admin/admin123 reaches the console; neither address leaks the other's sign-in after refresh.

One question folded in: if you want members to keep using the portal offline (see last balance with no network), tell me and I'll include that; otherwise it stays online-only but installable.
