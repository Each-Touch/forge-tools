# Each-Touch Forge — Autonomous Operating Manual (`AGENTS.md`)

> Scope: `/Users/zhaozixu/.gemini/antigravity/scratch/forge-tools`
> Purpose: Autonomous overseas creator & game-dev micro-tools + procedural CC0 asset factory. Zero server cost, zero external CDNs, zero generative AI in DSP/asset tools (so every tool gets maximum trust and zero itch.io AI-filter penalties).

---

## 1. Strict Red Lines (MUST NEVER VIOLATE)

1. **Zero Cross-Project Collision**: NEVER read, modify, or touch `/Users/zhaozixu/Desktop/AI短剧/运营总台/`, `/Users/zhaozixu/.gemini/antigravity/scratch/game-studio-ops/`, `/Users/zhaozixu/.gemini/antigravity/scratch/each-touch-arcade/`, or any drama/arcade repository.
2. **Browser Hygiene**: Always create a **brand-new temporary `taskSpace(...)`** in `ego-browser nodejs` after running `ego-browser skill`. Always close it in a separate final script via `await task.finish({ keep: [] })`. NEVER touch existing personal spaces (`2, 3, 27, 31, 50, 51, 54, 61, 77`).
3. **No Legal/Financial/Auth Bypass**: NEVER submit personal tax interview forms, bind PayPal/Payoneer/Wise/Stripe, click CAPTCHAs, or bypass logins. Publish on itch.io with **`Pricing: $0 or donate`（默认建议打赏 `$2.00`；纯 CC0 素材包可设 `$3.00` 建议打赏或定价）**, using the already-enabled `Collected by itch.io, paid later` mode; if login/CAPTCHA or a tax/bank blocker appears, log it cleanly and stop.
4. **Zero External CDNs / Fonts**: Every tool in `docs/<slug>/` must run 100% client-side with zero external `<script>`, CSS, or font URLs so it works offline, passes itch.io iframe CSP cleanly, and achieves top Core Web Vitals.
5. **No Generative AI in Procedural Tools**: Keep every tool strictly mathematical/DSP/canvas/algorithmic so itch.io `Generative AI disclosure` stays **`No — This project does not contain the output of Generative AI`**.
6. **Visual Inspection Boundary**: NEVER call `read_file` on screenshots in the main conversation; always dispatch `research` (`Model: "pro"`) subagent to audit desktop, mobile (`390x844`), hub, and cover PNGs before deployment.

---

## 2. 5-Stage Autonomous Production Loop (Every Tue/Thu/Sat 14:00 Asia/Shanghai)

1. **Stage 1 — Learn & Check Metrics**:
   - Read `ops/00_总控蓝图与变现台账.md`, `ops/01_高需求工具词库与排期池.md`, `ops/02_干中学_SEO与转化避坑库.md`, `site-config.json`, `tools-catalog.json`.
   - Run `python3 scripts/fetch_metrics.py` to pull GitHub Pages traffic (`views` / `clones`) and optionally inspect `https://itch.io/dashboard` (read-only in temporary TaskSpace) for Views/Downloads/Browser Plays.
   - Pick the first `TODO` item in `ops/01_高需求工具词库与排期池.md` and mark it `IN_PROGRESS`. If fewer than 2 `TODO` items remain, research high-intent creator/indie-dev tool queries and replenish the backlog.
2. **Stage 2 — Build & Package**:
   - Build a genuine, fast, deep, useful tool in `docs/<slug>/` (`index.html`, `app.js`, `style.css`), linking `../shared/theme.css`, `../site-config.js`, and `../shared/monetization.js`.
   - Include high-DPI live preview, keyboard shortcuts, deterministic export (WAV/ZIP/PNG/JSON/SRT/CSS), concise How-To-Use + CC0/Privacy FAQ + JSON-LD `SoftwareApplication` & `FAQPage` schemas below the fold.
   - Generate a crisp `630x500` itch.io cover (`releases/<slug>/cover_630x500.png`).
   - Update `tools-catalog.json`, run `python3 scripts/build_hub.py`, and if shipping to itch.io run `python3 scripts/build_itch_bundle.py <slug>`.
3. **Stage 3 — Real Browser QA + `pro` Visual Gate**:
   - Serve `docs/` via temporary `python3 -m http.server` on an ephemeral local port (kill PID right after QA).
   - Test in a new temporary `ego-browser` TaskSpace across `1280x800` and `390x844`: verify zero console/page errors, zero failed requests, zero horizontal overflow (`scrollWidth <= innerWidth`), real interactive controls, and real file downloads (validate exported bytes/ZIP integrity).
   - Capture screenshots and dispatch `research` (`Model: "pro"`) subagent to verify visual alignment, contrast, legibility, mobile layout, and cover safe margins (`VERDICT: PASS`). Fix any `FIX_NEEDED` before publishing.
4. **Stage 4 — Deploy & Distribute**:
   - Commit & push to `Each-Touch/forge-tools` `main` branch (`docs/` deployed automatically via GitHub Pages) and verify live URLs + `sitemap.xml` return `HTTP 200`.
   - If the slot targets itch.io (`Web Hub + itch.io Tools` or `Game Assets`), publish on `https://itch.io/game/new` with **`Pricing: $0 or donate`（默认建议打赏 `$2.00`；素材包可设 `$3.00`）**, `Generative AI: No`, self-contained `-itch.zip`, `1280x720` HTML5 embed (`Mobile friendly` + `Fullscreen button`), cover + screenshots, then verify the live itch.io page and update `itchUrl` in `tools-catalog.json` + rebuild hub + push.
5. **Stage 5 — Update Ledgers & Compound Lessons**:
   - Mark the slot `DONE` in `ops/01_高需求工具词库与排期池.md`, update `ops/00_总控蓝图与变现台账.md` with live URLs & metrics, and record concrete technical/SEO/itch.io lessons in `ops/02_干中学_SEO与转化避坑库.md`.
