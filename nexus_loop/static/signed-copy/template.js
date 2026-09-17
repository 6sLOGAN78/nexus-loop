(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.template = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";
  // Step 0 stub — WS-A replaces with buildSignedCopy
  function buildSignedCopy() {
    return null;
  }
  return { buildSignedCopy };
});
