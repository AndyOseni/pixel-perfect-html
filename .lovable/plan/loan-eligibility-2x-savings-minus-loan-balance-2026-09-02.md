# Loan eligibility = 2x savings minus loan balance

## New rule

Available loan eligibility = (2 x total savings) − total outstanding loan balance.

- If outstanding loan balance is greater than 2x savings, the member is not eligible for any new loan (eligibility shown as zero, application blocked).
- A member with no loans keeps the full 2x savings eligibility, as today.
- Applications for more than the available eligibility are rejected with a message showing the available amount, savings, and current loan balance.

## Where it changes (member portal)

- Eligibility card on the member loan page: shows the net available amount, with a breakdown line "2 x savings − outstanding balance".
- Loan application validation: block when balance exceeds 2x savings, and cap the principal at the net available amount.
- Member profile and dashboard eligibility figures use the same net amount.

## Where it changes (admin)

- Loans table borrower hint ("… savings, eligible …") shows the net available eligibility.
- Members table "Eligibility 2x" column shows net available eligibility (header relabelled "Eligibility").
- Loan approval/guarantor review note shows the net figure.
- Reports/summary "Loan Eligibility (2x)" totals sum the per-member net amounts (floored at zero) instead of raw 2x savings.

## Technical notes

All edits are in the bundled app at `public/app/index.html`. The memoised value `fl` becomes `max(0, totalSavings*2 − activeOutstanding)`, reusing the existing outstanding-balance computation, and the standalone `totalSavings*2` display/validation sites are updated to the same formula. Outstanding balance counts loans in the existing active/approved/disbursed/guarantor_review/pending set, consistent with the current application check.
