import { useEffect, useRef, useState } from 'react';

/** 每帧回调，跑在 rAF 里。传 null 就停。 */
export function useRaf(cb: (now: number) => void, active = true) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const loop = (now: number) => { ref.current(now); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/**
 * 元素在视口中的进度：0 = 顶部刚进入 viewport 顶，1 = 底部刚离开。
 * 用于 sticky 舞台这类需要「这一段滚了多少」的场景。
 */
export function useTrackProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  const raw = useRef(0);
  const smooth = useRef(0);

  useRaf(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const passed = -r.top;
    const v = total > 0 ? Math.min(1, Math.max(0, passed / total)) : 0;
    raw.current = v;
    // 平滑，避免滚轮一格 3 帧跳变
    smooth.current += (raw.current - smooth.current) * 0.16;
    if (Math.abs(smooth.current - raw.current) < 0.0004) smooth.current = raw.current;
    setP(smooth.current);
  });

  return p;
}

/** 元素是否已经进入视口（一次性，加了就不再撤） */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** 滚动位置（用于右侧全局进度） */
export function useScrollY() {
  const [y, setY] = useState(0);
  useRaf(() => setY(window.scrollY));
  return y;
}
