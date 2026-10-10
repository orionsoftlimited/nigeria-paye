import { test } from "node:test";
import assert from "node:assert/strict";
import { annualPaye, computeNigerianPayroll, payeSummary, oldLawMonthlyPaye, bandBreakdown, PAYE_BANDS } from "../index.js";

test("first ₦800,000 of chargeable income is tax-free", () => {
  assert.equal(annualPaye(800_000), 0);
  assert.equal(annualPaye(0), 0);
});

test("bands apply in order", () => {
  // 0 on 800k + 15% of 2.2m = 330,000
  assert.equal(annualPaye(3_000_000), 330_000);
  // + 18% of 9m = 1,620,000 → 1,950,000
  assert.equal(annualPaye(12_000_000), 1_950_000);
  // top band: everything above ₦50m at 25%
  const at50m = annualPaye(50_000_000);
  assert.equal(annualPaye(51_000_000) - at50m, 250_000);
});

test("₦1m a month with ₦2.4m rent: PAYE ₦140,900, take-home ₦779,100", () => {
  const r = computeNigerianPayroll(1_000_000, { annualRent: 2_400_000 });
  assert.equal(r.rentRelief, 480_000);
  assert.equal(r.chargeableAnnual, 10_560_000);
  assert.equal(r.deductions.find(d => d.kind === "paye").amount, 140_900);
  assert.equal(r.net, 779_100);
});

test("rent relief is capped at ₦500,000", () => {
  assert.equal(computeNigerianPayroll(1_000_000, { annualRent: 10_000_000 }).rentRelief, 500_000);
});

test("pension can be switched off; NHF is 2.5% of basic", () => {
  const r = computeNigerianPayroll(400_000, { pension: false, nhf: true, basic: 200_000 });
  assert.equal(r.deductions.some(d => d.kind === "pension"), false);
  assert.equal(r.deductions.find(d => d.kind === "nhf").amount, 5_000);
});

test("employer cost adds 10% pension, 1% NSITF and 1% ITF", () => {
  assert.equal(computeNigerianPayroll(100_000).employerTotalCost, 112_000);
});

test("old-law comparison", () => {
  const s = payeSummary(1_000_000, { annualRent: 2_400_000 });
  assert.equal(Math.round(s.comparison.oldLawMonthly), 151_467);
  assert.equal(Math.round(s.comparison.monthlySaving), 10_567);
  assert.equal(oldLawMonthlyPaye(70_000), 0, "minimum-wage earners were exempt");
});

test("band breakdown adds up to the PAYE", () => {
  const rows = bandBreakdown(10_560_000, PAYE_BANDS);
  assert.equal(rows.reduce((s, b) => s + b.tax, 0), annualPaye(10_560_000));
});

test("bad input is treated as zero, never NaN", () => {
  const r = computeNigerianPayroll("abc");
  assert.equal(r.net, 0);
  assert.equal(Number.isNaN(r.effectiveTaxRate), false);
});
