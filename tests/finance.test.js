import test from 'node:test';
import assert from 'node:assert/strict';
import { bhd, fmt, withVat, payroll, profitAndLoss } from '../server/lib/finance.js';

test('bhd converts to integer thousandths without float drift', () => {
  assert.equal(bhd(2.5), 2500);
  assert.equal(bhd(0.1) + bhd(0.2), bhd(0.3));
  assert.equal(bhd(1.005), 1005);
});

test('fmt formats with 3 decimals and thousands separators', () => {
  assert.equal(fmt(0), '0.000');
  assert.equal(fmt(192500), '192.500');
  assert.equal(fmt(3200000), '3,200.000');
  assert.equal(fmt(-1250), '-1.250');
  assert.equal(fmt(5), '0.005');
  assert.equal(fmt(1234567890), '1,234,567.890');
});

test('withVat computes subtotal, VAT and total', () => {
  const r = withVat([{ qty: 2, unit: bhd(15) }, { qty: 1, unit: bhd(120) }, { qty: 10, unit: bhd(2.5) }], 10);
  assert.equal(r.subtotal, bhd(175));
  assert.equal(r.vat, bhd(17.5));
  assert.equal(r.total, bhd(192.5));
});

test('withVat handles empty items and 0% VAT', () => {
  assert.deepEqual(withVat([], 10), { lines: [], subtotal: 0, vatRatePct: 10, vat: 0, total: 0 });
  assert.equal(withVat([{ qty: 3, unit: 1000 }], 0).total, 3000);
});

test('payroll: OT = hours x rate, gross = basic + OT, net = gross - deductions', () => {
  const { rows, totals } = payroll([
    { name: 'B', basic: bhd(250), otHours: 8, otRate: bhd(1.25), deductions: bhd(5) },
  ]);
  assert.equal(rows[0].otAmount, bhd(10));
  assert.equal(rows[0].gross, bhd(260));
  assert.equal(rows[0].net, bhd(255));
  assert.equal(totals.net, bhd(255));
});

test('profitAndLoss: gross, net and margin', () => {
  const r = profitAndLoss({
    revenue: [{ amount: 1000 }],
    costOfSales: [{ amount: 400 }],
    operatingExpenses: [{ amount: 100 }],
  });
  assert.equal(r.grossProfit, 600);
  assert.equal(r.netProfit, 500);
  assert.equal(r.marginPct, 50);
});

test('profitAndLoss: zero revenue gives 0% margin, not NaN/Infinity', () => {
  const r = profitAndLoss({ revenue: [], costOfSales: [], operatingExpenses: [{ amount: 50 }] });
  assert.equal(r.marginPct, 0);
  assert.equal(r.netProfit, -50);
});
