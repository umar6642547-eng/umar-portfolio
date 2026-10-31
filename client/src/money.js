// Mirror of server/lib/finance.js fmt(): integer thousandths -> "1,234.500"
export function fmt(milli) {
  const sign = milli < 0 ? '-' : '';
  const abs = Math.abs(milli);
  const whole = Math.floor(abs / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${whole}.${String(abs % 1000).padStart(3, '0')}`;
}
