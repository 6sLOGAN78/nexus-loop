(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.adapter = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";
  // Step 0 stub — WS-B replaces with toSignedCopyInput
  function toSignedCopyInput() {
    return null;
  }
  return { toSignedCopyInput };
});
