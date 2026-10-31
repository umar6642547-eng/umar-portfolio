import { bhd, withVat, payroll, profitAndLoss } from '../lib/finance.js';

export function buildPortfolio() {
  const invoice = withVat(
    [
      { description: 'Banner printing', qty: 2, unit: bhd(15) },
      { description: 'Custom signboard', qty: 1, unit: bhd(120) },
      { description: 'Vinyl stickers', qty: 10, unit: bhd(2.5) },
    ],
    10,
  );

  const quotation = withVat(
    [
      { description: 'Shop signboard: design and fabrication', qty: 1, unit: bhd(250) },
      { description: 'LED lighting', qty: 1, unit: bhd(60) },
      { description: 'Installation', qty: 1, unit: bhd(40) },
    ],
    10,
  );

  const received = invoice.total;
  const receipt = { receivedFrom: 'Sample Client Co.', against: 'INV-0001', method: 'Cash', received, balance: invoice.total - received };

  const pay = payroll([
    { name: 'Employee A', basic: bhd(300), otHours: 10, otRate: bhd(1.5), deductions: 0 },
    { name: 'Employee B', basic: bhd(250), otHours: 8, otRate: bhd(1.25), deductions: bhd(5) },
    { name: 'Employee C', basic: bhd(200), otHours: 12, otRate: bhd(1), deductions: 0 },
  ]);

  const pnl = profitAndLoss({
    revenue: [
      { item: 'Signboards', amount: bhd(3200) },
      { item: 'Banner printing', amount: bhd(1800) },
      { item: 'Design services', amount: bhd(700) },
    ],
    costOfSales: [
      { item: 'Materials', amount: bhd(1900) },
      { item: 'Outsourced printing', amount: bhd(600) },
    ],
    operatingExpenses: [
      { item: 'Salaries and overtime (from payroll sheet)', amount: pay.totals.net },
      { item: 'Rent', amount: bhd(400) },
      { item: 'Utilities', amount: bhd(120) },
      { item: 'Transport', amount: bhd(90) },
      { item: 'Miscellaneous', amount: bhd(108) },
    ],
  });

  return {
    profile: {
      name: 'Muhammad Umar Farooq',
      eyebrow: 'Accounts & finance portfolio',
      role: 'Accountant · Invoicing · Payroll · Profit & Loss',
      lede: 'Two years running the full finance and accounts function of a company: quotations, invoices, receipts, salaries, overtime and monthly profit and loss. I work in Invoice Home and Excel, keep tidy records, and am ready to relocate to Bahrain.',
      contact: { phone: '+92 349 6642547', email: 'umar6642547@gmail.com', location: 'Narowal, Pakistan' },
    },
    areas: [
      { title: 'Billing', text: 'Quotations, invoices and receipts in Invoice Home, with payment follow-up.' },
      { title: 'Payroll', text: 'Monthly salaries, overtime calculation and salary records.' },
      { title: 'Bookkeeping', text: 'Income and expense records, supporting documents, organised files.' },
      { title: 'Reporting', text: 'Profit and loss statements and summaries for management.' },
    ],
    skills: [
      { label: 'Invoice Home' }, { label: 'Microsoft Excel' }, { label: 'Microsoft Office' },
      { label: 'Learning: Odoo ERP', soft: true }, { label: 'Learning: Microsoft Dynamics', soft: true },
    ],
    samples: {
      currency: 'BHD',
      invoice: { no: 'INV-0001', date: '01 Nov 2026', billTo: 'Sample Client Co., Manama', terms: '14 days', ...invoice },
      quotation: { no: 'QTN-0001', for: 'Sample Client Co., Manama', valid: '14 days from issue', ...quotation },
      receipt: { no: 'RCT-0001', date: '10 Nov 2026', ...receipt },
      payroll: { month: 'November 2026', ...pay },
      pnl: { company: 'Sample Company', month: 'November 2026', ...pnl },
    },
    experience: [
      {
        when: '2024 – Present', title: 'Accountant', org: 'Design Solutions · Faisalabad, Pakistan',
        points: [
          'Managed the end-to-end finance and accounts system of the company.',
          'Created and issued invoices, quotations and receipts in Invoice Home.',
          'Processed monthly payroll and overtime, and kept salary records.',
          'Prepared profit and loss statements and tracked income, expenses and cash flow.',
        ],
      },
      { when: 'Jan – Mar 2026', title: 'Cyber Security Intern (Remote)', org: 'Arch Technologies · Islamabad, Pakistan' },
      { when: '2022 – 2026', title: 'B.S. Software Engineering', org: 'NUML, Faisalabad Campus · CGPA 3.37' },
      { when: 'May 2026', title: 'Cisco Certified Support Technician', org: 'Cisco · CCST' },
    ],
  };
}
