import { useEffect, useRef, type CSSProperties } from 'react';

type Factory = (el: HTMLElement, opts: Record<string, unknown>) => { destroy?: () => void } | void;

/**
 * 整个复刻集的统一入口。
 *
 * 199 件组件的原生形态都是 `createXxx(el, opts) → { destroy() }`——
 * 这套契约对 React 不友好：没有声明周期、没有卸载、参数靠手动 diff。
 * defineFx 把它包成真正的 React 组件：挂载时初始化，卸载时 destroy，
 * 传 active=false 就整件不挂（用于「hover 才启动」这类省电场景）。
 */
export function defineFx(load: () => Promise<any>, pick: string) {
  return function Fx({
    opts,
    active = true,
    className = '',
    style,
  }: {
    opts?: Record<string, unknown>;
    active?: boolean;
    className?: string;
    style?: CSSProperties;
  }) {
    const host = useRef<HTMLDivElement>(null);
    const optsRef = useRef(opts);
    optsRef.current = opts;

    useEffect(() => {
      if (!active || !host.current) return;
      let inst: any = null;
      let dead = false;

      load()
        .then((m) => {
          if (dead || !host.current) return;
          const fn = (m[pick] ?? m.default) as Factory;
          if (typeof fn !== 'function') {
            console.warn(`[defineFx] ${pick} 不存在`);
            return;
          }
          try { inst = fn(host.current, optsRef.current ?? {}); }
          catch (e) { console.warn(`[defineFx] ${pick} 初始化失败`, e); }
        })
        .catch((e) => console.warn('[defineFx] 模块加载失败', e));

      return () => {
        dead = true;
        try { inst?.destroy?.(); } catch { /* 卸载失败不阻塞 */ }
        if (host.current) host.current.innerHTML = '';
      };
    }, [active]);

    return <div ref={host} className={className} style={style} />;
  };
}
