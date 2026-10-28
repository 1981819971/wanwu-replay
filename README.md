# 万物有声 · 可回放

一支 22.5 秒的一镜到底动效片，和一段能被你倒着滚回去的代码。

线上：https://wanwu-replay.app.workbuddy.host/?sharecode=GM76WSCYMR

## 这是什么

《万物有声》原本是一支离线渲染的动效短片。它的渲染引擎没有时间轴，只有一句话：

> 给定时间 t，返回这一刻的所有像素。

这个约束让它多了一种活法——同一份引擎代码，换个驱动源就换一种介质：

| 驱动 | 产物 |
|---|---|
| `requestAnimationFrame` | 1920×1080 / 60fps 成片 |
| `scrollY` | 这一页。滚动条就是播放条，往回滚就倒放 |
| 输入框 | 手拖到任意一秒定格 |

站里第一章就是这个：纸色幕布上下拉开进入放映，滚多少放多少，右下角实时显示 `00:00.00` 格式的时间码。滚完幕布合上，回到纸面。

## 技术上的三件事

**1. 逐帧可 seek 是前提。** 引擎暴露 `__seek(t)`，任何 t 都是一次纯计算，不依赖前一帧的状态。所以倒放不需要额外实现——往回滚就是把 t 调小。

**2. 接片子，不重写。** `public/film/index.html` 是原片的完整副本，加了 `?embed` 参数：关掉它自己的滚轮接管和播放条，只暴露 `__seekNow(t)`。父页面滚动 → 调这个函数。像素和成片一致，没有重绘一套。

iframe 设 `pointer-events: none`，滚轮事件直接落到父页面；鼠标位置由父页面转发进去，光栅视角仍然跟着鼠标走。

**3. 每帧不改 React state。** 滚动回调里直接写 DOM（`textContent`、`transform`），60 次/秒重渲染整个 section 是不必要的开销。

## 实测

headless Edge（软件合成）测的，真机有 GPU 会更高：

- 单帧 seek：中位 **4.8ms**，p90 **8.8ms**，675 个采样点无一次超过 33ms（60fps 预算是 16.7ms）
- 连续推 1350 帧：约 **55fps**
- 倒放验证：滚到 3000px → `00:09.51`，回退到 2000px → `00:04.25`，再前进到 3600px → `00:12.67`

没跑满 60 帧是片子本身的设计成本——单帧要画 3808 张卡片，原片是离线渲的。

## 目录

```
src/
  sections/      六章，章节号即时间码        S00 片头 · S01 全片 · S02 引擎 · S03 组件 · S04 数据 · S05 落款
  engine/        useEngine —— 把 UMD 引擎接进 React
  fx/            四个动效组件，统一走 defineFx 适配器
  hooks/         useRaf / useTrackProgress
public/
  film/          原片副本 + 引擎（motion.js / ui_kit.js）
```

`src/fx/defineFx.tsx` 是个薄适配器：把「一个有 `create(container, options)` 和 `destroy()` 的原生组件」收敛成标准 React 组件。`useEffect` 挂载、卸载时 destroy、options 变化时重建。这样一批零依赖的 vanilla 组件可以直接当 React 用。

## 跑起来

```bash
npm install
npm run dev      # 开发
npm run build    # 构建到 dist/
```

引擎是 UMD，挂在 `window.OM` 上，不需要构建即可在浏览器里直接用。

## 说明

- `public/film/looks/fonts/` 里的字体文件未入库（授权原因），缺失时回落到系统等宽/衬线字体，排版结构不受影响。
- `public/stills/` 的静帧是从成片里抽的，同样未入库。
- 站内第三章展示的四个动效组件，源码在 `src/fx/`，是从 ReactBits 的 199 件里逐件转成零依赖原生 JS 后接入的。
