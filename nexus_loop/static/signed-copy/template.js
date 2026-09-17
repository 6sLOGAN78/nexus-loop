(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./contract.js"));
  } else {
    root.SignedCopy = root.SignedCopy || {};
    root.SignedCopy.template = factory(root.SignedCopy.contract);
  }
})(typeof self !== "undefined" ? self : globalThis, function (contract) {
  "use strict";

  const { COPY, present, clean, bare, fill } = contract;

  function joinLines(lines) {
    return lines.filter((l) => l != null && l !== "").join("\n");
  }

  function joinBlocks(blocks) {
    return blocks.filter((b) => b != null && b !== "").join("\n\n");
  }

  function whyLine(input) {
    const cause = bare(input.cause);
    const configChange = bare(input.configChange);
    if (cause && configChange) {
      return fill(COPY.note.whyBoth, { cause, configChange });
    }
    if (cause) return fill(COPY.note.whyCause, { cause });
    if (configChange) return fill(COPY.note.whyConfig, { configChange });
    return null;
  }

  function changeLine(input, changeLabel) {
    const target = bare(input.changeTarget);
    const description = bare(input.changeDescription);
    if (target && description) {
      return fill(COPY.note.changeBoth, { label: changeLabel, target, description });
    }
    if (target) return fill(COPY.note.changeTarget, { label: changeLabel, target });
    if (description) {
      return fill(COPY.note.changeDescription, { label: changeLabel, description });
    }
    return null;
  }

  function replayLine(input) {
    const replay = input.replay;
    if (
      replay &&
      typeof replay === "object" &&
      present(replay.before) &&
      present(replay.after)
    ) {
      return fill(COPY.note.replay, {
        before: clean(replay.before),
        after: clean(replay.after),
      });
    }
    return COPY.note.replayNone;
  }

  function technicalNamesLine(input) {
    const names = (Array.isArray(input.technicalNames) ? input.technicalNames : [])
      .map((n) => clean(n))
      .filter((n) => n != null);
    if (!names.length) return null;
    return fill(COPY.note.technicalNames, {
      names: names.join(COPY.note.technicalNamesSeparator),
    });
  }

  function metaLine(input) {
    const parts = [];
    const recordedAt = clean(input.recordedAt);
    if (recordedAt) parts.push(fill(COPY.note.recorded, { recordedAt }));
    const coverageText = clean(input.coverageText);
    if (coverageText) parts.push(coverageText);
    if (!parts.length) return null;
    return parts.join(COPY.note.metaSeparator);
  }

  function buildSignedCopy(input) {
    if (!input || typeof input !== "object") {
      throw new TypeError("buildSignedCopy: invalid input");
    }
    const verdict = input.verdict;
    if (verdict !== "accept" && verdict !== "reject" && verdict !== "defer") {
      throw new TypeError("buildSignedCopy: invalid verdict");
    }
    if (!present(input.findingTitle)) {
      throw new TypeError("buildSignedCopy: findingTitle required");
    }
    if (!present(input.findingUrl)) {
      throw new TypeError("buildSignedCopy: findingUrl required");
    }
    if (!present(input.reason)) {
      throw new TypeError("buildSignedCopy: reason required");
    }

    const vCopy = COPY.note[verdict];
    const changeTargetPresent = present(input.changeTarget);
    const headline = changeTargetPresent
      ? fill(vCopy.headline, { target: bare(input.changeTarget) })
      : vCopy.headlineNoTarget;
    const finding = fill(COPY.note.finding, { title: clean(input.findingTitle) });
    const reason = fill(COPY.note.reason, {
      label: vCopy.reasonLabel,
      reason: input.reason,
    });

    let whatBroke = null;
    if (
      present(input.metricLabel) &&
      present(input.observed) &&
      present(input.expected)
    ) {
      whatBroke = fill(COPY.note.whatBroke, {
        metric: clean(input.metricLabel),
        observed: clean(input.observed),
        expected: clean(input.expected),
      });
    }

    const affected = present(input.affected)
      ? fill(COPY.note.affected, { affected: clean(input.affected) })
      : null;
    const why = whyLine(input);
    const change = changeLine(input, vCopy.changeLabel);
    const replay = replayLine(input);
    const risk = present(input.risk)
      ? fill(COPY.note.risk, { risk: bare(input.risk) })
      : null;
    const ifNothingChanges = present(input.ifNothingChanges)
      ? fill(COPY.note.ifNothingChanges, {
          ifNothingChanges: bare(input.ifNothingChanges),
        })
      : null;
    const owner = present(input.ownerLine)
      ? fill(COPY.note.owner, { owner: bare(input.ownerLine) })
      : null;
    const open = fill(COPY.note.open, { url: clean(input.findingUrl) });
    const technicalNames = technicalNamesLine(input);
    const meta = metaLine(input);
    const stillOpen = verdict === "reject" ? COPY.note.reject.stillOpen : null;

    let blocks;
    if (verdict === "reject") {
      blocks = [
        joinLines([headline, finding]),
        reason,
        joinLines([stillOpen, ifNothingChanges, owner]),
        joinLines([whatBroke, affected, why, change, replay, risk]),
        joinLines([open, technicalNames, meta]),
      ];
    } else {
      blocks = [
        joinLines([headline, finding]),
        reason,
        joinLines([
          whatBroke,
          affected,
          why,
          change,
          replay,
          risk,
          ifNothingChanges,
          owner,
        ]),
        joinLines([open, technicalNames, meta]),
      ];
    }

    return joinBlocks(blocks);
  }

  return { buildSignedCopy };
});
