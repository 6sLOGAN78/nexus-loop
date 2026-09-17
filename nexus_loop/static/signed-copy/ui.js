(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.ui = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";
  // Step 0 stub — WS-C replaces with real render
  function render(slotEl) {
    if (slotEl) slotEl.innerHTML = "";
  }
  return { render };
});
