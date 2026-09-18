// Ported from renderDetail() + pinStoryLayout() in nexus_loop/static/index.html
// (lines ~1186-1196, 1750-1756). The original moved every rendered node except
// `.tech-foot` into a `.story-scroll` wrapper via DOM surgery after the fact;
// here the same final structure (story-scroll, then tech-foot as a sibling
// flex item) is just written directly as JSX.
import type { ReactNode } from "react";
import { DismissedDetail, dismissedTechRows } from "./DismissedDetail";
import { GapDetail, gapTechRows } from "./GapDetail";
import { RegressionDetail, regressionTechRows } from "./RegressionDetail";
import { TechFoot } from "./Visuals";
import type { Pack, Report } from "@/lib/types";

export function Detail({ rep, pack }: { rep: Report; pack: Pack }) {
  let body: ReactNode;
  let techRows: Array<{ k: string; v: unknown }> = [];

  if (pack.kind === "gap") {
    body = <GapDetail gap={pack.gap} />;
    techRows = gapTechRows(pack.gap);
  } else if (!pack.f) {
    body = <p className="idle">No findings in this report.</p>;
  } else if (pack.kind === "dismissed") {
    body = <DismissedDetail pack={pack} />;
    techRows = dismissedTechRows(pack);
  } else {
    body = <RegressionDetail rep={rep} pack={pack} />;
    techRows = regressionTechRows(pack);
  }

  return (
    <article className="detail" id="detail">
      <div className="story-scroll">{body}</div>
      <TechFoot rows={techRows} />
    </article>
  );
}
