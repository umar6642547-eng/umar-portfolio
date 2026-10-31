import { useState } from 'react';
import { WhatsAppIcon, MailIcon, DownloadIcon } from './Icons.jsx';
import { waLink, mailLink } from '../links.js';

function CopyRow({ label, value }) {
  const [text, setText] = useState('Copy');
  async function copy() {
    try { await navigator.clipboard.writeText(value); setText('Copied'); }
    catch { setText('Select & copy'); }
    setTimeout(() => setText('Copy'), 1800);
  }
  return (
    <div className="row">
      <span className="label">{label}</span>
      <span className="val">{value}</span>
      <button className="copy" type="button" onClick={copy} aria-label={`Copy ${label}`}>{text}</button>
    </div>
  );
}

export default function Contact({ contact }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [state, setState] = useState({ status: 'idle', errors: {}, note: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'sending', errors: {}, note: '' });
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        setForm({ name: '', email: '', message: '', website: '' });
        return setState({ status: 'sent', errors: {}, note: 'Thank you. Your message was sent.' });
      }
      if (r.status === 503) return setState({ status: 'error', errors: {}, note: 'The form is not active yet. Please use WhatsApp or Email above.' });
      setState({ status: 'error', errors: j.errors || {}, note: j.error || (j.errors ? 'Please fix the highlighted fields.' : 'Something went wrong.') });
    } catch {
      setState({ status: 'error', errors: {}, note: 'Network error. Please try again or email directly.' });
    }
  }

  const { errors } = state;
  return (
    <section id="contact">
      <div className="contact">
        <h2>Contact</h2>
        <p>I would like to bring the same accuracy and organisation to your finance team. References and an experience letter from Design Solutions are available on request.</p>
        <div className="cta-row">
          <a className="cbtn" href={waLink(contact.whatsapp)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={20} /> WhatsApp</a>
          <a className="cbtn" href={mailLink(contact.email)}><MailIcon /> Email me</a>
          <a className="cbtn" href={contact.resumeUrl} download><DownloadIcon /> Resume</a>
        </div>
        <CopyRow label="Phone" value={contact.phone} />
        <CopyRow label="Email" value={contact.email} />
        <div className="row"><span className="label">Based in</span><span className="val">{contact.location}</span></div>

        <form className="form" onSubmit={submit} noValidate>
          <label>Name
            <input value={form.name} onChange={set('name')} autoComplete="name" required aria-invalid={Boolean(errors.name)} />
            {errors.name && <span className="err" role="alert">{errors.name}</span>}
          </label>
          <label>Email
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required aria-invalid={Boolean(errors.email)} />
            {errors.email && <span className="err" role="alert">{errors.email}</span>}
          </label>
          <label>Message
            <textarea value={form.message} onChange={set('message')} required aria-invalid={Boolean(errors.message)} />
            {errors.message && <span className="err" role="alert">{errors.message}</span>}
          </label>
          <div className="hp" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
          </div>
          <button className="send" type="submit" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Sending…' : 'Send message'}</button>
          {state.note && <p className="note" role={state.status === 'error' ? 'alert' : 'status'}>{state.note}</p>}
        </form>
      </div>
    </section>
  );
}
