import type { ComponentType } from "react";
import LondonDecember2026 from "./_programs/london-dec-2026";
import SanFrancisco2026 from "../sf26/page";
import Vegas2026 from "../vegas26/page";
import London2026 from "../sept26/page";
import Singapore2026 from "../singapore/page";

export const programPages: Record<string, ComponentType> = {
  "london-dec-2026": LondonDecember2026,
  "sf-2026": SanFrancisco2026,
  "vegas-2026": Vegas2026,
  "london-2026": London2026,
  "singapore-2026": Singapore2026,
};
