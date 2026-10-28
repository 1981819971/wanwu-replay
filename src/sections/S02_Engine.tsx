import { useEffect, useRef, useState } from 'react';
import { useEngine } from '../engine/useEngine';
import { useRaf } from '../hooks/useScroll';
import './engine.css';

const CODE = `function shake(t, tHit, { amp = 12, decay = 9, freq = 19 } = {}) {
  const tau = t - tHit;
  if (tau <= 0) return { x: 0, y: 0, rot: 0 };

  // 包络：唯一让它停下来的东西
  const e = amp * Math.exp(-decay * tau);
  const w = 2 * Math.PI * tau;

  // fx / fy / fr = 由 seed 派生的三个频率，
  // 所以同一台机器每次抖得一模一样
  return {
    x:   e * Math.sin(w * fx),
    y: 0.7 * e * Math.sin(w * fy),
    rot: 0.0015 * e * Math.sin(w * fr),
  };
}`;

export default function S02_Engine() {
  const OM = useEngine();
  const cv = useRef<HTMLCanvasElement>(null);
  const [amp, setAmp] = useState(15);
  const [decay, setDecay] = useState(8.5);
  const [freq, setFreq] = useState(18);
  const p = useRef({ amp, decay, freq });
  p.current = { amp, decay, freq };

  useEffect(() => {
    const c = cv.current;
    if (!c || !OM) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const ro = new ResizeObserver(() => {
      const r = c.getBoundingClientRect();
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, [OM]);

  const t0 = useRef(performance.now());

  useRaf(() => {
    const c = cv.current;
    if (!c || !OM) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = c.width / dpr, H = c.height / dpr;
    const g = c.getContext('2d');
    if (!g || W < 10) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);

    const { amp: A, decay: D, freq: F } = p.current;
    const T = 2.6;                       // 一次抖动的观察窗
    const t = ((performance.now() - t0.current) / 1000) % (T + 0.55);

    // 曲线基线
    const baseY = H * 0.36;
    const lineY = H * 0.68;
    const scale = Math.min(H * 0.30 / 60, 3.2);

    // 采样整条曲线
    g.beginPath();
    for (let i = 0; i <= 260; i++) {
      const tt = (i / 260) * T;
      const s = OM.shake(tt, 0.0001, { amp: A, decay: D, freq: F, seed: 3 });
      const x = (i / 260) * W;
      const y = lineY - s.x * scale * 0.5;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.strokeStyle = 'rgba(168,118,31,.85)';
    g.lineWidth = 1.15;
    g.stroke();

    // 不衰减的对照：同样频率，振幅不降
    g.beginPath();
    for (let i = 0; i <= 260; i++) {
      const tt = (i / 260) * T;
      const y = lineY - Math.sin(2 * Math.PI * tt * F) * A * scale * 0.5;
      const x = (i / 260) * W;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.strokeStyle = 'rgba(141,133,120,.30)';
    g.lineWidth = 1;
    g.setLineDash([2, 3]);
    g.stroke();
    g.setLineDash([]);

    // 当前时刻的游标
    const cx = (Math.min(t, T) / T) * W;
    g.beginPath();
    g.moveTo(cx, baseY - 42);
    g.lineTo(cx, lineY + 26);
    g.strokeStyle = 'rgba(43,40,35,.16)';
    g.lineWidth = 1;
    g.stroke();

    // 主体：一个被抖动平移的方块（就是镜头 shake 在做的事）
    const s = OM.shake(t, 0.0001, { amp: A, decay: D, freq: F, seed: 3 });
    const bx = W * 0.5 + s.x * scale;
    const by = baseY + s.y * scale;
    g.save();
    g.translate(bx, by);
    g.rotate(s.rot * 60);
    g.fillStyle = 'rgba(168,118,31,.10)';
    g.fillRect(-32, -32, 64, 64);
    g.strokeStyle = '#a8761f';
    g.lineWidth = 1.2;
    g.strokeRect(-32, -32, 64, 64);
    g.restore();

    // 十字准心（不动的那条基准）
    g.strokeStyle = 'rgba(43,40,35,.14)';
    g.beginPath();
    g.moveTo(W * 0.5 - 44, baseY); g.lineTo(W * 0.5 + 44, baseY);
    g.moveTo(W * 0.5, baseY - 44); g.lineTo(W * 0.5, baseY + 44);
    g.stroke();
  });

  return (
    <section className="sec engine" id="engine">
      <div className="sec-inner">
        <div className="sec-head">
          <span className="eyebrow">02 — 序 / THE ENGINE</span>
          <h2 className="serif-h sec-h">里面没有一个状态变量。</h2>
          <p className="lead">
            整支片子的每一个像素，都是时间 <span className="mono ed-code-inline">t</span> 的纯函数。
            给它 9.51 秒，它算出蝴蝶的左翅在哪儿；给同一个 9.51 秒十次，十次一模一样。
            这就是它既能被渲成 60fps 视频、又能被你的滚动条拖着倒放的原因。
          </p>
        </div>

        <div className="ed-grid">
          <div className="ed-code">
            <div className="ed-code-bar">
              <span className="mono">lib/motion.js</span>
              <span className="mono ed-code-tag">54 exported · pure</span>
            </div>
            <pre className="mono ed-pre"><code>{CODE}</code></pre>
            <p className="ed-code-note">
              上面这段从 <b>lib/motion.js</b> 原文摘出，为排版折了行。右边那个抖动，就是<b>同一个函数</b>在跑——不是我另写了一段动画来演示它。
            </p>
          </div>

          <div className="ed-demo">
            <canvas ref={cv} className="ed-canvas" />
            <div className="ed-demo-foot">
              <span className="mono ed-fn">shake(t, tHit, &#123; amp, decay, freq &#125;)</span>
              <span className="mono ed-legend"><i className="lg-a" />衰减后　<i className="lg-b" />不衰减</span>
            </div>

            <div className="ed-knobs">
              <Knob label="amp" value={amp} min={2} max={34} step={1} set={setAmp} />
              <Knob label="decay" value={decay} min={1} max={20} step={0.5} set={setDecay} />
              <Knob label="freq" value={freq} min={4} max={40} step={1} set={setFreq} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Knob({ label, value, min, max, step, set }: {
  label: string; value: number; min: number; max: number; step: number; set: (v: number) => void;
}) {
  return (
    <label className="ed-knob">
      <span className="mono ed-knob-k">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => set(parseFloat(e.target.value))}
        aria-label={label}
      />
      <span className="mono ed-knob-v">{value}</span>
    </label>
  );
}
