/** [band width in naira (Infinity for the top band), rate as a fraction] */
export type TaxBand = [number, number];

/** Nigeria Tax Act 2025 annual PAYE bands, applied in order. */
export const PAYE_BANDS: TaxBand[];
/** Old Personal Income Tax Act bands (to 31 December 2025). */
export const OLD_PITA_BANDS: TaxBand[];

export interface PayrollOptions {
  /** Monthly basic + housing + transport, for pension. Defaults to gross. */
  pensionable?: number;
  /** Monthly basic salary, for NHF. Defaults to pensionable. */
  basic?: number;
  /** Rent the employee pays per year, for rent relief (20%, max ₦500,000). */
  annualRent?: number;
  /** True if the employee contributes 2.5% to the National Housing Fund. */
  nhf?: boolean;
  /** Monthly health insurance (NHIS) contribution by the employee. */
  nhis?: number;
  /** False to leave out pension (e.g. exempt employers). Default true. */
  pension?: boolean;
}

export interface LineItem { label: string; amount: number; kind: string; }

export interface PayrollResult {
  gross: number;
  pensionable: number;
  chargeableAnnual: number;
  rentRelief: number;
  /** PAYE as a percentage of gross pay. */
  effectiveTaxRate: number;
  /** Monthly deductions from the employee's pay (PAYE, pension, NHF, NHIS). */
  deductions: LineItem[];
  /** Monthly employer costs on top of gross (pension 10%, NSITF 1%, ITF 1%). */
  employerCosts: LineItem[];
  totalDeductions: number;
  /** Monthly take-home pay. */
  net: number;
  employerTotalCost: number;
}

export interface BandRow { width: number; rate: number; slice: number; tax: number; }

export interface PayeSummary extends PayrollResult {
  paye: { monthly: number; annual: number };
  comparison: { oldLawMonthly: number; newLawMonthly: number; monthlySaving: number; annualSaving: number };
  /** Bands the employee's chargeable income falls into. */
  bands: BandRow[];
}

/** Annual PAYE on annual chargeable income under the Nigeria Tax Act 2025. */
export function annualPaye(chargeable: number): number;
/** Monthly payroll for one employee: deductions, take-home pay and employer cost. */
export function computeNigerianPayroll(grossMonthly: number, opts?: PayrollOptions): PayrollResult;
/** How much of `taxable` falls in each band and the tax on it. */
export function bandBreakdown(taxable: number, bands?: TaxBand[]): BandRow[];
/** Monthly PAYE under the old Personal Income Tax Act, for comparisons. */
export function oldLawMonthlyPaye(grossMonthly: number, reliefsMonthly?: number): number;
/** Payroll result plus new vs old law comparison and band breakdown. */
export function payeSummary(grossMonthly: number, opts?: PayrollOptions): PayeSummary;
