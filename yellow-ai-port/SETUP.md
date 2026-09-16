# Yellow.ai Nexus setup — Cursor skills port

This folder ports all 38 Cursor skills from `~/.cursor/skills/` into a format Yellow.ai Nexus can use.

**You cannot use `/skill-name` in Yellow.ai chat.** Instead: upload KB docs, create 6 KB tools, paste agent instructions.

## 1. Upload knowledge base (Atlas)

1. Open **Nexus → Atlas → Knowledge Base**.
2. Create folders matching categories (or use metadata):
   - `design-ui`
   - `react-vercel`
   - `accessibility`
   - `writing`
   - `engineering`
   - `marketing`
3. Upload all files from `knowledge-base/<category>/*.md`.
4. For each document, set custom metadata (see `kb-metadata.csv`):
   - `category` — folder name
   - `skill_id` — filename without `.md`
5. Optional: also upload `knowledge-base/design-ui/ui-ux-pro-max-references.md`.

## 2. Create 6 Knowledge Base tools

Go to **AI Agent → Tools → Add Tool → Knowledge Base** for each row in `tool-definitions/category-kb-tools.json`:

| Tool name | When to use |
|-----------|-------------|
| `kb_design_ui` | UI/UX, design systems, typography, brand |
| `kb_react_vercel` | React, Next.js, Vercel |
| `kb_accessibility` | WCAG, a11y audits |
| `kb_writing` | Docs voice, communication style |
| `kb_engineering` | Architecture, conventions, compliance |
| `kb_marketing` | Campaigns, AEO |

For each tool:
- Copy **description** from the JSON file (important — the LLM reads this).
- In **KB Config**, filter by metadata `category` = matching category.
- Set confidence ~0.7, enable conversation history.

## 3. Configure your agent

1. **AI Agent → Agents** → create or edit your chat agent.
2. Paste contents of `agent-instructions/master-agent-instructions.md` into **Instructions**.
3. Append routing rules from `agent-instructions/routing-logic.md`.
4. Attach all 6 KB tools to the agent (or publish via **Global tools**).

## 4. Test in Playground

Try prompts that map to skills:

```
Review my landing page for generic AI aesthetics
```
→ should call `@kb_design_ui`, apply frontend-design / ux-impact guidance.

```
How do I fix React waterfall data fetching in Next.js?
```
→ `@kb_react_vercel` / react-perf.

```
Audit this page for WCAG accessibility
```
→ `@kb_accessibility` / accessibility-audit methodology.

## 5. Action skills (optional workflows)

These Cursor skills run **scripts** and cannot work from KB alone. Add Yellow.ai **Custom Function** or **Workflow** tools later if needed:

| Skill | What you'd wire up |
|-------|-------------------|
| `vercel-deploy` | HTTP/webhook to deploy service |
| `accessibility-scan` | Function calling `@accesslint/cli` against a URL |
| `ui-ux-pro-max` | Function running Python `search.py` (requires server) |

Guidance-only content for these is already in the KB files.

## Files in this package

| Path | Purpose |
|------|---------|
| `knowledge-base/` | 38+ markdown docs for Atlas upload |
| `kb-metadata.csv` | Metadata for each KB document |
| `manifest.json` | Full skill index with descriptions |
| `tool-definitions/category-kb-tools.json` | 6 KB tool configs |
| `tool-definitions/all-skills.json` | Per-skill metadata (reference) |
| `agent-instructions/master-agent-instructions.md` | Paste into agent Instructions |
| `agent-instructions/routing-logic.md` | Routing snippets with `@kb_*` |

## Regenerate from Cursor skills

```bash
python3 /workspace/yellow-ai-port/scripts/export-from-cursor-skills.py
```

(After updating `~/.cursor/skills/` locally.)
