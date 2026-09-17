(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.summary = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";

  const { COPY, present, clean, bare, fill, normalizeVerdict } = contract;

  function toSummaryInput(desk) {
    if (!desk) return null;
    const open = desk.findingsIn("open") || [];
    if (!open.length) return null;

    const decided = [];
    for (const finding of open) {
      const d = desk.decisionFor(finding);
      if (!d) return null;
      const verdict = normalizeVerdict(d.verdict);
      if (!verdict) return null;
      if (!present(d.reason)) return null;
      const findingTitle = desk.claimText(finding);
      const findingUrl = desk.findingUrl(finding);
      if (!present(findingTitle) || !present(findingUrl)) return null;
      decided.push({
        verdict,
        findingTitle,
        reason: d.reason,
        findingUrl,
      });
    }

    return Object.freeze({
      runLabel: desk.runLabelText(),
      decided: Object.freeze(decided.slice()),
      dismissedCount: desk.bucketCountText("ignored"),
      refusals: Object.freeze([].concat(desk.refusalClaims() || [])),
    });
  }

  function buildDecisionsSummary(input) {
    if (!input || !Array.isArray(input.decided) || input.decided.length === 0) {
      throw new TypeError("buildDecisionsSummary: decided required");
    }

    const title = present(input.runLabel)
      ? fill(COPY.summary.titleWithRun, { run: clean(input.runLabel) })
      : COPY.summary.title;

    const blocks = [title];

    for (const item of input.decided) {
      if (!item || typeof item !== "object") {
        throw new TypeError("buildDecisionsSummary: invalid item");
      }
      const verdict = item.verdict;
      if (verdict !== "accept" && verdict !== "reject" && verdict !== "defer") {
        throw new TypeError("buildDecisionsSummary: invalid verdict");
      }
      if (!present(item.findingTitle) || !present(item.findingUrl) || !present(item.reason)) {
        throw new TypeError("buildDecisionsSummary: item fields required");
      }
      const head = fill(COPY.summary[verdict], { title: clean(item.findingTitle) });
      const reasonLine =
        verdict === "defer"
          ? fill(COPY.summary.waitingFor, { reason: item.reason })
          : fill(COPY.summary.reason, { reason: item.reason });
      const open = fill(COPY.summary.open, { url: clean(item.findingUrl) });
      blocks.push([head, reasonLine, open].join("\n"));
    }

    const last = [];
    const dismissedCount = input.dismissedCount;
    if (dismissedCount === "1") {
      last.push(COPY.summary.dismissedOne);
    } else if (present(dismissedCount) && dismissedCount !== "0") {
      last.push(fill(COPY.summary.dismissedMany, { count: clean(dismissedCount) }));
    }

    const refusals = (Array.isArray(input.refusals) ? input.refusals : [])
      .map((c) => bare(c))
      .filter((c) => c != null && c !== "");
    if (refusals.length) {
      last.push(
        fill(COPY.summary.refusals, {
          claims: refusals.join(COPY.summary.refusalsSeparator),
        })
      );
    }
    if (last.length) blocks.push(last.join("\n"));

    return blocks.join("\n\n");
  }

  return { toSummaryInput, buildDecisionsSummary };
});
