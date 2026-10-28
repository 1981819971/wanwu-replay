import './colophon.css';

const LINKS = [
  { k: 'GitHub', v: 'github.com/1981819971', href: 'https://github.com/1981819971' },
  { k: 'Email', v: '1981819971@qq.com', href: 'mailto:1981819971@qq.com' },
  { k: 'Resume', v: '黄盛田 · PDF', href: '/resume.pdf' },
];

export default function S05_Colophon() {
  return (
    <footer className="col" id="colophon">
      <div className="col-inner">
        <div className="col-rule" />

        <h2 className="col-title serif-h">万物有声</h2>
        <p className="col-en mono">EVERYTHING HAS A VOICE</p>

        <p className="col-line">
          这一页里，那支片子和它的引擎是同一份代码。
          <br />
          引擎不动，换一个驱动给它，它就换一种活法。
        </p>

        <p className="col-sign">
          黄盛田 · 南开大学软件学院
        </p>

        <div className="col-links">
          {LINKS.map((l) => (
            <a key={l.k} href={l.href} className="col-link" target="_blank" rel="noreferrer">
              <span className="mono col-link-k">{l.k}</span>
              <span className="col-link-v">{l.v}</span>
            </a>
          ))}
        </div>

        <div className="col-foot">
          <span className="mono">ONETAKE · OTK-7F3E1C</span>
          <span className="mono">22.50 S / 1920×1080 / 60 FPS</span>
          <button
            className="col-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="mono">回到 00:00.00</span>
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
              <path d="M6 13V2M1.5 6.5L6 2l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
