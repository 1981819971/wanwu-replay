/**
 * TiltedCard — 原生复刻版（vanilla JS，零 React 依赖）
 * 来源：React Bits (https://reactbits.dev) TiltedCard
 * 转换：由 convert.js 从官方 React 版自动转换（非手写）
 * 复刻日期：2026-10-13
 */


/* ---------- React API 垫片（残留引用兜底，非完整语义） ---------- */
const __appendNode = (parent, value) => {
  if (value == null || value === false || value === true) return;
  if (typeof Node !== 'undefined' && value instanceof Node) { parent.appendChild(value); return; }
  if (Array.isArray(value)) { value.forEach(v => __appendNode(parent, v)); return; }
  if (typeof value === 'object') {
    // 图片项对象 → <img>（对齐官方 JSX 里 {item} 直接渲染 <img src> 的语义）
    const src = value.img || value.src || value.url || value.image || value.poster;
    if (typeof src === 'string' && src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = String(value.alt || value.title || value.label || value.name || '');
      img.draggable = false;
      img.loading = 'lazy';
      parent.appendChild(img);
      return;
    }
    const txt = value.title ?? value.label ?? value.text ?? value.name;
    if (txt != null) { parent.appendChild(document.createTextNode(String(txt))); return; }
  }
  parent.appendChild(document.createTextNode(String(value)));
};
/* ---------- __css 垫片：数字补 px + framer-motion transform 合成 + MV 订阅 ---------- */
const __CSSPX = /^(width|height|minWidth|maxWidth|minHeight|maxHeight|top|left|right|bottom|inset|margin|marginTop|marginRight|marginBottom|marginLeft|padding|paddingTop|paddingRight|paddingBottom|paddingLeft|borderRadius|borderWidth|fontSize|letterSpacing|gap|rowGap|columnGap|outlineWidth|perspective)$/;
const __CSSBARE = /^(opacity|scale|scaleX|scaleY|flex|flexGrow|flexShrink|order|zIndex|zoom|lineHeight|fontWeight|animationDuration|animationDelay|transitionDuration|transitionDelay)$/;
const __TFMAP = { x:'translateX', y:'translateY', z:'translateZ', translateX:'translateX', translateY:'translateY', translateZ:'translateZ', rotate:'rotate', rotateX:'rotateX', rotateY:'rotateY', rotateZ:'rotateZ', scale:'scale', scaleX:'scaleX', scaleY:'scaleY', skewX:'skewX', skewY:'skewY', perspective:'perspective', transformPerspective:'perspective' };
const __TFUNIT = { translateX:'px', translateY:'px', translateZ:'px', rotate:'deg', rotateX:'deg', rotateY:'deg', rotateZ:'deg', skewX:'deg', skewY:'deg', perspective:'px' };
const __norm = (k, v) => {
  if (typeof v !== 'number') return v;
  const ck = __TFMAP[k] || k;
  if (__TFUNIT[ck]) return v + __TFUNIT[ck];
  if (__CSSBARE.test(k)) return String(v);
  if (__CSSPX.test(k)) return v + 'px';
  return v;
};
const __flushTF = (el) => {
  const st = el.__tfStore; if (!st) return;
  const order = ['perspective','translateX','translateY','translateZ','rotate','rotateX','rotateY','rotateZ','scale','scaleX','scaleY','skewX','skewY'];
  const parts = [];
  for (const k of order) if (st[k] != null) parts.push(k + '(' + st[k] + ')');
  if (parts.length) el.style.transform = parts.join(' ');
};
const __css = (el, obj) => {
  if (!el || !obj || typeof obj !== 'object') return el;
  if (!el.__tfStore) el.__tfStore = {};
  if (!el.__originStore) el.__originStore = {};
  const os = el.__originStore;
  for (const k in obj) {
    const raw = obj[k];
    if (raw == null) continue;
    const write = (val) => {
      const fm = __TFMAP[k];
      if (fm) { el.__tfStore[fm] = __norm(k, val); __flushTF(el); return; }
      if (k === 'originX' || k === 'originY') { os[k] = (typeof val === 'number') ? (val * 100) + '%' : val; el.style.transformOrigin = (os.originX || '50%') + ' ' + (os.originY || '50%'); return; }
      try { el.style[k] = __norm(k, val); } catch (e) {}
    };
    if (raw && typeof raw.get === 'function') { write(raw.get()); try { raw.on('change', write); } catch (e) {} }
    else write(raw);
  }
  return el;
};

let __uidSeq = 0;
const useId = () => 'uid-' + (++__uidSeq);
const useCallback = (fn) => fn;
const useMemo = (fn) => (typeof fn === 'function' ? fn() : fn);
const useRef = (v) => ({ current: v });
const useEffect = (fn) => { try { return typeof fn === 'function' ? fn() : undefined; } catch (e) { return undefined; } };
const useLayoutEffect = useEffect;
const useState = (init) => [typeof init === 'function' ? init() : init, () => {}];
const useReducer = (r, init) => [typeof init === 'function' ? init() : init, () => {}];
const useContext = () => ({});
const useTransition = () => [false, (fn) => (typeof fn === 'function' ? fn() : fn)];
const useReducedMotion = () => false;
const useGSAP = (fn) => { try { return typeof fn === 'function' ? fn() : undefined; } catch (e) { return undefined; } };
const useImperativeHandle = () => {};
const memo = (c) => c;
const isValidElement = (c) => !!(c && c.__jsx);
const cloneElement = (el) => el;
const createRef = () => ({ current: null });
const useSyncExternalStore = (_s, get) => (typeof get === 'function' ? get() : undefined);
const useDeferredValue = (v) => v;
const useInsertionEffect = () => {};
const startTransition = (fn) => { try { typeof fn === 'function' && fn(); } catch (e) {} };
const forwardRef = (c) => c;
const createElement = (t, p, ...kids) => ({ __jsx: true, type: t, props: p || {}, children: kids });
const Fragment = 'fragment';
const Children = { toArray: (c) => (Array.isArray(c) ? c : c == null ? [] : [c]), map: (c, f) => (Array.isArray(c) ? c : c == null ? [] : [c]).map(f), count: (c) => (Array.isArray(c) ? c.length : c == null ? 0 : 1), only: (c) => (Array.isArray(c) ? c[0] : c), isValidElement: (c) => !!(c && c.__jsx) };
const React = { Children, useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback, useId, memo, forwardRef, createElement, Fragment, useContext, useReducer, useTransition, useImperativeHandle };

/* const __subShim = 1; */
/* ---------- motion / react-dom 垫片（vanilla 近似） ---------- */
const __mkMV = (v) => { const subs = new Set(); return { get: () => v, set: (x) => { v = x; subs.forEach(f => { try { f(x); } catch (e) {} }); }, on: (_e, f) => { subs.add(f); return () => subs.delete(f); }, getVelocity: () => 0, jump: (x) => { v = x; subs.forEach(f => { try { f(x); } catch (e) {} }); }, destroy: () => subs.clear() }; };
const motionValue = (v) => __mkMV(v);
const useMotionValue = (v) => __mkMV(v);
const useSpring = (v, cfg) => {
  const __c0 = v && typeof v.get === 'function' ? v.get() : v;
  const mv = __mkMV(__c0);
  if (v && typeof v.on === 'function') {
    let raf = 0, prev = __c0;
    v.on('change', target => {
      cancelAnimationFrame(raf);
      const step = () => {
        prev += (target - prev) * 0.12;
        if (Math.abs(target - prev) < Math.abs(target) * 0.0005 + 0.0005) { prev = target; mv.set(prev); return; }
        mv.set(prev);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
  }
  return mv;
};
const useTransform = (src, fn) => {
  const g = (s) => (s && typeof s.get === 'function' ? s.get() : s);
  const calc = () => { try { return Array.isArray(src) ? fn(src.map(g)) : (typeof fn === 'function' ? fn(g(src)) : g(src)); } catch (e) { return g(src); } };
  const mv = __mkMV(calc());
  const subs = Array.isArray(src) ? src : [src];
  subs.forEach(s => { if (s && typeof s.on === 'function') s.on('change', () => mv.set(calc())); });
  return mv;
};
const useVelocity = (mv) => { const v = __mkMV(0); if (mv && typeof mv.on === 'function') { let prev = typeof mv.get === 'function' ? mv.get() : 0, pt = performance.now(); mv.on('change', (cur) => { const t = performance.now(), dt = Math.max(1, t - pt) / 1000; v.set((cur - prev) / dt); prev = cur; pt = t; }); } return v; };
const useTime = () => __mkMV(0);
const useMotionTemplate = () => __mkMV('');
const useMotionValueEvent = (mv, evt, cb) => { if (mv && typeof mv.on === 'function') { try { mv.on(evt || 'change', cb); } catch (e) {} } };
const useAnimationFrame = (cb) => { let raf; const loop = (t) => { try { cb(t); } catch (e) {} raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf); };
const useAnimationControls = () => ({ start: () => Promise.resolve(), set: () => {}, stop: () => {}, mount: () => {} });
const useAnimate = () => [() => {}, () => Promise.resolve()];
const animate = (target, keyframes, _opts) => {
  const done = { finished: Promise.resolve(), cancel() {}, stop() {}, complete() {}, then(f) { try { f && f(); } catch (e) {} return done; } };
  try {
    const arr = Array.isArray(target) ? target : [target];
    const opts = _opts || {};
    const delayMs = Math.max(0, (opts.delay || 0) * 1000);
    let durMs = typeof opts.duration === 'number' ? opts.duration * 1000 : (opts.type === 'spring' ? 500 : 320);
    if (opts.type === 'spring' && typeof opts.stiffness === 'number' && opts.stiffness > 0) durMs = Math.max(140, Math.min(1500, 2600 / Math.sqrt(opts.stiffness)));
    const ease = p => 1 - Math.pow(1 - p, 3);
    const run = () => {
      const t0 = performance.now();
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / durMs);
        const e = ease(p);
        for (const t of arr) {
          if (!t) continue;
          if (typeof keyframes === 'number' || (typeof keyframes === 'string' && !isNaN(parseFloat(keyframes)))) {
            const to = typeof keyframes === 'number' ? keyframes : parseFloat(keyframes);
            if (typeof t.get === 'function' && typeof t.set === 'function') {
              const from = (typeof t.__aFrom === 'number') ? t.__aFrom : t.get();
              t.__aFrom = from;
              t.set(from + (to - from) * e);
              if (p >= 1) t.__aFrom = undefined;
            }
          } else if (typeof keyframes === 'function') {
            try { const v = keyframes(p); if (t && typeof t.set === 'function') t.set(v); } catch (err) {}
          } else if (keyframes && typeof keyframes === 'object') {
            for (const k in keyframes) { try { if (t && (k in t || t[k] !== undefined)) t[k] = keyframes[k]; } catch (err) {} }
          }
        }
        if (p < 1) { for (const t of arr) { if (t) t.__aRaf = requestAnimationFrame(step); } }
      };
      for (const t of arr) { if (t && t.__aRaf) cancelAnimationFrame(t.__aRaf); }
      step();
    };
    if (delayMs > 0) setTimeout(run, delayMs); else run();
  } catch (e) {}
  return done;
};
const useScroll = (opts) => {
  const W = (typeof window !== 'undefined') ? window : null;
  const prog = () => { if (!W) return 0; const d = document.documentElement; const h = (d.scrollHeight || 0) - (W.innerHeight || 0); return h > 0 ? Math.min(1, Math.max(0, W.scrollY / h)) : 0; };
  const bind = (get) => { const m = __mkMV(get()); if (W) { const u = () => m.set(get()); W.addEventListener('scroll', u, { passive: true }); W.addEventListener('resize', u); requestAnimationFrame(u); } return m; };
  const sx = bind(() => (W ? W.scrollX : 0));
  const sy = bind(() => (W ? W.scrollY : 0));
  const px = bind(() => prog());
  const py = bind(() => prog());
  return { scrollX: sx, scrollY: sy, scrollXProgress: px, scrollYProgress: py };
};
const useInView = () => true;
const usePresence = () => [true, () => {}];
const AnimatePresence = (p) => (p && p.children) || null;
const LayoutGroup = (p) => (p && p.children) || null;
const MotionConfig = (p) => (p && p.children) || null;
const LazyMotion = (p) => (p && p.children) || null;
const stagger = () => 0;
const scroll = () => () => {};
const inView = () => () => {};
const useDragControls = () => ({ start: () => {} });
const useThree = () => ({ gl: {}, scene: {}, camera: {}, size: { width: 1, height: 1 }, viewport: { width: 1, height: 1 } });
const useFrame = () => {};
const useGLTF = () => ({ scene: null, nodes: {}, materials: {} });
const useFBO = () => null;
const useAnimations = () => ({ actions: {}, mixer: null });
const extend = () => {};
const useAnimation = () => ({ start: () => Promise.resolve(), set: () => {}, stop: () => {}, mount: () => {} });
const useReducedMotionConfig = () => false;
const motion = new Proxy({}, { get: (_t, k) => k });
const easing = { damp3: () => {}, damp: () => {}, damp2: () => {}, dampE: () => {}, dampM: () => {}, dampC: () => {}, smoothDamp: () => {} };
const frame = { render: () => {}, renderFrame: () => {}, invalidate: () => {}, setPriority: () => {}, setLoop: () => {} };
const maath = { damp3: () => {}, damp: () => {}, damp2: () => {}, dampE: () => {}, dampM: () => {}, dampC: () => {} };
const createPortal = (node) => node;
const flushSync = (fn) => { try { fn(); } catch (e) {} };
const unstable_batchedUpdates = (fn) => { try { fn(); } catch (e) {} };

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};


const DEFAULTS = {
  altText: 'Tilted card image',
  captionText: '',
  containerHeight: '300px',
  containerWidth: '100%',
  imageHeight: '300px',
  imageWidth: '300px',
  scaleOnHover: 1.1,
  rotateAmplitude: 14,
  showMobileWarning: true,
  showTooltip: true,
  overlayContent: null,
  displayOverlayContent: false
};

function createTiltedCard(container, options = {}) {
  if (!container) throw new Error('createTiltedCard: container 不能为空');

  let currentOptions = { ...DEFAULTS, ...options };

  const ref = { current: null };


  /* ---------- props → 真实变量（JSX 与 build() 共用） ---------- */
  let imageSrc = currentOptions.imageSrc;
  let altText = currentOptions.altText;
  let captionText = currentOptions.captionText;
  let containerHeight = currentOptions.containerHeight;
  let containerWidth = currentOptions.containerWidth;
  let imageHeight = currentOptions.imageHeight;
  let imageWidth = currentOptions.imageWidth;
  let scaleOnHover = currentOptions.scaleOnHover;
  let rotateAmplitude = currentOptions.rotateAmplitude;
  let showMobileWarning = currentOptions.showMobileWarning;
  let showTooltip = currentOptions.showTooltip;
  let overlayContent = currentOptions.overlayContent;
  let displayOverlayContent = currentOptions.displayOverlayContent;
  const props = currentOptions;   // 兼容源码里直接使用 props.xxx 的写法

  /* ---------- 组件体派生变量（build() 中赋值） ---------- */
  let x, y, rotateX, rotateY, scale, opacity, rotateFigcaption, lastY;
  let __handlers = null;   // 官方 JSX figure 上的 onMouseMove/Enter/Leave → 供 __buildDom 绑定

  /* ---------- 依赖 props 的设置装配（setOptions 可重跑） ---------- */
  const build = () => {
    x = useMotionValue();
    y = useMotionValue();
    rotateX = useSpring(useMotionValue(0), springValues);
    rotateY = useSpring(useMotionValue(0), springValues);
    scale = useSpring(1, springValues);
    opacity = useSpring(0);
    rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });
    function handleMouse(e) {
        if (!ref.current) return;
    
        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
    
        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    
        rotateX.set(rotationX);
        rotateY.set(rotationY);
    
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    
        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        /* 修复：原 setLastY(offsetY) 每帧触发 __refresh() 整体重建 DOM+motion values（同 curved-loop M 类 refresh 风暴，
           mousemove 全被重建吃掉，倾斜/缩放/caption 全不动）。lastY 是纯内部变量，官方 useRef 语义，直接赋值。 */
        lastY = offsetY;
      }
    function handleMouseEnter() {
        scale.set(scaleOnHover);
        opacity.set(1);
      }
    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
      }
    /* 官方 JSX: <motion.figure onMouseMove={handleMouse} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> —— 转换器丢失，提升到外层供 DOM 绑定 */
    __handlers = { handleMouse, handleMouseEnter, handleMouseLeave };
  };


  let __refreshing = false;
    const __refresh = () => {
      if (__refreshing) return;                     // 防重入：effect 内改 state 不级联重跑
      __refreshing = true;
      try { build(); __buildDom(); __disposeEffects(); __runEffects(false); } catch (e) {} finally { __refreshing = false; }
    };

  /* ---------- 状态（useState → 可变变量 + setter） ---------- */
  lastY = (__v => (typeof __v === 'function' ? __v() : __v))(0);
  const setLastY = (v) => { const __nv = (typeof v === 'function' ? v(lastY) : v); if (Object.is(__nv, lastY)) return; lastY = __nv; __refresh(); };

    build();  // 修复：必须在状态初始化之后首次构建（原在初始化之前，读到 undefined 状态）

/* ---------- DOM 结构（refresh 时整体重建，对齐 React re-render） ---------- */
  const __label = Array.from(container.childNodes).filter(n => n.nodeType === 1 && /label/.test(n.className || ''));
  const __buildDom = () => {
    while (container.firstChild) container.removeChild(container.firstChild);
    if (__label) __label.forEach(n => container.appendChild(n));
  const figureEl1 = document.createElement('figure');
  figureEl1.className = "tilted-card-figure";
  __css(figureEl1, {
        height: containerHeight,
        width: containerWidth
      } || {});
    if (showMobileWarning) {
      const divEl2 = document.createElement('div');
      divEl2.className = "tilted-card-mobile-alert";
      divEl2.appendChild(document.createTextNode("This effect is not optimized for mobile. Check on desktop."));
      figureEl1.appendChild(divEl2);
    }
    const divEl3 = document.createElement('div');
    divEl3.className = "tilted-card-inner";
    __css(divEl3, {
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        } || {});
      const imgEl4 = document.createElement('img');
      imgEl4.src = imageSrc;
      imgEl4.alt = altText;
      imgEl4.className = "tilted-card-img";
      __css(imgEl4, {
            width: imageWidth,
            height: imageHeight
          } || {});
      divEl3.appendChild(imgEl4);
      if (displayOverlayContent) {
        if (overlayContent) {
          const divEl5 = document.createElement('div');
          divEl5.className = "tilted-card-overlay";
          __appendNode(divEl5, overlayContent);
          divEl3.appendChild(divEl5);
        }
      }
    figureEl1.appendChild(divEl3);
    if (showTooltip) {
      const figcaptionEl6 = document.createElement('figcaption');
      figcaptionEl6.className = "tilted-card-caption";
      __css(figcaptionEl6, {
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          } || {});
      __appendNode(figcaptionEl6, captionText);
      figureEl1.appendChild(figcaptionEl6);
    }
  ref.current = figureEl1;
  /* 补绑官方 figure 上的鼠标事件（1:1 对齐 JSX onMouseMove/onMouseEnter/onMouseLeave） */
  if (__handlers) {
    figureEl1.addEventListener('mousemove', __handlers.handleMouse);
    figureEl1.addEventListener('mouseenter', __handlers.handleMouseEnter);
    figureEl1.addEventListener('mouseleave', __handlers.handleMouseLeave);
  }
  container.appendChild(figureEl1);
  };
  __buildDom();

  /* ---------- effects（状态变化后可重跑，对齐 React 行为） ---------- */
  const __fxDefs = [
    /* 无 effect */
  ];
  const __fxCleanups = [];
  const __runEffects = (reRun) => {
    __fxDefs.forEach((d, i) => {
      if (reRun && d.once) return;
      try { if (typeof __fxCleanups[i] === 'function') __fxCleanups[i](); } catch (e) {}
      try { __fxCleanups[i] = d.run(); } catch (e) { __fxCleanups[i] = undefined; }
    });
  };
  const __disposeEffects = () => { __fxCleanups.forEach(c => { try { typeof c === 'function' && c(); } catch (e) {} }); __fxCleanups.length = 0; };
  __runEffects(false);

  return {
    destroy() {
      __disposeEffects();
    },
    setOptions(next = {}) {/* __setOptRefresh: 让 setOptions 也重跑 effect，否则 rAF 循环无法重启 */ 
      for (const k in next) if (next[k] !== undefined) currentOptions[k] = next[k];
      imageSrc = currentOptions.imageSrc;
      altText = currentOptions.altText;
      captionText = currentOptions.captionText;
      containerHeight = currentOptions.containerHeight;
      containerWidth = currentOptions.containerWidth;
      imageHeight = currentOptions.imageHeight;
      imageWidth = currentOptions.imageWidth;
      scaleOnHover = currentOptions.scaleOnHover;
      rotateAmplitude = currentOptions.rotateAmplitude;
      showMobileWarning = currentOptions.showMobileWarning;
      showTooltip = currentOptions.showTooltip;
      overlayContent = currentOptions.overlayContent;
      displayOverlayContent = currentOptions.displayOverlayContent;
      __refresh();

    }
  };
}

export default createTiltedCard;
export { createTiltedCard };
