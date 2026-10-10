# nigeria-paye

Calculate Nigerian **PAYE income tax, pension, NHF and take-home pay** under the **Nigeria Tax Act 2025** (in force from 1 January 2026), and compare it with the old Personal Income Tax Act.

Zero dependencies · TypeScript types included · Works in Node.js and the browser

```bash
npm install nigeria-paye
```

```js
import { payeSummary } from "nigeria-paye";

const pay = payeSummary(1_000_000, { annualRent: 2_400_000 });

pay.paye.monthly;                  // 140900   PAYE per month
pay.net;                           // 779100   take-home pay per month
pay.effectiveTaxRate;              // 14.09    % of gross
pay.comparison.monthlySaving;      // 10566.67 more kept per month than under the old law
pay.employerTotalCost;             // 1120000  gross + employer pension, NSITF, ITF
```

## What it covers

**Nigeria Tax Act 2025 bands** (annual chargeable income):

| Band | Rate |
|---|---|
| First ₦800,000 | 0% |
| Next ₦2,200,000 | 15% |
| Next ₦9,000,000 | 18% |
| Next ₦13,000,000 | 21% |
| Next ₦25,000,000 | 23% |
| Above ₦50,000,000 | 25% |

- **Reliefs:** employee pension (8%), National Housing Fund (2.5% of basic), health insurance (NHIS), and rent relief (20% of annual rent, up to ₦500,000), all deducted before tax.
- **Employer costs:** pension (10%), NSITF (1%), ITF (1%).
- **Old law comparison:** Personal Income Tax Act with consolidated relief allowance, old bands (7%–24%), minimum tax and the minimum-wage exemption.

## API

All amounts are in naira. Salary inputs are **monthly**.

### `payeSummary(grossMonthly, options?)`
Everything at once: the payroll result below plus `paye` (monthly, annual), `comparison` (old vs new law) and `bands` (how the income falls into each band).

### `computeNigerianPayroll(grossMonthly, options?)`
One employee's month: `deductions`, `net` (take-home), `employerCosts`, `employerTotalCost`, `chargeableAnnual`, `rentRelief`, `effectiveTaxRate`.

### Options
| Option | Default | Meaning |
|---|---|---|
| `pensionable` | gross | Monthly basic + housing + transport, for pension |
| `basic` | pensionable | Monthly basic salary, for NHF |
| `annualRent` | 0 | Rent paid per year, for rent relief |
| `nhf` | `false` | Employee contributes to the National Housing Fund |
| `nhis` | 0 | Monthly health insurance contribution |
| `pension` | `true` | `false` to leave out pension |

### Lower-level helpers
- `annualPaye(chargeableAnnual)`: tax on annual chargeable income
- `bandBreakdown(taxable, bands?)`: per-band income and tax
- `oldLawMonthlyPaye(grossMonthly, reliefsMonthly?)`: monthly PAYE under the old law
- `PAYE_BANDS`, `OLD_PITA_BANDS`: the band tables

## No code? Use the free API or calculator

- **Calculator:** [orionsoftlimited.com/paye-calculator](https://www.orionsoftlimited.com/paye-calculator), which can also be embedded on any website
- **Hosted JSON API (no key):** `GET https://www.orionsoftlimited.com/api/public/paye?salary=500000`. Docs at [orionsoftlimited.com/developers](https://www.orionsoftlimited.com/developers)

## Accuracy

Results are estimates for salaried employees based on the published rates and reliefs. They are not tax advice: actual PAYE can differ with other income, allowances taxed differently, or other reliefs. Found a difference from your state IRS figures? Please [open an issue](https://github.com/orionsoftlimited/nigeria-paye/issues).

## About

Built and maintained by [Orion Soft Limited](https://www.orionsoftlimited.com), a Lagos software company. Running payroll for a whole company (payslips, pension and PAYE schedules, approvals)? See our [HR & payroll software](https://www.orionsoftlimited.com/hrcore).

MIT License
