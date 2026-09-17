(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.summary = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";
  // Step 0 stub — WS-D replaces
  function toSummaryInput() {
    return null;
  }
  function buildDecisionsSummary() {
    return null;
  }
  return { toSummaryInput, buildDecisionsSummary };
});
