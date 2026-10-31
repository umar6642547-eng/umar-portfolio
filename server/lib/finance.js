// All money is stored as integer thousandths of a dinar (BHD has 3 decimals).
// This avoids floating point errors such as 0.1 + 0.2 !== 0.3.

export const bhd = (value) => Math.round(value * 1000);

export function fmt(milli) {
  const sign = milli < 0 ? '-' : '';
  const abs = Math.abs(milli);
  const whole = Math.floor(abs / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const frac = String(abs % 1000).padStart(3, '0');
  return `${sign}${whole}.${frac}`;
}

const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0);

export function priceLines(items) {
  const lines = items.map((i) => ({ ...i, amount: i.qty * i.unit }));
  return { lines, subtotal: sum(lines, (l) => l.amount) };
}

export function withVat(items, vatRatePct) {
  const { lines, subtotal } = priceLines(items);
  const vat = Math.round((subtotal * vatRatePct) / 100);
  return { lines, subtotal, vatRatePct, vat, total: subtotal + vat };
}

export function payroll(employees) {
  const rows = employees.map((e) => {
    const otAmount = Math.round(e.otHours * e.otRate);
    const gross = e.basic + otAmount;
    return { ...e, otAmount, gross, net: gross - e.deductions };
  });
  const totals = {
    basic: sum(rows, (r) => r.basic),
    otHours: sum(rows, (r) => r.otHours),
    otAmount: sum(rows, (r) => r.otAmount),
    gross: sum(rows, (r) => r.gross),
    deductions: sum(rows, (r) => r.deductions),
    net: sum(rows, (r) => r.net),
  };
  return { rows, totals };
}

export function profitAndLoss({ revenue, costOfSales, operatingExpenses }) {
  const rev = sum(revenue, (l) => l.amount);
  const cos = sum(costOfSales, (l) => l.amount);
  const opex = sum(operatingExpenses, (l) => l.amount);
  const grossProfit = rev - cos;
  const netProfit = grossProfit - opex;
  const marginPct = rev === 0 ? 0 : Math.round((netProfit * 1000) / rev) / 10;
  return {
    revenue: { lines: revenue, total: rev },
    costOfSales: { lines: costOfSales, total: cos },
    grossProfit,
    operatingExpenses: { lines: operatingExpenses, total: opex },
    netProfit,
    marginPct,
  };
}
