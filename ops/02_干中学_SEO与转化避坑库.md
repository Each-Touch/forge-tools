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

### 2026-11-21｜Flagship #1 `sfx-forge` 实战踩坑与固化规则
1. **桌面 2 列预设按钮必须放宽列宽＋允许双行换行**：`266px` 左栏配 `white-space: nowrap; text-overflow: ellipsis` 会截断 `Explosion / Boom` 等 4 个标题；左栏放宽到 `304px` 且按钮文字改 `white-space: normal; line-height: 1.22` 后零截断。
2. **深色暗面板静音文本对比度基线**：`#64748b` 在 `#19212c` 上低于 4:1，统一定位 `--text-muted: #8b9bb4` 兼顾层次与 WCAG 可读性；Scope Canvas 水印文字提高至 `rgba(186, 200, 218, 0.88)`。
3. **移动端（`390×844`）必须把操作主舞台 `order: -1` 前置**：否则 12 预设 + 12 历史占满整整第一屏，用户看不到 Play 按钮和示波器。
4. **零 404 内联 SVG Favicon**：GitHub Pages 默认无 `/favicon.ico` 会导致控制台报 1 个资源 404，在 `build_hub.py` 和所有子工具 `<head>` 内联 `<link rel="icon" href="data:image/svg+xml,...">` 可彻底清零。
5. **`itch.io` 表单自动化三大硬经验**：
   - 上传主 HTML ZIP 后 `itch.io` 会自动保存草稿并跳转至 `/game/edit/<id>`，需等文件行出现后再填后续项；
   - `Add screenshots` 多选一次并发传图可能触发 `error_lightbox_widget`，建议单张顺序上传并等待 `.game_edit_form img` 数量递增；
   - `Classification` / `Kind` 走 `.selectize-input >> nth=0/1` 展开下拉框点 `[data-value="tool"]` / `[data-value="html"]`；`Tags` 通过 `document.querySelector('input[name="game[tags]"]').selectize` 写入，避免盲点不可见 placeholder input；保存后底部会有两个 `button.save_btn`，编辑页二改需指定 `button.save_btn >> nth=1`。
