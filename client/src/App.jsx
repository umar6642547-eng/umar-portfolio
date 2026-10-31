import { useEffect, useState } from 'react';
import Samples from './components/Samples.jsx';
import Contact from './components/Contact.jsx';
import { WhatsAppIcon } from './components/Icons.jsx';
import { waLink } from './links.js';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/portfolio', { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch((e) => { if (e.name !== 'AbortError') setError('Could not load the portfolio. Please refresh the page.'); });
    return () => ctrl.abort();
  }, []);

  if (error) return <div className="wrap"><p className="status" role="alert">{error}</p></div>;
  if (!data) return <div className="wrap"><p className="status" role="status">Loading portfolio…</p></div>;

  const { profile, areas, skills, samples, experience } = data;
  return (
    <div className="wrap">
      <header className="hero">
        <p className="eyebrow">{profile.eyebrow}</p>
        <h1>{profile.name}</h1><br />
        <p className="role">{profile.role}</p><br />
        <p className="lede">{profile.lede}</p>
        <div className="actions">
          <a className="btn primary" href="#samples">See work samples</a>
          <a className="btn ghost" href="#contact">Contact</a>
<a className="btn ghost" href="/Umar_Farooq_Resume.pdf" download>Download resume</a>        </div>
      </header>

      <main>
        <section id="about">
          <h2>What I handle</h2>
          <div className="areas">
            {areas.map((a) => (
              <div className="area" key={a.title}><h3>{a.title}</h3><p>{a.text}</p></div>
            ))}
          </div>
          <div className="chips" aria-label="Tools and skills">
            {skills.map((s) => <span key={s.label} className={s.soft ? 'chip soft' : 'chip'}>{s.label}</span>)}
          </div>
        </section>

        <Samples samples={samples} />

        <section id="experience">
          <h2>Experience &amp; education</h2>
          <div className="timeline">
            {experience.map((e) => (
              <div className="entry" key={e.title + e.when}>
                <div className="when">{e.when}</div>
                <div>
                  <h3>{e.title}</h3>
                  <p className="org">{e.org}</p>
                  {e.points && <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Contact contact={profile.contact} />
      </main>
      <footer>{profile.name} · Accountant portfolio</footer>
      <a className="wa-float" href={waLink(profile.contact.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
