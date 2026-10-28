/**
 * DriftWall — 原生复刻版（vanilla JS，零 React 依赖）
 * 来源：React Bits (https://reactbits.dev) DriftWall
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
const useTransform = (src, fn) => __mkMV(typeof fn === 'function' ? fn(src && typeof src.get === 'function' ? src.get() : src) : (src && src.get ? src.get() : src));
const useVelocity = () => __mkMV(0);
const useTime = () => __mkMV(0);
const useMotionTemplate = () => __mkMV('');
const useMotionValueEvent = () => {};
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
const useScroll = () => ({ scrollX: __mkMV(0), scrollY: __mkMV(0), scrollXProgress: __mkMV(0), scrollYProgress: __mkMV(0) });
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

const DEFAULT_ITEMS = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Tile ${i + 1}`,
    href: undefined
  };
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};


const DEFAULTS = {
  items: DEFAULT_ITEMS,
  columns: 5,
  tileWidth: 200,
  tileHeight: 132,
  gap: 18,
  radius: 14,
  tilt: 16,
  turn: -14,
  roll: 0,
  perspective: 1200,
  depth: 120,
  speed: 42,
  direction: 'up',
  variance: 0.45,
  parallax: 0.6,
  pauseOnHover: false,
  lift: 64,
  fade: 0.6,
  dim: 0.55,
  grayscale: false,
  overlayColor: '#060010',
  className: ''
};

function createDriftWall(container, options = {}) {
  if (!container) throw new Error('createDriftWall: container 不能为空');

  let currentOptions = { ...DEFAULTS, ...options };

  const containerRef = { current: container };
  const planeRef = { current: null };
  const trackRefs = { current: [] };
  const rafRef = { current: null };
  const offsetsRef = { current: [] };
  const velocitiesRef = { current: [] };
  const hoveredColRef = { current: null };
  const wallHoveredRef = { current: false };
  const pointerRef = { current: null };
  const pointerDampedRef = { current: null };
  const lastTsRef = { current: null };
  const activeIdRef = { current: null };


  /* ---------- props → 真实变量（JSX 与 build() 共用） ---------- */
  let items = currentOptions.items;
  let columns = currentOptions.columns;
  let tileWidth = currentOptions.tileWidth;
  let tileHeight = currentOptions.tileHeight;
  let gap = currentOptions.gap;
  let radius = currentOptions.radius;
  let tilt = currentOptions.tilt;
  let turn = currentOptions.turn;
  let roll = currentOptions.roll;
  let perspective = currentOptions.perspective;
  let depth = currentOptions.depth;
  let speed = currentOptions.speed;
  let direction = currentOptions.direction;
  let variance = currentOptions.variance;
  let parallax = currentOptions.parallax;
  let pauseOnHover = currentOptions.pauseOnHover;
  let lift = currentOptions.lift;
  let fade = currentOptions.fade;
  let dim = currentOptions.dim;
  let grayscale = currentOptions.grayscale;
  let overlayColor = currentOptions.overlayColor;
  let className = currentOptions.className;
  let style = currentOptions.style;
  const props = currentOptions;   // 兼容源码里直接使用 props.xxx 的写法

  /* ---------- 组件体派生变量（build() 中赋值） ---------- */
  let columnItems, columnMeta, baseVelocities, applyPlaneTransform, activate, release, handlePointerMove, handlePointerLeaveWall, cssVars, renderTile, rootClass, containerHeight, activeId, reduced;

  /* ---------- 依赖 props 的设置装配（setOptions 可重跑） ---------- */
  const build = () => {
    columnItems = (() => {
    const cols = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : items.slice(0, 1)));
  })();
    columnMeta = (() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  })();
    baseVelocities = (() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  })();
    applyPlaneTransform = ((px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    });
    activate = ((id, index) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  });
    release = (() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  });
    handlePointerMove = (e => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    });
    handlePointerLeaveWall = (() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  });
    cssVars = (() => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style
    }))();
    renderTile = (item, id, colIndex) => {
    const inner = (
      (() => {
  const container = document.createElement('div');
    const spanEl1 = document.createElement('span');
    spanEl1.className = "drift-wall__inner";
      const imgEl2 = document.createElement('img');
      imgEl2.src = item.image || item.img || item.src || item.url || '';  /* 兼容 demo 字段差异 */
      imgEl2.alt = item.title ?? '';
      imgEl2.loading = 'lazy';
      imgEl2.decoding = 'async';
      imgEl2.draggable = false;
      spanEl1.appendChild(imgEl2);
      const spanEl3 = document.createElement('span');
      spanEl3.className = "drift-wall__overlay";
      spanEl3.setAttribute('aria-hidden', String("true"));
      spanEl1.appendChild(spanEl3);
    container.appendChild(spanEl1);
  return container.firstElementChild || container.firstChild;
})()
    );
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release
    };
    if (item.href) {
      return (
        (() => {
  const container = document.createElement('div');
    const aEl1 = document.createElement('a');
    aEl1.className = commonProps.className;
    aEl1.setAttribute('data-tile-id', String(commonProps['data-tile-id']));
    aEl1.setAttribute('data-col', String(commonProps['data-col']));
    aEl1.onfocus = commonProps.onFocus;
    aEl1.onblur = commonProps.onBlur;
    if (item.href) aEl1.href = item.href;
    __appendNode(aEl1, inner);
    container.appendChild(aEl1);
  return container.firstElementChild || container.firstChild;
})()
      );
    }
    return (
      (() => {
  const container = document.createElement('div');
    const divEl1 = document.createElement('div');
    divEl1.setAttribute('aria-label', String(item.title ?? 'tile'));
    divEl1.className = commonProps.className;
    divEl1.setAttribute('data-tile-id', String(commonProps['data-tile-id']));
    divEl1.setAttribute('data-col', String(commonProps['data-col']));
    divEl1.onfocus = commonProps.onFocus;
    divEl1.onblur = commonProps.onBlur;
    __appendNode(divEl1, inner);
    container.appendChild(divEl1);
  return container.firstElementChild || container.firstChild;
})()
    );
  };
    rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ');
      hoveredColRef.current = -1;
      pointerRef.current = { x: 0, y: 0 };
      pointerDampedRef.current = { x: 0, y: 0 };
  };


  let __refreshing = false;
    const __refresh = () => {
      if (__refreshing) return;                     // 防重入：effect 内改 state 不级联重跑
      __refreshing = true;
      try { build(); __buildDom(); __disposeEffects(); __runEffects(false); } catch (e) {} finally { __refreshing = false; }
    };

  /* ---------- 状态（useState → 可变变量 + setter） ---------- */
  containerHeight = (__v => (typeof __v === 'function' ? __v() : __v))(600);
  const setContainerHeight = (v) => { const __nv = (typeof v === 'function' ? v(containerHeight) : v); if (Object.is(__nv, containerHeight)) return; containerHeight = __nv; __refresh(); };
  activeId = (__v => (typeof __v === 'function' ? __v() : __v))(null);
  const setActiveId = (v) => { const __nv = (typeof v === 'function' ? v(activeId) : v); if (Object.is(__nv, activeId)) return; activeId = __nv; __refresh(); };
  reduced = (__v => (typeof __v === 'function' ? __v() : __v))(false);
  const setReduced = (v) => { const __nv = (typeof v === 'function' ? v(reduced) : v); if (Object.is(__nv, reduced)) return; reduced = __nv; __refresh(); };

    build();  // 修复：必须在状态初始化之后首次构建（原在初始化之前，读到 undefined 状态）


  /* == injected CSS vars ==（生成器丢失官方 root style 变量 → CSS var() 全空 → BLANK/错乱；对照 _raw 官方 JSX 补注入，逐变量 try/catch 防缺名） */
  try { container.style.setProperty("--dw-tile-w", String(`${tileWidth}px`)); } catch (e) {}
  try { container.style.setProperty("--dw-tile-h", String(`${tileHeight}px`)); } catch (e) {}
  try { container.style.setProperty("--dw-gap", String(`${gap}px`)); } catch (e) {}
  try { container.style.setProperty("--dw-radius", String(`${radius}px`)); } catch (e) {}
  try { container.style.setProperty("--dw-perspective", String(`${perspective}px`)); } catch (e) {}
  try { container.style.setProperty("--dw-lift", String(`${lift}px`)); } catch (e) {}
  try { container.style.setProperty("--dw-dim", String(dim)); } catch (e) {}
  try { container.style.setProperty("--dw-gray", String(grayscale ? 1 : 0)); } catch (e) {}
  try { container.style.setProperty("--dw-overlay", String(overlayColor)); } catch (e) {}
  try { container.style.setProperty("--dw-edge", String(`${Math.max(0, (1 - fade) * 100)}%`)); } catch (e) {}
/* ---------- DOM 结构（refresh 时整体重建，对齐 React re-render） ---------- */
  const __label = Array.from(container.childNodes).filter(n => n.nodeType === 1 && /label/.test(n.className || ''));
  trackRefs.current = [];
  const __buildDom = () => {
    while (container.firstChild) container.removeChild(container.firstChild);
    if (__label) __label.forEach(n => container.appendChild(n));
    /* drift-wall 官方事件回填：wall pointerenter → wallHoveredRef */
    if (typeof wallHoveredRef !== 'undefined' && wallHoveredRef) container.addEventListener('pointerenter', () => { wallHoveredRef.current = true; });
    /* drift-wall 官方事件回填：wall pointermove/leave + tile focus/blur（container 委托） */
    if (typeof handlePointerMove === 'function') container.addEventListener('pointermove', handlePointerMove);
    if (typeof handlePointerLeaveWall === 'function') container.addEventListener('pointerleave', handlePointerLeaveWall);
    container.addEventListener('focusin', (e) => { const t = e.target instanceof Element ? e.target.closest('[data-tile-id]') : null; if (t && container.contains(t)) { /* activate */ const fn = window.__dwActivate; if (typeof fn === 'function') fn(t.getAttribute('data-tile-id')); } });
    container.addEventListener('focusout', (e) => { const t = e.target instanceof Element ? e.target.closest('[data-tile-id]') : null; if (t && container.contains(t)) { const fn = window.__dwRelease; if (typeof fn === 'function') fn(); } });
  if (rootClass) container.className = [container.className, ...String(rootClass).split(' ')].filter(Boolean).join(' ');
  container.setAttribute('aria-label', String("Drifting wall of tiles"));
  const divEl1 = document.createElement('div');
  divEl1.className = "drift-wall__plane";
    ((columnItems) || []).forEach((col, c) => {
      const meta = columnMeta[c];
      const copies = Array.from({ length: meta.copies });
      const divEl2 = document.createElement('div');
      divEl2.className = "drift-wall__col";
        const divEl3 = document.createElement('div');
        divEl3.className = "drift-wall__track";
        trackRefs.current[c] = divEl3; // 修复：生成器漏绑 trackRefs → 漂移循环写不到列 → 全墙静止
          __appendNode(divEl3, copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                ));
        divEl2.appendChild(divEl3);
      divEl1.appendChild(divEl2);
    });
  planeRef.current = divEl1;
  container.appendChild(divEl1);
  };
  __buildDom();

  /* ---------- effects（状态变化后可重跑，对齐 React 行为） ---------- */
  const __fxDefs = [
    { once: true, run: () => {
          
              setReduced(prefersReducedMotion());
              const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
              const onChange = e => setReduced(e.matches);
              mq.addEventListener('change', onChange);
              return () => mq.removeEventListener('change', onChange);
            
    } },
    { once: true, run: () => {
          
              if (!containerRef.current) return;
              const ro = new ResizeObserver(([entry]) => {
                setContainerHeight(entry.contentRect.height || 600);
              });
              ro.observe(containerRef.current);
              return () => ro.disconnect();
            
    } },
    { once: false, run: () => {
          
              offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
              velocitiesRef.current = columnItems.map(() => 0);
            
    } },
    { once: false, run: () => {
          
              const animate = ts => {
                if (lastTsRef.current === null) lastTsRef.current = ts;
                const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
                lastTsRef.current = ts;
          
                const maxTilt = parallax * 8;
                const targetX = pointerRef.current.x * maxTilt;
                const targetY = -pointerRef.current.y * maxTilt;
                const damp = 1 - Math.exp(-dt / 0.12);
                pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
                pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
                applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
          
                if (!reduced) {
                  for (let c = 0; c < trackRefs.current.length; c++) {
                    const meta = columnMeta[c];
                    if (!meta) continue;
                    const paused = wallHoveredRef.current && pauseOnHover;
                    const factor = paused || hoveredColRef.current === c ? 0 : 1;
                    const target = baseVelocities[c] * factor;
          
                    const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
                    velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
                    let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
                    next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
                    offsetsRef.current[c] = next;
          
                    const el = trackRefs.current[c];
                    if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
                  }
                } else {
                  for (let c = 0; c < trackRefs.current.length; c++) {
                    const el = trackRefs.current[c];
                    const meta = columnMeta[c];
                    if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
                  }
                }
          
                rafRef.current = requestAnimationFrame(animate);
              };
          
              rafRef.current = requestAnimationFrame(animate);
              return () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
                lastTsRef.current = null;
              };
            
    } }
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
    setOptions(next = {}) {
      for (const k in next) if (next[k] !== undefined) currentOptions[k] = next[k];
      items = currentOptions.items;
      columns = currentOptions.columns;
      tileWidth = currentOptions.tileWidth;
      tileHeight = currentOptions.tileHeight;
      gap = currentOptions.gap;
      radius = currentOptions.radius;
      tilt = currentOptions.tilt;
      turn = currentOptions.turn;
      roll = currentOptions.roll;
      perspective = currentOptions.perspective;
      depth = currentOptions.depth;
      speed = currentOptions.speed;
      direction = currentOptions.direction;
      variance = currentOptions.variance;
      parallax = currentOptions.parallax;
      pauseOnHover = currentOptions.pauseOnHover;
      lift = currentOptions.lift;
      fade = currentOptions.fade;
      dim = currentOptions.dim;
      grayscale = currentOptions.grayscale;
      overlayColor = currentOptions.overlayColor;
      className = currentOptions.className;
      style = currentOptions.style;
      build();

    }
  };
}

export default createDriftWall;
export { createDriftWall };
