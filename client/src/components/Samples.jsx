import { useRef, useState } from 'react';
import { fmt } from '../money.js';

const Tag = () => <span className="tag">SAMPLE · DUMMY DATA</span>;
const N = ({ v }) => <td className="n">{fmt(v)}</td>;

function Invoice({ d }) {
  return (
    <>
      <Tag />
      <div className="doc-head">
        <h3 className="doc-title">INVOICE</h3>
        <p className="meta"><b>No:</b> {d.no}<br /><b>Date:</b> {d.date}<br /><b>Bill to:</b> {d.billTo}<br /><b>Terms:</b> {d.terms}</p>
      </div>
      <div className="scroll"><table>
        <thead><tr><th>Description</th><th className="n">Qty</th><th className="n">Unit (BHD)</th><th className="n">Amount (BHD)</th></tr></thead>
        <tbody>
          {d.lines.map((l) => <tr key={l.description}><td>{l.description}</td><td className="n">{l.qty}</td><N v={l.unit} /><N v={l.amount} /></tr>)}
          <tr><td>Subtotal</td><td></td><td></td><N v={d.subtotal} /></tr>
          <tr><td>VAT {d.vatRatePct}%</td><td></td><td></td><N v={d.vat} /></tr>
          <tr className="big"><td>Total due</td><td></td><td></td><N v={d.total} /></tr>
        </tbody>
      </table></div>
      <p className="how">Method: <code>Amount = Qty × Unit price</code>, <code>VAT = Subtotal × {d.vatRatePct}%</code>.</p>
    </>
  );
}

function Quotation({ d }) {
  return (
    <>
      <Tag />
      <div className="doc-head">
        <h3 className="doc-title">QUOTATION</h3>
        <p className="meta"><b>No:</b> {d.no}<br /><b>For:</b> {d.for}<br /><b>Valid:</b> {d.valid}</p>
      </div>
      <div className="scroll"><table>
        <thead><tr><th>Item</th><th className="n">Qty</th><th className="n">Amount (BHD)</th></tr></thead>
        <tbody>
          {d.lines.map((l) => <tr key={l.description}><td>{l.description}</td><td className="n">{l.qty}</td><N v={l.amount} /></tr>)}
          <tr><td>Subtotal</td><td></td><N v={d.subtotal} /></tr>
          <tr><td>VAT {d.vatRatePct}%</td><td></td><N v={d.vat} /></tr>
          <tr className="big"><td>Total</td><td></td><N v={d.total} /></tr>
        </tbody>
      </table></div>
    </>
  );
}

function Receipt({ d }) {
  return (
    <>
      <Tag />
      <div className="doc-head">
        <h3 className="doc-title">PAYMENT RECEIPT</h3>
        <p className="meta"><b>No:</b> {d.no}<br /><b>Date:</b> {d.date}</p>
      </div>
      <div className="scroll"><table>
        <tbody>
          <tr><td>Received from</td><td>{d.receivedFrom}</td></tr>
          <tr><td>Against</td><td>Invoice {d.against}</td></tr>
          <tr><td>Payment method</td><td>{d.method}</td></tr>
          <tr><td>Amount received</td><td className="n">BHD {fmt(d.received)}</td></tr>
          <tr className="big"><td>Balance due</td><td className="n">BHD {fmt(d.balance)}{d.balance === 0 ? ' · paid in full' : ''}</td></tr>
        </tbody>
      </table></div>
    </>
  );
}

function Payroll({ d }) {
  const t = d.totals;
  return (
    <>
      <Tag />
      <div className="doc-head">
        <h3 className="doc-title">PAYROLL &amp; OVERTIME</h3>
        <p className="meta"><b>Month:</b> {d.month}<br /><b>Currency:</b> BHD</p>
      </div>
      <div className="scroll"><table style={{ minWidth: 680 }}>
        <thead><tr><th>Employee</th><th className="n">Basic</th><th className="n">OT hrs</th><th className="n">OT rate</th><th className="n">OT amt</th><th className="n">Gross</th><th className="n">Deduct.</th><th className="n">Net pay</th></tr></thead>
        <tbody>
          {d.rows.map((r) => (
            <tr key={r.name}><td>{r.name}</td><N v={r.basic} /><td className="n">{r.otHours}</td><N v={r.otRate} /><N v={r.otAmount} /><N v={r.gross} /><N v={r.deductions} /><N v={r.net} /></tr>
          ))}
          <tr className="sum"><td>Total</td><N v={t.basic} /><td className="n">{t.otHours}</td><td className="n"></td><N v={t.otAmount} /><N v={t.gross} /><N v={t.deductions} /><N v={t.net} /></tr>
        </tbody>
      </table></div>
      <p className="how">Method: <code>OT amount = OT hours × OT rate</code>, <code>Gross = Basic + OT amount</code>, <code>Net = Gross − Deductions</code>.</p>
    </>
  );
}

function PnL({ d }) {
  const Group = ({ title, block, totalLabel }) => (
    <>
      <tr className="grp"><td colSpan="2">{title}</td></tr>
      {block.lines.map((l) => <tr key={l.item}><td>{l.item}</td><N v={l.amount} /></tr>)}
      <tr className="sum"><td>{totalLabel}</td><N v={block.total} /></tr>
    </>
  );
  return (
    <>
      <Tag />
      <div className="doc-head">
        <h3 className="doc-title">PROFIT &amp; LOSS</h3>
        <p className="meta"><b>Company:</b> {d.company}<br /><b>Month:</b> {d.month} · BHD</p>
      </div>
      <div className="scroll"><table>
        <thead><tr><th>Item</th><th className="n">Amount (BHD)</th></tr></thead>
        <tbody>
          <Group title="Revenue" block={d.revenue} totalLabel="Total revenue" />
          <Group title="Cost of sales" block={d.costOfSales} totalLabel="Total cost of sales" />
          <tr className="sum"><td>Gross profit</td><N v={d.grossProfit} /></tr>
          <Group title="Operating expenses" block={d.operatingExpenses} totalLabel="Total operating expenses" />
          <tr className="big"><td>Net profit</td><N v={d.netProfit} /></tr>
        </tbody>
      </table></div>
      <p className="how">Net margin {d.marginPct.toFixed(1)}% of revenue. <code>Gross profit = Revenue − Cost of sales</code>, <code>Net profit = Gross profit − Operating expenses</code>.</p>
    </>
  );
}

const TABS = [
  { id: 'invoice', label: 'Invoice', View: Invoice },
  { id: 'quotation', label: 'Quotation', View: Quotation },
  { id: 'receipt', label: 'Receipt', View: Receipt },
  { id: 'payroll', label: 'Payroll', View: Payroll },
  { id: 'pnl', label: 'Profit & Loss', View: PnL },
];

export default function Samples({ samples }) {
  const [active, setActive] = useState(TABS[0].id);
  const refs = useRef({});

  function onKeyDown(e, i) {
    const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : null;
    if (j === null) return;
    e.preventDefault();
    const next = TABS[(j + TABS.length) % TABS.length];
    setActive(next.id);
    refs.current[next.id]?.focus();
  }

  return (
    <section id="samples">
      <h2>Work samples</h2>
      <div className="tabs" role="tablist" aria-label="Sample documents">
        {TABS.map((t, i) => (
          <button
            key={t.id} ref={(el) => (refs.current[t.id] = el)} type="button" className="tab" role="tab"
            id={`t-${t.id}`} aria-controls={`p-${t.id}`} aria-selected={active === t.id}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)} onKeyDown={(e) => onKeyDown(e, i)}
          >{t.label}</button>
        ))}
      </div>
      {TABS.map(({ id, View }) => (
        <div key={id} className="doc" role="tabpanel" id={`p-${id}`} aria-labelledby={`t-${id}`} hidden={active !== id}>
          {active === id && <View d={samples[id]} />}
        </div>
      ))}
      <p className="how" style={{ marginTop: 14 }}>All five samples use fictional clients and figures to show format and method. They are not records from any employer.</p>
    </section>
  );
}
