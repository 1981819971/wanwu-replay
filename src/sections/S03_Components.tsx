import { useInView } from '../hooks/useScroll';
import { defineFx } from '../fx/defineFx';
import './components.css';
import '../fx/drift-wall/drift-wall.css';
import '../fx/tilted-card/tilted-card.css';
import '../fx/decrypted-text/decrypted-text.css';

const DriftWall = defineFx(() => import('../fx/drift-wall/drift-wall.js'), 'createDriftWall');
const TiltedCard = defineFx(() => import('../fx/tilted-card/tilted-card.js'), 'createTiltedCard');
const DecryptedText = defineFx(() => import('../fx/decrypted-text/decrypted-text.js'), 'createDecryptedText');

const STILLS = Array.from({ length: 10 }, (_, i) => ({
  image: `/stills/f${i + 1}.jpg`,
  title: `第 ${(i * 2.4).toFixed(1)} 秒`,
}));

const SPLIT = [
  { k: 'backgrounds', n: 60 },
  { k: 'components', n: 43 },
  { k: 'animations', n: 40 },
  { k: 'text-animations', n: 31 },
  { k: 'micro', n: 25 },
];

const FX_CODE = `// 199 件原生组件 → React 组件，只要这一句
const DriftWall = defineFx(
  () => import('./fx/drift-wall/drift-wall.js'),
  'createDriftWall',
);

// 用起来和普通组件没有区别；active 一翻，实例就真被销毁
<DriftWall active={hover} opts={{ columns: 5, speed: 42 }} />`;

export default function S03_Components() {
  // 进视口才初始化：一进页面就挂 199 件里的三件、各自跑 rAF，是没必要的开销
  const { ref: wallRef, inView: wallOn } = useInView<HTMLElement>(0.25);
  const { ref: cardRef, inView: cardOn } = useInView<HTMLElement>(0.25);
  const { ref: textRef, inView: textOn } = useInView<HTMLElement>(0.25);

  return (
    <section className="sec fxs" id="components">
      <div className="sec-inner">
        <div className="sec-head">
          <span className="eyebrow">03 — 器 / THE COMPONENTS</span>
          <h2 className="serif-h sec-h">199 件，一个接口。</h2>
          <p className="lead">
            把 ReactBits 的 {SPLIT.reduce((a, b) => a + b.n, 0)} 件动效组件逐件从 React 源码转成零依赖原生 JS，
            修掉转换器带出来的一批系统性缺陷；再把它们全部收敛成同一套 React 接口。
            下面这几件都是真在跑的，不是录屏。
          </p>
        </div>

        <div className="fx-split">
          {SPLIT.map((s) => (
            <div className="fx-split-item" key={s.k}>
              <span className="mono fx-split-n">{s.n}</span>
              <span className="mono fx-split-k">{s.k}</span>
            </div>
          ))}
        </div>

        <div className="fx-grid">
          <article
            className="fx-card fx-card--wide fx-card--dark"
            ref={wallRef as React.Ref<HTMLElement>}
          >
            <div className="fx-stage fx-stage--wall">
              <DriftWall active={wallOn} opts={{ items: STILLS, columns: 5, tileWidth: 176, tileHeight: 116, speed: 32, dim: 0.82, fade: 0.9, overlayColor: '#080b18', pauseOnHover: true }} />
            </div>
            <header className="fx-meta">
              <span className="fx-name">DriftWall</span>
              <span className="mono fx-tech">纯 CSS 3D 漂移墙 · 零依赖</span>
            </header>
            <p className="fx-desc">
              十帧从成片里抽出来的画面，五列反向循环，鼠标移上去就浮起。
              {wallOn ? ' 现在真在跑，不是录屏。' : ' 滚到这里才初始化。'}
            </p>
          </article>

          <article className="fx-card" ref={cardRef as React.Ref<HTMLElement>}>
            <div className="fx-stage fx-stage--tilt">
              <TiltedCard
                active={cardOn}
                opts={{
                  imageSrc: '/stills/f5.jpg',
                  altText: '万物有声 第 8.9 秒',
                  containerHeight: '240px',
                  imageHeight: '190px',
                  imageWidth: '286px',
                  captionText: '8.9s · 聚蝶',
                  rotateAmplitude: 16,
                  scaleOnHover: 1.1,
                }}
              />
            </div>
            <header className="fx-meta">
              <span className="fx-name">TiltedCard</span>
              <span className="mono fx-tech">3D 倾斜 · 图层错动</span>
            </header>
          </article>

          <article className="fx-card" ref={textRef as React.Ref<HTMLElement>}>
            <div className="fx-stage fx-stage--text">
              <div className="fx-decrypt serif-h">
                <DecryptedText
                  active={textOn}
                  opts={{ text: 'EVERYTHING HAS A VOICE', speed: 42, maxIterations: 14 }}
                />
              </div>
              <span className="mono fx-hint">悬停解密</span>
            </div>
            <header className="fx-meta">
              <span className="fx-name">DecryptedText</span>
              <span className="mono fx-tech">字符级乱码收敛</span>
            </header>
          </article>
        </div>

        <div className="fx-codewrap">
          <div className="fx-codebar">
            <span className="mono">src/fx/defineFx.tsx</span>
            <span className="mono fx-codetag">就是这么用的</span>
          </div>
          <pre className="mono fx-pre"><code>{FX_CODE}</code></pre>
        </div>
      </div>
    </section>
  );
}
