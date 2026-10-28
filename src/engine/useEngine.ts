import { useEffect, useState } from 'react';

/** 加载 onetake 引擎（/film/lib/motion.js → window.OM），返回模块本体 */
export function useEngine() {
  const [OM, setOM] = useState<any>((window as any).OM ?? null);
  useEffect(() => {
    if ((window as any).OM) { setOM((window as any).OM); return; }
    const s = document.createElement('script');
    s.src = '/film/lib/motion.js';
    s.async = true;
    s.onload = () => setOM((window as any).OM);
    document.head.appendChild(s);
    return () => { s.onload = null; };
  }, []);
  return OM;
}
