import type { NexusDeskApi } from "./nexusDesk";
import type { Report } from "./types";

declare global {
  interface Window {
    NexusDesk?: NexusDeskApi;
    SignedCopy?: {
      ui?: { render?: (el: Element, finding: unknown) => void };
      summary?: { render?: (el: Element, desk: unknown) => void };
      [key: string]: unknown;
    };
    __rep?: Report;
  }
}

export {};
