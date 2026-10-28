import { useEffect, useRef, useState } from 'react';
import { useRaf } from '../hooks/useScroll';
import './film.css';

const DUR = 22.5;

const ACTS = [
  { i: 'I', cn: '剥开', t0: 0.0, t1: 4.16, sub: '一张卡，一层层剥开' },
  { i: 'II', cn: '传导', t0: 4.16, t1: 7.55, sub: '情绪会传导和放大，凡事都会' },
  { i: 'III', cn: '累加', t0: 7.55, t1: 13.4, sub: '一只蝴蝶扇动翅膀，因果层层累加' },
  { i: 'IV', cn: '乘风', t0: 13.4, t1: 17.6, sub: 'Be wind, my friend.' },
  { i: 'V', cn: '辽阔', t0: 17.6, t1: 22.5, sub: '生命辽阔，你要乘风雄赳赳' },
];

const OPEN = 0.06;   // 幕布拉开占的滚动比例
const CLOSE = 0.94;  // 幕布合上

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, '0')}:${s.toFixed(2).padStart(5, '0')}`;
}

export default function S01_Film() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const veilTop = useRef<HTMLDivElement>(null);
  const veilBot = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [actIdx, setActIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const actIdxRef = useRef(0);

  const readyRef = useRef(false);
  readyRef.current = loaded;

  const lastT = useRef(-1);
  const lastMouse = useRef(0);
  const smooth = useRef(0);

  useEffect(() => {
    const fr = iframeRef.current;
    if (!fr) return;
    const poll = window.setInterval(() => {
      try {
        const w = fr.contentWindow as any;
        if (w?.__EMBED_READY) { setLoaded(true); window.clearInterval(poll); }
      } catch { /* 还没就绪 */ }
    }, 200);
    return () => window.clearInterval(poll);
  }, []);

  /* 滚动 = 播放。整段 rAF 里只碰 DOM 与 iframe，不 setState —— 60 次/秒重渲染一个 section
     在 3808 格画布旁边是纯浪费。只有「当前幕」变化时才让 React 重渲染，全片一共 5 次。 */
  useRaf(() => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const raw = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    smooth.current += (raw - smooth.current) * 0.16;
    if (Math.abs(smooth.current - raw) < 0.0004) smooth.current = raw;
    const p = smooth.current;

    const at = Math.min(1, Math.max(0, (p - OPEN) / (CLOSE - OPEN)));
    const t = at * DUR;

    // 幕布：上下两块纸色，各占 50%。从 50% 收到 0% 就是拉开，反向就是合上。
    const k = p < OPEN ? p / OPEN : p > CLOSE ? 1 - (p - CLOSE) / (1 - CLOSE) : 1;
    const sy = (1 - Math.min(1, Math.max(0, k))).toFixed(4);
    if (veilTop.current) veilTop.current.style.transform = `scaleY(${sy})`;
    if (veilBot.current) veilBot.current.style.transform = `scaleY(${sy})`;

    const inside = p > OPEN * 0.5 && p < 1 - (1 - CLOSE) * 0.5;
    if (uiRef.current) uiRef.current.classList.toggle('is-in', inside);

    if (tcRef.current) tcRef.current.textContent = fmt(t);
    if (barRef.current) barRef.current.style.transform = `scaleX(${at.toFixed(4)})`;
    if (pctRef.current) pctRef.current.textContent = String(Math.round(at * 100)).padStart(2, '0');

    const fr = iframeRef.current;
    if (fr && readyRef.current && Math.abs(t - lastT.current) > 0.008) {
      lastT.current = t;
      try { (fr.contentWindow as any)?.__seekNow?.(t); } catch { /* 跨帧时序 */ }
    }

    let idx = 0;
    for (let i = 0; i < ACTS.length; i++) if (t >= ACTS[i].t0) idx = i;
    if (idx !== actIdxRef.current) { actIdxRef.current = idx; setActIdx(idx); }
  });

  // 鼠标倾斜：父页面转发进 iframe（iframe 自身 pointer-events:none，收不到鼠标）
  useEffect(() => {
    const fr = iframeRef.current;
    if (!fr) return;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMouse.current < 28) return;
      lastMouse.current = now;
      const r = stageRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      try { (fr.contentWindow as any)?.__setMouse?.(x, y); } catch { /* 忽略 */ }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const act = ACTS[actIdx];

  return (
    <section className="film" ref={trackRef} id="film">
      <div className="film-stage" ref={stageRef}>
        <iframe
          ref={iframeRef}
          className="film-frame"
          src="/film/index.html?embed"
          title="万物有声 · 一镜到底"
          onLoad={() => {
            try {
              const w = iframeRef.current?.contentWindow as any;
              w?.postMessage?.('ping', '*');
            } catch { /* 忽略 */ }
          }}
        />

        <div className="film-veil film-veil--top" ref={veilTop} />
        <div className="film-veil film-veil--bottom" ref={veilBot} />

        <div className="film-ui" ref={uiRef}>
          <div className="film-hud">
            <div className="film-tcwrap">
              <span className="mono film-tc" ref={tcRef}>00:00.00</span>
              <span className="mono film-tc-total">/ 22.50</span>
            </div>
            <div className="film-act">
              <span className="mono film-act-i">{act.i}</span>
              <span className="film-act-cn">{act.cn}</span>
            </div>
          </div>

          <div className="film-progress">
            <span className="mono film-pct" ref={pctRef}>00</span>
            <div className="film-line"><span ref={barRef} /></div>
            <span className="mono film-pct">100</span>
          </div>
        </div>

        <div className={`film-loading ${loaded ? 'is-done' : ''}`}>
          <span className="mono">PREPARING 3808 CELLS</span>
          <div className="film-loadline"><span /></div>
        </div>
      </div>
    </section>
  );
}
