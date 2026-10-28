import './numbers.css';

const BARS = [
  { k: '预算 1/60s', v: 16.7, ghost: true },
  { k: 'max', v: 17.6 },
  { k: 'p99', v: 14.6 },
  { k: 'p90', v: 8.8 },
  { k: 'p50', v: 4.9 },
  { k: 'avg', v: 4.8 },
];

const BIG = [
  { n: '4.8', u: 'ms', k: '单帧重绘中位耗时', d: '3808 张卡片 + 1550 个流场粒子，一次全画' },
  { n: '675', u: '帧', k: '逐帧采样点', d: '只有 2 帧越过 16.7ms，0 帧越过 33ms' },
  { n: '0', u: '', k: '黑屏组件', d: '初版 62 件黑屏，四轮修到死帧清零' },
];

export default function S04_Numbers() {
  return (
    <section className="sec nums" id="numbers">
      <div className="sec-inner">
        <div className="sec-head">
          <span className="eyebrow">04 — 数 / THE MEASUREMENTS</span>
          <h2 className="serif-h sec-h">这些数字是跑出来的，不是估的。</h2>
          <p className="lead">
            上一章那支片子能不能被滚动条驱动，全看下面这张表。
            在决定「滚动 = 播放」之前，我先把它逐帧扫了一遍：22.5 秒切 675 个采样点，
            每点调一次 <span className="mono ed-code-inline">__seek(t)</span> 并计时。
            中位 4.8 毫秒，60fps 的预算是 16.7 毫秒。
          </p>
        </div>

        <div className="nm-grid">
          <div className="nm-bars">
            <div className="nm-bars-head">
              <span className="mono">单帧 seek 耗时 · 单位 ms</span>
              <span className="mono nm-bars-note">n = 675</span>
            </div>
            {BARS.map((b) => (
              <div className={`nm-row ${b.ghost ? 'is-ghost' : ''}`} key={b.k}>
                <span className="mono nm-row-k">{b.k}</span>
                <div className="nm-track">
                  <span className="nm-fill" style={{ width: `${(b.v / 17.6) * 100}%` }} />
                </div>
                <span className="mono nm-row-v">{b.v.toFixed(1)}</span>
              </div>
            ))}
            <p className="nm-bars-foot">
              只有一帧压线越过预算（17.6ms，第 13.3 秒，裂解最密的那一拍），
              接着就往回掉。所以这片子能被我拖着走，包括倒着走。
            </p>
          </div>

          <div className="nm-bigs">
            {BIG.map((b) => (
              <div className="nm-big" key={b.k}>
                <div className="nm-big-top">
                  <span className="mono nm-big-n">{b.n}</span>
                  <span className="mono nm-big-u">{b.u}</span>
                </div>
                <span className="nm-big-k">{b.k}</span>
                <span className="nm-big-d">{b.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="nm-foot">
          <span className="mono">195.8 fps</span>
          <span>连续推进 1350 帧（按 60fps 走完整片）的平均推帧速率</span>
        </div>
      </div>
    </section>
  );
}
