import { useRaf } from '../hooks/useScroll';
import { useRef } from 'react';
import './overture.css';

const DUR = 22.5;

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, '0')}:${s.toFixed(2).padStart(5, '0')}`;
}

export default function S00_Overture() {
  const tcRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useRaf(() => {
    const vh = window.innerHeight;
    const k = Math.min(1, Math.max(0, window.scrollY / (vh * 0.92)));
    const t = k * 2.4;
    if (tcRef.current) tcRef.current.textContent = fmt(t);
    if (lineRef.current) lineRef.current.style.transform = `scaleX(${(t / DUR).toFixed(4)})`;
  });

  return (
    <header className="overt">
      <div className="overt-corner tl" />
      <div className="overt-corner tr" />
      <div className="overt-corner bl" />
      <div className="overt-corner br" />

      <div className="overt-top">
        <div className="overt-brand">
          <span className="serif-h overt-cn">万物有声</span>
          <span className="eyebrow overt-sub">可回放 · REPLAY</span>
        </div>
        <div className="eyebrow overt-right">ONETAKE ENGINE / OTK-7F3E1C</div>
      </div>

      <div className="overt-mid">
        <div className="overt-tcwrap">
          <span className="mono overt-tc" ref={tcRef}>00:00.00</span>
          <span className="overt-tcline"><span ref={lineRef} /></span>
        </div>
        <p className="overt-claim serif-h">
          <span>一支 22.5 秒的一镜到底片子，</span>
          <span>和一段能被你<em>倒着滚回去</em>的代码。</span>
        </p>
      </div>

      <div className="overt-foot">
        <div className="overt-hint">
          <svg width="13" height="22" viewBox="0 0 13 22" aria-hidden="true">
            <path d="M6.5 1v18M1.5 14.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          <span className="eyebrow">向下 = 播放</span>
        </div>
        <div className="eyebrow overt-spec">1920 × 1080 · 60 FPS · 22.50 S · 3808 CELLS</div>
      </div>
    </header>
  );
}
