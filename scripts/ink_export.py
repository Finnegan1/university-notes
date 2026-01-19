#!/usr/bin/env python3
"""Export Obsidian Ink drawings to SVG and update embeds.

- Reads `handdrawn-ink` code blocks in markdown files under `content/`.
- Exports the drawing's preview SVG into `content/assets/ink/`.
- Replaces the code block with an Obsidian embed sized from width/aspectRatio.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

CONTENT_DIR = Path("content")
ASSETS_DIR = CONTENT_DIR / "assets" / "ink"

CODE_BLOCK_RE = re.compile(
    r"```handdrawn-ink\s*(\{.*?\})\s*```",
    re.DOTALL,
)

EMBED_DIMENSION_RE = re.compile(r"(!\[\[[^\]|]+\|)([0-9.]+)x([0-9.]+)(\]\])")


def parse_embed_json(raw_json: str, source_path: Path) -> dict:
    try:
        return json.loads(raw_json)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {source_path}: {exc}") from exc


def normalize_drawing_path(filepath: str) -> Path:
    candidate = Path(filepath)
    if candidate.is_absolute():
        return candidate
    return CONTENT_DIR / candidate


def extract_preview_svg(drawing_path: Path) -> str:
    try:
        data = json.loads(drawing_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {drawing_path}: {exc}") from exc

    preview = data.get("previewUri")
    if not preview:
        raise ValueError(f"Missing previewUri in {drawing_path}")
    return preview


def export_svg(svg_content: str, drawing_path: Path) -> Path:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = ASSETS_DIR / f"{drawing_path.stem}.svg"
    output_path.write_text(svg_content, encoding="utf-8")
    return output_path


def format_dimension(value: float) -> str:
    rounded = round(float(value), 2)
    if rounded.is_integer():
        return str(int(rounded))
    return f"{rounded:.2f}".rstrip("0").rstrip(".")


def render_embed(svg_path: Path, width: int | float, aspect_ratio: float) -> str:
    width_value = float(width)
    height_value = width_value / float(aspect_ratio)
    rel_path = svg_path.relative_to(CONTENT_DIR)
    return f"![[{rel_path}|{format_dimension(width_value)}x{format_dimension(height_value)}]]"


def normalize_embed_dimensions(markdown: str) -> str:
    def _normalize(match: re.Match) -> str:
        return (
            f"{match.group(1)}"
            f"{format_dimension(float(match.group(2)))}"
            f"x{format_dimension(float(match.group(3)))}"
            f"{match.group(4)}"
        )

    return EMBED_DIMENSION_RE.sub(_normalize, markdown)


def replace_blocks(markdown: str, source_path: Path) -> tuple[str, int]:
    replacements = 0

    def _replace(match: re.Match) -> str:
        nonlocal replacements
        embed_data = parse_embed_json(match.group(1), source_path)
        filepath = embed_data.get("filepath")
        if not filepath:
            raise ValueError(f"Missing filepath in {source_path}")
        width = embed_data.get("width")
        aspect_ratio = embed_data.get("aspectRatio")
        if width is None or aspect_ratio in (None, 0):
            raise ValueError(f"Missing width/aspectRatio in {source_path}")

        drawing_path = normalize_drawing_path(filepath)
        if not drawing_path.exists():
            raise FileNotFoundError(f"Missing drawing: {drawing_path}")

        svg_content = extract_preview_svg(drawing_path)
        svg_path = export_svg(svg_content, drawing_path)
        replacements += 1
        return render_embed(svg_path, width, aspect_ratio)

    updated = CODE_BLOCK_RE.sub(_replace, markdown)
    if updated != markdown:
        updated = normalize_embed_dimensions(updated)
    return updated, replacements


def process_markdown_files() -> int:
    total_replacements = 0
    for md_path in CONTENT_DIR.rglob("*.md"):
        markdown = md_path.read_text(encoding="utf-8")
        if "handdrawn-ink" not in markdown:
            continue
        updated, replacements = replace_blocks(markdown, md_path)
        if replacements:
            md_path.write_text(updated, encoding="utf-8")
            total_replacements += replacements
    return total_replacements


def main() -> None:
    replacements = process_markdown_files()
    print(f"Updated {replacements} ink embed(s).")


if __name__ == "__main__":
    main()
