(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.adapter = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";

  const { present, normalizeVerdict } = contract;

  function warn(msg) {
    if (typeof console !== "undefined" && console.warn) console.warn(msg);
  }

  function asStringOrNull(value, label) {
    if (value == null) return null;
    if (typeof value === "string") return value;
    warn("SignedCopy.adapter: wrong type for " + label);
    return null;
  }

  function asReplayOrNull(value) {
    if (value == null) return null;
    if (
      typeof value === "object" &&
      typeof value.before === "string" &&
      typeof value.after === "string"
    ) {
      return { before: value.before, after: value.after };
    }
    warn("SignedCopy.adapter: wrong type for replay");
    return null;
  }

  function asStringArray(value) {
    if (value == null) return [];
    if (!Array.isArray(value)) {
      warn("SignedCopy.adapter: wrong type for technicalNames");
      return [];
    }
    const out = [];
    for (const item of value) {
      if (typeof item === "string") out.push(item);
      else warn("SignedCopy.adapter: wrong type for technicalNames item");
    }
    return out;
  }

  function toSignedCopyInput(desk, finding) {
    if (!desk || !finding) return null;
    if (desk.bucketOf(finding) !== "open") return null;

    const d = desk.decisionFor(finding);
    if (!d) return null;

    const verdict = normalizeVerdict(d.verdict);
    if (!verdict) {
      warn("SignedCopy.adapter: unknown verdict");
      return null;
    }
    if (!present(d.reason)) return null;

    const findingTitle = asStringOrNull(desk.claimText(finding), "claimText");
    const findingUrl = asStringOrNull(desk.findingUrl(finding), "findingUrl");
    if (!present(findingTitle) || !present(findingUrl)) return null;

    return Object.freeze({
      verdict,
      findingTitle,
      reason: d.reason,
      findingUrl,
      metricLabel: asStringOrNull(desk.metricLabel(finding), "metricLabel"),
      observed: asStringOrNull(desk.observedText(finding), "observedText"),
      expected: asStringOrNull(desk.expectedText(finding), "expectedText"),
      affected: asStringOrNull(desk.affectedFigureText(finding), "affectedFigureText"),
      cause: asStringOrNull(desk.causeText(finding), "causeText"),
      configChange: asStringOrNull(desk.configChangeText(finding), "configChangeText"),
      changeTarget: asStringOrNull(desk.changeTargetText(finding), "changeTargetText"),
      changeDescription: asStringOrNull(
        desk.changeDescriptionText(finding),
        "changeDescriptionText"
      ),
      replay: asReplayOrNull(desk.replayText(finding)),
      risk: asStringOrNull(desk.riskText(finding), "riskText"),
      ifNothingChanges: asStringOrNull(
        desk.ifNothingChangesText(finding),
        "ifNothingChangesText"
      ),
      ownerLine: asStringOrNull(desk.ownerText(finding), "ownerText"),
      technicalNames: asStringArray(desk.technicalNames(finding)),
      recordedAt: asStringOrNull(d.recordedAtText, "recordedAtText"),
      coverageText: asStringOrNull(desk.coverageText(), "coverageText"),
    });
  }

  return { toSignedCopyInput };
});
