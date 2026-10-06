# Fix admin dashboard content overlap

## Savings page
- Keep **Savings Records** as the page heading.
- Place the four summary blocks directly beneath it in this exact order: **Savings**, **Total**, **Loan Repayment**, **Commodity**.
- Move the action controls and comparison/status information into their own rows so they cannot collide with the heading or summary blocks.
- Keep the savings table columns and all existing figures, filters, import, export, and deduction-status behavior unchanged.

## Other admin pages
- Correct the shared admin content layout so headings, action buttons, summary blocks, forms, and tables stay in separate layout areas.
- Allow wide tables to scroll inside their own section rather than extending beneath the sidebar or outside the screen.
- Preserve the fixed 280px desktop sidebar and the existing mobile menu behavior.

## Responsive behavior
- Desktop: keep the four Savings summary blocks on one row when space allows.
- Tablet: reflow them into two columns.
- Phone: stack them in one column, with action controls wrapping below instead of overlapping.

## Verification
- Check Dashboard, Savings, Deductions, and every other admin menu at desktop, tablet, and phone widths.
- Confirm no element collisions or page-level horizontal overflow, and confirm sign-in/sign-out screens remain free of dashboard navigation.
- Confirm all existing admin actions still work and no data, calculations, security, or backend behavior changes.
