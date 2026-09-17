#!/usr/bin/env python3
"""Export ~/.cursor/skills to Yellow.ai Nexus KB + tool definitions."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

SRC = Path.home() / '.cursor/skills'
OUT = Path(__file__).resolve().parents[1]

CATEGORIES = {
    'design-ui': [
        'frontend-design', 'ui-ux-pro-max', 'ux-controlled', 'ux-innovative', 'ux-impact',
        'design-audit', 'relationship-design', 'typography', 'web-design-guidelines',
        'brand', 'design', 'design-system', 'ui-styling', 'slides', 'banner-design',
    ],
    'react-vercel': [
        'react-perf', 'react-native', 'react-composition', 'react-transitions',
        'vercel-deploy', 'vercel-cli', 'vercel-optimize',
    ],
    'accessibility': [
        'accessibility-scan', 'accessibility-inspect', 'accessibility-audit',
        'accessibility-fix', 'accessibility-diff',
    ],
    'writing': ['writing-guidelines', 'adaptive-communication', 'hungarian-humanizer'],
    'engineering': [
        'code-conventions', 'renaissance-architecture', 'human-architect-mindset',
        'vanity-engineering-review', 'negentropy-lens', 'eu-ai-act-reviewer',
    ],
    'marketing': ['insurgent-campaign', 'bencium-aeo'],
}

skill_to_cat = {s: c for c, skills in CATEGORIES.items() for s in skills}


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith('---'):
        return {}, text
    parts = text.split('---', 2)
    if len(parts) < 3:
        return {}, text
    fm: dict[str, str] = {}
    for line in parts[1].strip().splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            fm[k.strip()] = v.strip().strip('"\'')
    return fm, parts[2].lstrip('\n')


def collect_skill_docs(skill_dir: Path) -> list[tuple[str, Path, dict, str]]:
    docs: list[tuple[str, Path, dict, str]] = []
    skill_md = skill_dir / 'SKILL.md'
    if skill_md.exists():
        fm, body = parse_frontmatter(skill_md.read_text(errors='replace'))
        docs.append(('SKILL', skill_md, fm, body))
    for p in sorted(skill_dir.rglob('*')):
        if p == skill_md or not p.is_file():
            continue
        if p.suffix.lower() in {'.md', '.txt'} and p.stat().st_size < 500_000:
            docs.append(('REF', p, {}, p.read_text(errors='replace')))
    if skill_dir.name.startswith('accessibility-') and (SRC / 'shared').exists():
        for p in (SRC / 'shared').rglob('*.md'):
            docs.append(('SHARED', p, {}, p.read_text(errors='replace')))
    return docs


def main() -> None:
    kb = OUT / 'knowledge-base'
    tools = OUT / 'tool-definitions'
    if kb.exists():
        shutil.rmtree(kb)
    kb.mkdir(parents=True)
    tools.mkdir(parents=True)

    manifest = []
    tool_defs = []

    for skill_dir in sorted(SRC.iterdir()):
        if not skill_dir.is_dir() or skill_dir.name in {'shared'}:
            continue
        if not (skill_dir / 'SKILL.md').exists():
            continue
        name = skill_dir.name
        cat = skill_to_cat.get(name, 'general')
        cat_dir = kb / cat
        cat_dir.mkdir(parents=True, exist_ok=True)
        docs = collect_skill_docs(skill_dir)
        combined = [
            f'# Skill: {name}\n',
            f'**Category:** {cat}\n',
            f'**Cursor invoke:** `/{name}`\n',
            '---\n',
        ]
        for kind, path, _fm, body in docs:
            rel = path.relative_to(skill_dir) if path.is_relative_to(skill_dir) else path.name
            combined.append(f'\n## {kind}: {rel}\n\n{body.strip()}\n')
        (cat_dir / f'{name}.md').write_text('\n'.join(combined))
        fm0 = docs[0][2] if docs else {}
        desc = fm0.get('description', f'Guidance skill: {name}')[:500]
        manifest.append({
            'skill_id': name,
            'category': cat,
            'title': name.replace('-', ' ').title(),
            'description': desc,
            'cursor_invoke': f'/{name}',
        })
        tool_defs.append({
            'name': f'skill_{name.replace("-", "_")}',
            'display_name': name,
            'description': desc,
            'kb_metadata': {'skill_id': name, 'category': cat},
        })

    uupm = SRC / 'ui-ux-pro-max'
    if (uupm / 'references').exists():
        parts = ['# UI/UX Pro Max — reference appendices\n']
        for p in sorted((uupm / 'references').glob('*.md')):
            parts.append(f'\n## {p.name}\n\n{p.read_text()}\n')
        (kb / 'design-ui' / 'ui-ux-pro-max-references.md').write_text(''.join(parts))

    cat_tools = []
    for cat, skills in CATEGORIES.items():
        cat_tools.append({
            'name': f'kb_{cat.replace("-", "_")}',
            'type': 'Knowledge Base',
            'description': (
                f"Search curated {cat.replace('-', ' ')} guidance ported from Cursor Agent Skills. "
                f"Covers: {', '.join(skills)}."
            ),
            'input_schema': {'query': {'type': 'string'}},
            'kb_config': {'filter_by_metadata': {'category': cat}, 'confidence_threshold': 0.7},
        })

    (OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2))
    (tools / 'all-skills.json').write_text(json.dumps(tool_defs, indent=2))
    (tools / 'category-kb-tools.json').write_text(json.dumps(cat_tools, indent=2))

    meta = ['filename,category,skill_id,title\n']
    for f in sorted(kb.rglob('*.md')):
        rel = f.relative_to(kb)
        cat = rel.parts[0]
        skill_id = f.stem
        meta.append(f'{rel},{cat},{skill_id},{skill_id.replace("-", " ").title()}\n')
    (OUT / 'kb-metadata.csv').write_text(''.join(meta))

    print(f'Exported {len(manifest)} skills to {OUT}')


if __name__ == '__main__':
    main()
