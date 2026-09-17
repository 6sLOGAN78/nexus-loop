"use client";

// Client-side orchestrator. Ported from the boot code / render() / event
// wiring at the bottom of nexus_loop/static/index.html (lines ~1851-1907),
// re-expressed as React state instead of module-level mutable variables
// (selectedKey, listFilter) and manual re-render() calls.
import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { getHealth, getReport, postGenerate } from "@/lib/api";
import { createNexusDesk } from "@/lib/nexusDesk";
import { SAFE_KEY, currentPack, filterForPack, keyFromHash, selectFirstInFilter } from "@/lib/report";
import type { Bucket, Pack, Report } from "@/lib/types";
import { Detail } from "./Detail";
import { Footer } from "./Footer";
import { Gate } from "./Gate";
import { Header } from "./Header";
import { ListColumn } from "./ListColumn";
import { ModeBar } from "./ModeBar";

const EMPTY_PACK: Pack = { kind: "regression", f: null, d: null, p: null, v: null };

export function Desk() {
  const [rep, setRep] = useState<Report | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(() => keyFromHash());
  const [listFilter, setListFilter] = useState<Bucket>("open");
  const [alignPending, setAlignPending] = useState(true);
  const [signedCopyReady, setSignedCopyReady] = useState(false);
  const [genBusy, setGenBusy] = useState(false);
  const [genFlash, setGenFlash] = useState<{ text: string; tone: "" | "ok" | "err" } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { pack, key: resolvedKey } = useMemo(() => {
    if (!rep) return { pack: EMPTY_PACK, key: selectedKey };
    return currentPack(rep, selectedKey);
  }, [rep, selectedKey]);

  // Initial load: health (for the generate-disabled notice) + report.json.
  useEffect(() => {
    getHealth()
      .then((h) => {
        if (h && h.generate === false) setGenFlash({ text: "Enable with --allow-generate", tone: "" });
      })
      .catch(() => {});
    getReport()
      .then((next) => {
        setRep(next);
        setAlignPending(true);
      })
      .catch((e: Error) => setLoadError(e.message));
  }, []);

  // Hash-driven selection changes (back/forward, external links to #finding-id).
  useEffect(() => {
    function onHashChange() {
      setSelectedKey(keyFromHash());
      setAlignPending(true);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Mirrors `if (opts.alignFilter) listFilter = filterForPack(pack)`.
  useEffect(() => {
    if (alignPending && rep) {
      setListFilter(filterForPack(pack));
      setAlignPending(false);
    }
  }, [alignPending, rep, pack]);

  // Mirrors `if (f && !selectedKey) selectedKey = f.id;` inside currentPack():
  // silently adopt the resolved default finding without rewriting the URL hash.
  useEffect(() => {
    if (rep && resolvedKey && resolvedKey !== selectedKey) {
      setSelectedKey(resolvedKey);
    }
  }, [rep, resolvedKey, selectedKey]);

  // window.NexusDesk -- the frozen seam the Signed copy subsystem (and any
  // future UX-PRD work) reads through. Recomputed whenever the report or the
  // selected finding changes so it always reflects what's on screen.
  useEffect(() => {
    window.__rep = rep || undefined;
    const selected = pack.kind !== "gap" ? pack.f : null;
    window.NexusDesk = Object.freeze(createNexusDesk(rep, () => selected));
  }, [rep, pack]);

  function doSelect(key: string) {
    if (key && !SAFE_KEY.test(key)) return;
    setSelectedKey(key);
    if (key) window.history.replaceState(null, "", "#" + key);
  }

  function onModeSelect(bucket: Bucket) {
    setListFilter(bucket);
    if (rep && filterForPack(pack) !== bucket) {
      const key = selectFirstInFilter(rep, bucket);
      if (key) doSelect(key);
    }
  }

  function onListSelect(key: string) {
    doSelect(key);
    if (rep) {
      const { pack: p2 } = currentPack(rep, key);
      setListFilter(filterForPack(p2));
    }
  }

  async function onGenerate() {
    setGenBusy(true);
    setGenFlash({ text: "Generating…", tone: "" });
    try {
      const summary = await postGenerate();
      const next = await getReport();
      setRep(next);
      setAlignPending(true);
      const nVer = summary && summary.verifications != null ? summary.verifications : "—";
      setGenFlash({ text: `Updated · ${summary.findings || 0} findings · ${nVer} tests`, tone: "ok" });
    } catch (e) {
      setGenFlash({ text: String((e as Error).message || e), tone: "err" });
    } finally {
      setGenBusy(false);
    }
  }

  return (
    <>
      <Script src="/signed-copy/contract.js" strategy="afterInteractive" />
      <Script src="/signed-copy/template.js" strategy="afterInteractive" />
      <Script src="/signed-copy/summary.js" strategy="afterInteractive" />
      <Script src="/signed-copy/adapter.js" strategy="afterInteractive" />
      <Script src="/signed-copy/ui.js" strategy="afterInteractive" onLoad={() => setSignedCopyReady(true)} />
      <a className="skip" href="#detail">
        Skip to the finding
      </a>
      <div className="app">
        <Header rep={rep} onGenerate={onGenerate} genBusy={genBusy} genFlash={genFlash} />
        {rep ? (
          <>
            <ModeBar rep={rep} listFilter={listFilter} onSelect={onModeSelect} />
            <div className="shell">
              <ListColumn rep={rep} listFilter={listFilter} selectedKey={selectedKey} onSelect={onListSelect} />
              <Detail rep={rep} pack={pack} />
              <Gate pack={pack} signedCopyReady={signedCopyReady} onReportUpdated={setRep} />
            </div>
          </>
        ) : (
          <>
            <nav className="mode-bar" id="modebar" role="tablist" aria-label="Finding groups" />
            <div className="shell">
              <nav className="list-col" id="list" aria-label="Findings" tabIndex={0} />
              <article className="detail" id="detail">
                <p className="idle">
                  {loadError || (
                    <>
                      Waiting for <code>loop-report.json</code>.
                    </>
                  )}
                </p>
              </article>
              <aside className="gate-col" id="gate">
                <p className="idle">A reason is required. The verdict is written back into the report.</p>
              </aside>
            </div>
          </>
        )}
        <Footer />
      </div>
    </>
  );
}
