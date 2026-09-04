# Member-only portal at its own address

Members get a dedicated address that opens straight into member sign-in. Admin sign-in and the admin console are never shown there. The existing main page keeps working exactly as it does today for admins and staff.

## What members get

At the new address (`/member`):

1. Sign in with employer number and PIN (same secure sign-in used today).
2. Overview with balance summary: total savings, monthly contribution, outstanding loan, and loan eligibility (2 x savings minus outstanding balance).
3. Savings history.
4. My loans, plus a loan application form with the eligibility check and clear messaging when the member is not eligible.
5. Commodity requests: choose an item, submit a request, and see the status of past requests.
6. Messages: a full page listing the member's conversation with the trustees, alongside the floating chat bubble and its new-message alerts.
7. Profile, including change PIN.

Nothing on this page reveals other members' data, and no admin controls appear anywhere on it.

## What stays the same

- The current address keeps both member and admin sign-in, so existing habits and links are unaffected.
- All saving, sign-in and updates continue to go through the existing secure endpoints.

## Technical notes

- Add a route `/member` that serves the app in a member-only mode (query flag on the same static app file, e.g. `?portal=member`), so there is a single copy of the app logic to maintain.
- In that mode, a small init script hides the admin sign-in tab and blocks the admin console view, defaulting the app to the member sign-in screen; the mode is also remembered for the session so a page refresh stays in the portal.
- First implementation step: confirm which member screens already exist in the bundle (overview, savings history, loans, profile are present) and whether member-side loan application and commodity request UI already exist. Any missing piece is added inside the member portal shell, reusing the existing eligibility helpers (`window.__nutElig`, `window.__nutEligOut`) and the existing endpoints (`__nutSecureLogin`, `__nutChangePin`, `__nutApplyCommodity`).
- Messages page reuses the `chat.js` conversation data for the signed-in member rather than duplicating chat logic.
- Give `/member` its own page title and description for sharing.
