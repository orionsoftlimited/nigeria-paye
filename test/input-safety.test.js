import { test } from "node:test";
import assert from "node:assert/strict";
import { annualPaye, computeNigerianPayroll, oldLawMonthlyPaye, payeSummary } from "../index.js";
test("non-finite and unsafe monetary inputs never produce NaN or infinite payroll", () => {
  for (const value of [Infinity, -Infinity, "Infinity", "NaN", NaN, Number.MAX_VALUE, Symbol("invalid")]) {
    const result = computeNigerianPayroll(value);
    assert.equal(result.gross, 0);
    assert.equal(result.net, 0);
    assert.equal(annualPaye(value), 0);
    assert.equal(oldLawMonthlyPaye(value), 0);
  }
});
test("null options and invalid relief amounts are handled consistently", () => {
  assert.deepEqual(computeNigerianPayroll(100000, null), computeNigerianPayroll(100000));
  const result = payeSummary(100000, { annualRent: Infinity, nhis: Infinity });
  assert.ok(Number.isFinite(result.net));
  assert.equal(result.rentRelief, 0);
  assert.ok(result.deductions.every(d => Number.isFinite(d.amount)));
});
