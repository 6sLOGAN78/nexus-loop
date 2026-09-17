(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.contract = factory();
  }
})(typeof self !== "undefined" ? self : globalThis, function () {
  "use strict";

  const COPY = Object.freeze({
    note: {
      accept: {
        headline: "Accepted: go ahead with the change to {target}.",
        headlineNoTarget: "Accepted: go ahead with this change.",
        reasonLabel: "My reason",
        changeLabel: "What we're changing",
      },
      reject: {
        headline: "Rejected: do not make the change to {target}.",
        headlineNoTarget: "Rejected: do not make this change.",
        reasonLabel: "My reason",
        changeLabel: "What was proposed",
        stillOpen: "Rejecting the change does not close this finding.",
      },
      defer: {
        headline: "Not decided yet: the change to {target} is on hold.",
        headlineNoTarget: "Not decided yet: this change is on hold.",
        reasonLabel: "What I'm waiting for",
        changeLabel: "What was proposed",
      },
      finding: "Finding: {title}",
      reason: '{label}: "{reason}"',
      whatBroke: "What broke: {metric} is {observed}, expected {expected}.",
      affected: "Who was affected: {affected} conversations.",
      whyBoth: "Why we think so: {cause}, after {configChange}.",
      whyCause: "Why we think so: {cause}.",
      whyConfig: "Why we think so: it started after {configChange}.",
      changeBoth: "{label}: {target}: {description}.",
      changeTarget: "{label}: {target}.",
      changeDescription: "{label}: {description}.",
      replay: "Replay test: {before} → {after} (before is the test's simulated baseline, not live traffic).",
      replayNone: "Replay test: No test this run.",
      risk: "If the diagnosis is wrong: {risk}.",
      ifNothingChanges: "If nothing changes: {ifNothingChanges}.",
      owner: "Owner: {owner}.",
      open: "Open this finding: {url}",
      technicalNames: "Technical names: {names}",
      technicalNamesSeparator: " · ",
      recorded: "Recorded {recordedAt}",
      metaSeparator: " · ",
    },
    summary: {
      title: "Decisions",
      titleWithRun: "Decisions for {run}",
      accept: "Accepted: {title}",
      reject: "Rejected: {title}",
      defer: "Not decided yet: {title}",
      reason: 'Reason: "{reason}"',
      waitingFor: 'Waiting for: "{reason}"',
      open: "Open: {url}",
      dismissedOne: "Dismissed signals: 1 looked like a problem and is not.",
      dismissedMany: "Dismissed signals: {count} looked like problems and are not.",
      refusals: "No measurement: {claims}.",
      refusalsSeparator: "; ",
    },
    ui: {
      button: "Copy signed copy",
      preview: "See the note",
      copied: "Copied. Paste it wherever the owning team works.",
      copyFailed: "Could not copy automatically. The note is selected below. Copy it from there.",
      summaryButton: "Copy all decisions",
      summaryPreview: "See all decisions",
      summaryCopied: "Copied all decisions.",
      summaryCopyFailed: "Could not copy automatically. All decisions are selected below. Copy them from there.",
    },
  });

  function present(s) {
    return typeof s === "string" && s.trim() !== "";
  }

  function clean(s) {
    return present(s) ? s.trim() : null;
  }

  function bare(s) {
    const t = clean(s);
    return t === null ? null : t.replace(/\.$/, "");
  }

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, (m, key) => {
      if (!(key in values)) throw new Error("fill: missing " + key);
      return values[key];
    });
  }

  function normalizeVerdict(raw) {
    if (raw === "accepted" || raw === "accept") return "accept";
    if (raw === "rejected" || raw === "reject") return "reject";
    if (raw === "deferred" || raw === "defer") return "defer";
    return null;
  }

  return {
    COPY,
    present,
    clean,
    bare,
    fill,
    normalizeVerdict,
  };
});
