/**
 * DecryptedText — 原生复刻版（vanilla JS，零 React 依赖）
 * 来源：React Bits (https://reactbits.dev) DecryptedText
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
const animate = (target, keyframes, _opts) => { try { const arr = Array.isArray(target) ? target : [target]; if (typeof keyframes === 'function') { const v = keyframes(0); arr.forEach(t => { try { t.set ? t.set(v) : Object.assign(t, v || {}); } catch (e) {} }); } else if (keyframes && typeof keyframes === 'object' && !Array.isArray(keyframes)) { arr.forEach(t => { for (const k in keyframes) { try { if (t && (k in t || t[k] !== undefined)) t[k] = keyframes[k]; } catch (e) {} } }); } } catch (e) {} const done = { finished: Promise.resolve(), cancel() {}, stop() {}, complete() {}, then(f) { try { f && f(); } catch (e) {} return done; } }; return done; };
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

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
    visibility: 'hidden'
  }
};


const DEFAULTS = {
  speed: 50,
  maxIterations: 10,
  sequential: false,
  revealDirection: 'start',
  useOriginalCharsOnly: false,
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className: '',
  parentClassName: '',
  encryptedClassName: '',
  animateOn: 'hover',
  clickMode: 'once'
};

function createDecryptedText(container, options = {}) {
  if (!container) throw new Error('createDecryptedText: container 不能为空');

  let currentOptions = { ...DEFAULTS, ...options };

  const containerRef = { current: container };
  const orderRef = { current: [] };
  const pointerRef = { current: 0 };
  const intervalRef = { current: null };

  const rest = { ...currentOptions };
  for (const __k of ['text', 'speed', 'maxIterations', 'sequential', 'revealDirection', 'useOriginalCharsOnly', 'characters', 'className', 'parentClassName', 'encryptedClassName', 'animateOn', 'clickMode']) delete rest[__k];

  /* ---------- props → 真实变量（JSX 与 build() 共用） ---------- */
  let text = currentOptions.text;
  let speed = currentOptions.speed;
  let maxIterations = currentOptions.maxIterations;
  let sequential = currentOptions.sequential;
  let revealDirection = currentOptions.revealDirection;
  let useOriginalCharsOnly = currentOptions.useOriginalCharsOnly;
  let characters = currentOptions.characters;
  let className = currentOptions.className;
  let parentClassName = currentOptions.parentClassName;
  let encryptedClassName = currentOptions.encryptedClassName;
  let animateOn = currentOptions.animateOn;
  let clickMode = currentOptions.clickMode;
  const props = currentOptions;   // 兼容源码里直接使用 props.xxx 的写法

  /* ---------- 组件体派生变量（build() 中赋值） ---------- */
  let availableChars, shuffleText, computeOrder, fillAllIndices, removeRandomIndices, encryptInstantly, triggerDecrypt, triggerReverse, resetToPlainText, animateProps, displayText, isAnimating, revealedIndices, hasAnimated, isDecrypted, direction;

  /* ---------- 依赖 props 的设置装配（setOptions 可重跑） ---------- */
  const build = () => {
    availableChars = (() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  })();
    shuffleText = ((originalText, currentRevealed) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    });
    computeOrder = (len => {
      const order = [];
      if (len <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      // center
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    });
    fillAllIndices = (() => {
    const s = new Set();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  });
    removeRandomIndices = ((set, count) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  });
    encryptInstantly = (() => {
    const emptySet = new Set();
    setRevealedIndices(emptySet);
    setDisplayText(shuffleText(text, emptySet));
    setIsDecrypted(false);
  });
    triggerDecrypt = (() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      setRevealedIndices(new Set());
    } else {
      setRevealedIndices(new Set());
    }
    setDirection('forward');
    setIsAnimating(true);
  });
    triggerReverse = (() => {
    if (sequential) {
      // compute forward order then reverse it: we'll remove indices in that order
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      setRevealedIndices(fillAllIndices()); // start fully revealed
      setDisplayText(shuffleText(text, fillAllIndices()));
    } else {
      // non-seq: start from fully revealed as well
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    }
    setDirection('reverse');
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);
    /* Click Behaviour */
      const handleClick = () => {
        if (animateOn !== 'click') return;
    
        if (clickMode === 'once') {
          if (isDecrypted) return;
          setDirection('forward');
          triggerDecrypt();
        }
    
        if (clickMode === 'toggle') {
          if (isDecrypted) {
            triggerReverse();
          } else {
            setDirection('forward');
            triggerDecrypt();
          }
        }
      };
    /* Hover Behaviour */
      const triggerHoverDecrypt = useCallback(() => {
        if (isAnimating) return;
    
        setRevealedIndices(new Set());
        setIsDecrypted(false);
        setDisplayText(text);
        setDirection('forward');
        setIsAnimating(true);
      }, [isAnimating, text]);
    resetToPlainText = (() => {
    clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection('forward');
  });
    /* View Observer */
      useEffect(() => {
        if (animateOn !== 'view' && animateOn !== 'inViewHover') return;
    
        const observerCallback = entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
              triggerDecrypt();
              setHasAnimated(true);
            }
          });
        };
    
        const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        };
    
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const currentRef = containerRef.current;
        if (currentRef) {
          observer.observe(currentRef);
        }
    
        return () => {
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        };
      }, [animateOn, hasAnimated, triggerDecrypt]);
    animateProps = animateOn === 'hover' || animateOn === 'inViewHover'
      ? {
          onMouseEnter: triggerHoverDecrypt,
          onMouseLeave: resetToPlainText
        }
      : animateOn === 'click'
        ? {
            onClick: handleClick
          }
        : {};
  };


  let __refreshing = false;
    const __refresh = () => {
      if (__refreshing) return;                     // 防重入：effect 内改 state 不级联重跑
      __refreshing = true;
      try { build(); __buildDom(); __disposeEffects(); __runEffects(false); } catch (e) {} finally { __refreshing = false; }
    };

  /* ---------- 状态（useState → 可变变量 + setter） ---------- */
  displayText = (__v => (typeof __v === 'function' ? __v() : __v))(text);
  const setDisplayText = (v) => { const __nv = (typeof v === 'function' ? v(displayText) : v); if (Object.is(__nv, displayText)) return; displayText = __nv; __refresh(); };
  isAnimating = (__v => (typeof __v === 'function' ? __v() : __v))(false);
  const setIsAnimating = (v) => { const __nv = (typeof v === 'function' ? v(isAnimating) : v); if (Object.is(__nv, isAnimating)) return; isAnimating = __nv; __refresh(); };
  revealedIndices = (__v => (typeof __v === 'function' ? __v() : __v))(new Set());
  const setRevealedIndices = (v) => { const __nv = (typeof v === 'function' ? v(revealedIndices) : v); if (Object.is(__nv, revealedIndices)) return; revealedIndices = __nv; __refresh(); };
  hasAnimated = (__v => (typeof __v === 'function' ? __v() : __v))(false);
  const setHasAnimated = (v) => { const __nv = (typeof v === 'function' ? v(hasAnimated) : v); if (Object.is(__nv, hasAnimated)) return; hasAnimated = __nv; __refresh(); };
  isDecrypted = (__v => (typeof __v === 'function' ? __v() : __v))(animateOn !== 'click');
  const setIsDecrypted = (v) => { const __nv = (typeof v === 'function' ? v(isDecrypted) : v); if (Object.is(__nv, isDecrypted)) return; isDecrypted = __nv; __refresh(); };
  direction = (__v => (typeof __v === 'function' ? __v() : __v))('forward');
  const setDirection = (v) => { const __nv = (typeof v === 'function' ? v(direction) : v); if (Object.is(__nv, direction)) return; direction = __nv; __refresh(); };

    build();  // 修复：必须在状态初始化之后首次构建（原在初始化之前，读到 undefined 状态）

/* ---------- DOM 结构（refresh 时整体重建，对齐 React re-render） ---------- */
  const __label = Array.from(container.childNodes).filter(n => n.nodeType === 1 && /label/.test(n.className || ''));
  const __buildDom = () => {
    while (container.firstChild) container.removeChild(container.firstChild);
    if (__label) __label.forEach(n => container.appendChild(n));
  if (parentClassName) container.className = [container.className, ...String(parentClassName).split(' ')].filter(Boolean).join(' ');
  const spanEl1 = document.createElement('span');
  Object.assign(spanEl1.style, styles.srOnly || {});
  __appendNode(spanEl1, displayText);
  container.appendChild(spanEl1);
  const spanEl2 = document.createElement('span');
  spanEl2.setAttribute('aria-hidden', String("true"));
    ((displayText.split('')) || []).forEach((char, index) => {
      const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);
      const spanEl3 = document.createElement('span');
      spanEl3.className = isRevealedOrDone ? className : encryptedClassName;
      __appendNode(spanEl3, char);
      spanEl2.appendChild(spanEl3);
    });
  container.appendChild(spanEl2);
  };
  __buildDom();

  /* ---------- effects（状态变化后可重跑，对齐 React 行为） ---------- */
  const __fxDefs = [
    { once: false, run: () => {
          
              if (!isAnimating) return;
          
              let currentIteration = 0;
          
              const getNextIndex = revealedSet => {
                const textLength = text.length;
                switch (revealDirection) {
                  case 'start':
                    return revealedSet.size;
                  case 'end':
                    return textLength - 1 - revealedSet.size;
                  case 'center': {
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(revealedSet.size / 2);
                    const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
          
                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                      return nextIndex;
                    }
          
                    for (let i = 0; i < textLength; i++) {
                      if (!revealedSet.has(i)) return i;
                    }
                    return 0;
                  }
                  default:
                    return revealedSet.size;
                }
              };
          
              intervalRef.current = setInterval(() => {
                setRevealedIndices(prevRevealed => {
                  if (sequential) {
                    // Forward
                    if (direction === 'forward') {
                      if (prevRevealed.size < text.length) {
                        const nextIndex = getNextIndex(prevRevealed);
                        const newRevealed = new Set(prevRevealed);
                        newRevealed.add(nextIndex);
                        setDisplayText(shuffleText(text, newRevealed));
                        return newRevealed;
                      } else {
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setIsDecrypted(true);
                        return prevRevealed;
                      }
                    }
                    // Reverse
                    if (direction === 'reverse') {
                      if (pointerRef.current < orderRef.current.length) {
                        const idxToRemove = orderRef.current[pointerRef.current++];
                        const newRevealed = new Set(prevRevealed);
                        newRevealed.delete(idxToRemove);
                        setDisplayText(shuffleText(text, newRevealed));
                        if (newRevealed.size === 0) {
                          clearInterval(intervalRef.current);
                          setIsAnimating(false);
                          setIsDecrypted(false);
                        }
                        return newRevealed;
                      } else {
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setIsDecrypted(false);
                        return prevRevealed;
                      }
                    }
                  } else {
                    // Non-Sequential
                    if (direction === 'forward') {
                      setDisplayText(shuffleText(text, prevRevealed));
                      currentIteration++;
                      if (currentIteration >= maxIterations) {
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setDisplayText(text);
                        setIsDecrypted(true);
                      }
                      return prevRevealed;
                    }
          
                    // Non-Sequential Reverse
                    if (direction === 'reverse') {
                      let currentSet = prevRevealed;
                      if (currentSet.size === 0) {
                        currentSet = fillAllIndices();
                      }
                      const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
                      const nextSet = removeRandomIndices(currentSet, removeCount);
                      setDisplayText(shuffleText(text, nextSet));
                      currentIteration++;
                      if (nextSet.size === 0 || currentIteration >= maxIterations) {
                        clearInterval(intervalRef.current);
                        setIsAnimating(false);
                        setIsDecrypted(false);
                        // ensure final scrambled state
                        setDisplayText(shuffleText(text, new Set()));
                        return new Set();
                      }
                      return nextSet;
                    }
                  }
                  return prevRevealed;
                });
              }, speed);
          
              return () => clearInterval(intervalRef.current);
            
    } },
    { once: false, run: () => {
          
              if (animateOn === 'click') {
                encryptInstantly();
              } else {
                setDisplayText(text);
                setIsDecrypted(true);
              }
              setRevealedIndices(new Set());
              setDirection('forward');
            
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
      text = currentOptions.text;
      speed = currentOptions.speed;
      maxIterations = currentOptions.maxIterations;
      sequential = currentOptions.sequential;
      revealDirection = currentOptions.revealDirection;
      useOriginalCharsOnly = currentOptions.useOriginalCharsOnly;
      characters = currentOptions.characters;
      className = currentOptions.className;
      parentClassName = currentOptions.parentClassName;
      encryptedClassName = currentOptions.encryptedClassName;
      animateOn = currentOptions.animateOn;
      clickMode = currentOptions.clickMode;
      build();

    }
  };
}

export default createDecryptedText;
export { createDecryptedText };
