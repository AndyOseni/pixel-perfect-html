# Dashboard redesign plan

## Goal
Restyle the signed-in member and staff dashboards to closely match the attached Kharece Schools dashboard while preserving every existing feature, calculation, permission and secure data call. The current member and staff sign-in screens will remain unchanged.

## Visual direction
- Use a fixed deep-teal sidebar and navigation shell based on `#004C54`.
- Use `#00D9D2` for active navigation, primary actions, highlights and compact icon backgrounds.
- Use white text on dark surfaces and `#0B2742` for headings and body text on light surfaces.
- Match the reference's spacious light-grey workspace, bold page title, welcome line, compact utility controls, white metric cards, restrained shadows and small status accents.
- Preserve the cooperative's existing name, logo, terminology and real data; the uploaded image is a design reference only, not an app asset.

## Staff dashboard
- Recompose the current staff navigation into the reference-style left sidebar with icons, clear active states and sign-out at the bottom.
- Add a strong dashboard header and arrange key society totals into compact overview cards.
- Restyle every existing staff area—members, savings, loans, commodities, reports and settings—using consistent tables, filters, forms, dialogs, badges and action controls.
- Keep all print/report actions and deduction indicators working exactly as they do now.

## Member dashboard
- Use the same visual system with member-focused navigation and summary cards for savings, loan balance, loan eligibility and relevant pending items.
- Restyle savings history, loans, commodity requests, profile and available messages surfaces without changing their behavior.
- Keep member-only wording and avoid exposing staff controls.

## Responsive behavior
- Keep the full sidebar on wide screens.
- Convert it to a compact mobile drawer/header on small screens so content, tables and actions remain usable without overlap or horizontal clipping.
- Ensure metric cards and data sections reflow cleanly across phone, tablet and desktop widths.

## Verification
- Test both portals after sign-in on desktop and mobile-sized screens.
- Confirm navigation, forms, tables, reports, sign-out and all existing workflows still work.
- Confirm no secure service, access rule, calculation, offline behavior or backend integration changes are introduced.
