// Regression: the MERN version must reproduce every figure in the original HTML portfolio.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPortfolio } from '../server/data/portfolio.js';
import { bhd, fmt } from '../server/lib/finance.js';

const { samples, profile, experience } = buildPortfolio();

test('invoice matches original: 175.000 / 17.500 / 192.500', () => {
  const i = samples.invoice;
  assert.deepEqual(i.lines.map((l) => fmt(l.amount)), ['30.000', '120.000', '25.000']);
  assert.equal(fmt(i.subtotal), '175.000');
  assert.equal(fmt(i.vat), '17.500');
  assert.equal(fmt(i.total), '192.500');
});

test('quotation matches original: 350.000 / 35.000 / 385.000', () => {
  const q = samples.quotation;
  assert.equal(fmt(q.subtotal), '350.000');
  assert.equal(fmt(q.vat), '35.000');
  assert.equal(fmt(q.total), '385.000');
});

test('receipt settles invoice in full', () => {
  assert.equal(samples.receipt.received, samples.invoice.total);
  assert.equal(samples.receipt.balance, 0);
  assert.equal(samples.receipt.against, samples.invoice.no);
});

test('payroll matches original totals', () => {
  const t = samples.payroll.totals;
  assert.equal(fmt(t.basic), '750.000');
  assert.equal(t.otHours, 30);
  assert.equal(fmt(t.otAmount), '37.000');
  assert.equal(fmt(t.gross), '787.000');
  assert.equal(fmt(t.deductions), '5.000');
  assert.equal(fmt(t.net), '782.000');
  assert.deepEqual(samples.payroll.rows.map((r) => fmt(r.net)), ['315.000', '255.000', '212.000']);
});

test('P&L matches original and pulls salaries from payroll', () => {
  const p = samples.pnl;
  assert.equal(fmt(p.revenue.total), '5,700.000');
  assert.equal(fmt(p.costOfSales.total), '2,500.000');
  assert.equal(fmt(p.grossProfit), '3,200.000');
  assert.equal(fmt(p.operatingExpenses.total), '1,500.000');
  assert.equal(fmt(p.netProfit), '1,700.000');
  assert.equal(p.marginPct, 29.8);
  assert.equal(p.operatingExpenses.lines[0].amount, samples.payroll.totals.net);
});

test('profile and experience content is intact', () => {
  assert.equal(profile.name, 'Muhammad Umar Farooq');
  assert.equal(profile.contact.email, 'umar6642547@gmail.com');
  assert.equal(experience.length, 4);
  assert.equal(experience[0].points.length, 4);
  assert.equal(bhd(1), 1000);
});
