# Signed copy tests

Unit, harness, and end-to-end coverage for the Signed copy feature
(`docs/prd-signed-copy.md`).

## Unit tests

From the repo root:

```bash
node --test tests/signed_copy/unit/*.test.js
```

Also runs the G7 purity check when present:

```bash
node --test tests/signed_copy/e2e/purity.test.js
```

Fixtures live in `fixtures/`. Golden `.txt` files are stored **without** a
trailing newline. When comparing, strip an editor-added final newline:

```js
fs.readFileSync(path, "utf8").replace(/\n$/, "")
```

## Starting the desk for e2e (temporary report copy)

E2E must not mutate the committed report. Copy it to a temp path, start the
desk against that copy, then tear down:

```bash
REPORT_SRC=out/loop-report.json
TMPDIR=$(mktemp -d)
cp "$REPORT_SRC" "$TMPDIR/loop-report.json"
python3 -m nexus_loop.app --report "$TMPDIR/loop-report.json" --port 8766
# …run Playwright against http://127.0.0.1:8766/
# Decisions write into $TMPDIR/loop-report.json and $TMPDIR/decisions.log only.
```

Playwright specs under `e2e/` should spawn this themselves (or receive
`BASE_URL` / a fixture-started server).

## Harness

`harness/ui-harness.html` loads the signed-copy modules with injectable fakes.
Run harness specs with Playwright when configured:

```bash
npx playwright test tests/signed_copy/harness/ui.spec.js
```

## Baseline (G9)

`baseline/gate-undecided.png` is the gate for the default undecided Needs
attention finding, captured before the Signed copy seam was visible.
