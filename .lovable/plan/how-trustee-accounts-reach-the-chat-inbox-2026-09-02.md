# How trustee accounts reach the chat inbox

## How it works today

Settings → Trustees has three dropdowns (President, Treasurer, Secretary). Each dropdown lists every member and saves the selected member's internal record ID into browser storage under `nut_trustees`.

When someone signs in as a member, the app hands the chat widget their identity (member ID, name, employer number). The widget compares that ID against the three saved trustee IDs:

- match → they get the **trustee inbox**: every member conversation, unread badges, and the ability to reply.
- no match → they get the **member view**: one thread to the trustees.
- the admin console always gets the trustee inbox as "Admin (Secretariat)".

So there is no separate trustee username or password. A trustee simply logs in with their own member employer number and PIN; being named in Settings → Trustees is what upgrades that same login to inbox access.

```text
Settings → Trustees          Member login                 Chat widget
president: <member id>  -->  id matches one of the 3  --> Trustee inbox (all threads)
treasurer: <member id>       id matches none          --> Member thread (to trustees)
secretary: <member id>       admin console            --> Trustee inbox (Secretariat)
```

## What you need to do

1. Open the admin console → Settings → Trustees.
2. Pick the three real members for President, Treasurer and Secretary (each option shows name and employer number, so pick the right person).
3. Optionally lock the roster — locking requires any two of the three trustee member IDs, and while locked the dropdowns cannot be changed.
4. Each trustee then logs in normally as a member; the "💬 Live Chat" button opens the inbox instead of a single thread.

Note: the trustee selection is stored per browser/device, so each trustee's device needs the roster present (or they use the admin console). If you want the roster shared across devices automatically, that is a separate change — say the word and I'll plan it.

## Changes in this plan

None to the code. This is a configuration step in the existing Settings screen.
