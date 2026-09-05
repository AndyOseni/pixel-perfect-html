# Bring back the staff (admin) sign-in page

## What's happening

Once you open the member address, the app remembers "member mode" for the rest of that browser tab. So when you go back to the normal page, it still opens as the member portal with the staff sign-in hidden.

## The fix

1. Member mode only applies when you actually arrive from the member address. Opening the normal page directly always clears member mode and shows both **Member** and **Admin** sign-in choices again.
2. Add a small "Staff sign-in" link at the bottom of the member sign-in screen, so anyone stuck in the member portal can get back to the normal page in one click.
3. Member mode still survives page refreshes while you stay inside the member portal, so members are not thrown out mid-session.

## Technical notes

- In `public/app/portal.js`: keep the `?portal=member` flag sticky per tab, but clear `sessionStorage.nut_portal` when the page is loaded without the flag and without a member session already signed in.
- Append the flag to the URL (history.replaceState) after activation so refreshes inside the portal keep working.
- Add the escape link into the login card, pointing at `./index.html` with member mode cleared.
- Verify with a browser run: `/member` shows member-only sign-in; `/app/index.html` shows Member + Admin pills and admin/admin123 reaches the admin console.
