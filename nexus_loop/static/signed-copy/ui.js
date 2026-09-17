(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.ui = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";

  const { COPY } = contract;

  let lastStatusKey = null;
  let lastStatusKind = null; // 'copied' | 'failed' | null
  let lastSummaryStatusKey = null;
  let lastSummaryStatusKind = null;

  function defaultDeps(deps) {
    const d = deps || {};
    const root = typeof self !== "undefined" ? self : globalThis;
    const SC = root.SignedCopy || {};
    return {
      desk: d.desk || root.NexusDesk,
      adapter: d.adapter || SC.adapter,
      template: d.template || SC.template,
      summary: d.summary || SC.summary,
      clipboard: d.clipboard || (typeof navigator !== "undefined" ? navigator.clipboard : null),
      copy: d.copy || COPY,
    };
  }

  function statusKey(input) {
    if (!input) return null;
    return [
      input.findingUrl || "",
      input.verdict || "",
      input.recordedAt || "",
      input.reason || "",
    ].join("|");
  }

  function stopListKeys(ev) {
    if (
      ev.key === "ArrowDown" ||
      ev.key === "ArrowUp" ||
      ev.key === "Home" ||
      ev.key === "End"
    ) {
      ev.stopPropagation();
    }
  }

  function bindPreviewKeys(textarea) {
    if (!textarea) return;
    textarea.addEventListener("keydown", stopListKeys);
  }

  async function copyText(clipboard, text, preview, textarea, statusEl, strings) {
    let ok = false;
    try {
      if (clipboard && typeof clipboard.writeText === "function") {
        await clipboard.writeText(text);
        ok = true;
      }
    } catch (e) {
      ok = false;
    }
    if (ok) {
      statusEl.textContent = strings.copied;
      return "copied";
    }
    if (preview) preview.open = true;
    if (textarea) {
      textarea.focus();
      textarea.select();
    }
    statusEl.textContent = strings.copyFailed;
    return "failed";
  }

  function renderSignedSection(slotEl, input, text, deps) {
    const copy = deps.copy;
    const section = document.createElement("section");
    section.setAttribute("data-testid", "signed-copy");
    section.setAttribute("aria-label", "Signed copy");

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-testid", "signed-copy-button");
    button.className = "signed-copy-btn";
    button.textContent = copy.ui.button;

    const status = document.createElement("p");
    status.setAttribute("data-testid", "signed-copy-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.className = "signed-copy-status";

    const key = statusKey(input);
    if (key && key === lastStatusKey && lastStatusKind === "copied") {
      status.textContent = copy.ui.copied;
    } else if (key && key === lastStatusKey && lastStatusKind === "failed") {
      status.textContent = copy.ui.copyFailed;
    } else {
      status.textContent = "";
      if (key !== lastStatusKey) {
        lastStatusKey = key;
        lastStatusKind = null;
      }
    }

    const details = document.createElement("details");
    details.setAttribute("data-testid", "signed-copy-preview");
    details.className = "signed-copy-preview";
    const summary = document.createElement("summary");
    summary.textContent = copy.ui.preview;
    const textarea = document.createElement("textarea");
    textarea.setAttribute("data-testid", "signed-copy-text");
    textarea.readOnly = true;
    textarea.rows = 14;
    textarea.value = text;
    textarea.className = "signed-copy-text";
    details.appendChild(summary);
    details.appendChild(textarea);
    bindPreviewKeys(textarea);

    button.addEventListener("click", async () => {
      const kind = await copyText(
        deps.clipboard,
        text,
        details,
        textarea,
        status,
        {
          copied: copy.ui.copied,
          copyFailed: copy.ui.copyFailed,
        }
      );
      lastStatusKey = key;
      lastStatusKind = kind;
    });

    section.appendChild(button);
    section.appendChild(status);
    section.appendChild(details);
    slotEl.appendChild(section);
  }

  function renderSummarySection(slotEl, summaryInput, summaryText, deps) {
    const copy = deps.copy;
    const section = document.createElement("section");
    section.setAttribute("data-testid", "decisions-summary");
    section.setAttribute("aria-label", "All decisions");

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-testid", "decisions-summary-button");
    button.className = "signed-copy-btn";
    button.textContent = copy.ui.summaryButton;

    const status = document.createElement("p");
    status.setAttribute("data-testid", "decisions-summary-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.className = "signed-copy-status";

    const key = JSON.stringify({
      decided: summaryInput.decided,
      dismissedCount: summaryInput.dismissedCount,
      refusals: summaryInput.refusals,
      runLabel: summaryInput.runLabel,
    });
    if (key === lastSummaryStatusKey && lastSummaryStatusKind === "copied") {
      status.textContent = copy.ui.summaryCopied;
    } else if (key === lastSummaryStatusKey && lastSummaryStatusKind === "failed") {
      status.textContent = copy.ui.summaryCopyFailed;
    } else {
      status.textContent = "";
      if (key !== lastSummaryStatusKey) {
        lastSummaryStatusKey = key;
        lastSummaryStatusKind = null;
      }
    }

    const details = document.createElement("details");
    details.setAttribute("data-testid", "decisions-summary-preview");
    details.className = "signed-copy-preview";
    const summaryEl = document.createElement("summary");
    summaryEl.textContent = copy.ui.summaryPreview;
    const textarea = document.createElement("textarea");
    textarea.setAttribute("data-testid", "decisions-summary-text");
    textarea.readOnly = true;
    textarea.rows = 14;
    textarea.value = summaryText;
    textarea.className = "signed-copy-text";
    details.appendChild(summaryEl);
    details.appendChild(textarea);
    bindPreviewKeys(textarea);

    button.addEventListener("click", async () => {
      const kind = await copyText(
        deps.clipboard,
        summaryText,
        details,
        textarea,
        status,
        {
          copied: copy.ui.summaryCopied,
          copyFailed: copy.ui.summaryCopyFailed,
        }
      );
      lastSummaryStatusKey = key;
      lastSummaryStatusKind = kind;
    });

    section.appendChild(button);
    section.appendChild(status);
    section.appendChild(details);
    slotEl.appendChild(section);
  }

  function render(slotEl, finding, deps) {
    if (!slotEl) return;
    slotEl.innerHTML = "";
    const d = defaultDeps(deps);
    if (!d.adapter || !d.template || !d.desk) return;

    const input = d.adapter.toSignedCopyInput(d.desk, finding);
    if (!input) return;
    const text = d.template.buildSignedCopy(input);
    if (typeof text !== "string") return;

    renderSignedSection(slotEl, input, text, d);

    if (d.summary && typeof d.summary.toSummaryInput === "function") {
      const summaryInput = d.summary.toSummaryInput(d.desk);
      if (summaryInput) {
        const summaryText = d.summary.buildDecisionsSummary(summaryInput);
        if (typeof summaryText === "string") {
          renderSummarySection(slotEl, summaryInput, summaryText, d);
        }
      }
    }
  }

  return { render };
});
