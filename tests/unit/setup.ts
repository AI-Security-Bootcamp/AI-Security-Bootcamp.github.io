import { vi } from "vitest";

vi.mock("posthog-js", () => ({ default: { capture: vi.fn() } }));
