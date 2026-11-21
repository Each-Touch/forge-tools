# 干中学｜SEO、itch.io 分发与转化避坑库

> 每次任务完成后必须沉淀真实踩坑、验证规律与高转化经验，确保后续工具越做越快、流量越滚越大。

---

## 一、基线工程与分发铁律

1. **Zero External CDN / Font Rule**：所有工具页严格禁止引入外部 CSS/JS/Google Fonts；统一使用系统字体栈与相对路径共享资源，既保证离线秒开与 Lighthouse 满分，也彻底避免在 `itch.io` 沙盒 `iframe` 中被 CSP 拦截或 404。
2. **itch.io Iframe Path Self-Containment**：网页主站里工具页引用 `../shared/theme.css` 与 `../site-config.js`，但打 `itch.io` ZIP 包时 `index.html` 位于压缩包根目录，`../` 路径会直接 404！必须由 `scripts/build_itch_bundle.py` 将共享文件打入压缩包内的 `./shared/` 并自动改写引用为 `./shared/...`，同时校验包内零残余 `../`。
3. **Zero Generative AI Advantage on itch.io**：在 `itch.io` 上将数学/DSP/Canvas 程序化工具诚实勾选 `Generative AI: No`，可以保留在默认搜索与分类榜单中不被 AI 过滤标签隐藏，同时给游戏开发者和视频作者「绝对干净无版权争议（CC0）」的强购买/下载理由。
4. **JSON-LD + FAQ SEO Formula**：每个工具页首屏即用（App-first，不要把长文挡在交互区上方），在折叠区/下方附清晰的 `How to Use`、`CC0 & Privacy Promise`、`FAQ`，并注入 `SoftwareApplication` 与 `FAQPage` 结构化数据与 `sitemap.xml`，吃稳长尾英文搜索词。
5. **Central Monetization Switchboard**：所有页面加载同一份 `docs/site-config.js` + `docs/shared/monetization.js`；未填入 `adsenseClientId` / `supportUrl` 前保持隐形不留难看的空广告框，一旦填入配置并 `build_hub.py` 即可全站一次性开启变现。

---

## 二、实盘沉淀日志

- *待 2026-11-21 首轮上线实战后追加记录。*
