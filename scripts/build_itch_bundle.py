#!/usr/bin/env python3
"""Package a self-contained itch.io HTML5 ZIP bundle for docs/<slug>/."""

from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "docs"
RELEASES_DIR = ROOT / "releases"


def build_bundle(slug: str) -> Path:
    src_dir = DOCS_DIR / slug
    if not src_dir.is_dir() or not (src_dir / "index.html").is_file():
        raise FileNotFoundError(f"Tool directory or index.html not found: {src_dir}")

    shared_dir = DOCS_DIR / "shared"
    site_cfg_js = DOCS_DIR / "site-config.js"
    for req in (shared_dir / "theme.css", shared_dir / "monetization.js", site_cfg_js):
        if not req.is_file():
            raise FileNotFoundError(f"Required shared asset missing (run scripts/build_hub.py first): {req}")

    out_dir = RELEASES_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    zip_path = out_dir / f"{slug}-itch.zip"

    html_raw = (src_dir / "index.html").read_text(encoding="utf-8")
    html_rewritten = html_raw.replace("../shared/", "./shared/").replace("../site-config.js", "./shared/site-config.js")
    # Also rewrite home links inside topbar from ../ to https://each-touch.github.io/forge-tools/
    html_rewritten = re.sub(
        r'href="\.\./"',
        'href="https://each-touch.github.io/forge-tools/" target="_blank" rel="noopener noreferrer"',
        html_rewritten,
    )

    if "../" in html_rewritten:
        raise ValueError(f"Unresolved '../' reference remains in zipped index.html for {slug}")

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for file_path in sorted(src_dir.rglob("*")):
            if file_path.is_dir():
                continue
            rel = file_path.relative_to(src_dir).as_posix()
            if rel == "index.html":
                zf.writestr("index.html", html_rewritten.encode("utf-8"))
            else:
                zf.write(file_path, arcname=rel)

        zf.write(shared_dir / "theme.css", arcname="shared/theme.css")
        zf.write(shared_dir / "monetization.js", arcname="shared/monetization.js")
        zf.write(site_cfg_js, arcname="shared/site-config.js")

    with zipfile.ZipFile(zip_path, "r") as zf:
        bad = zf.testzip()
        if bad is not None:
            raise RuntimeError(f"ZIP integrity check failed on member: {bad}")
        names = zf.namelist()
        assert "index.html" in names
        assert "shared/theme.css" in names
        assert "shared/monetization.js" in names
        assert "shared/site-config.js" in names

    print(f"Packaged self-contained itch.io bundle -> {zip_path} ({zip_path.stat().st_size} bytes)")
    return zip_path


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/build_itch_bundle.py <slug>", file=sys.stderr)
        return 2
    build_bundle(sys.argv[1].strip())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
