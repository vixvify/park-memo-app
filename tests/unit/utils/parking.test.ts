import { describe, expect, it } from "vitest";

import { formatAccuracy, formatDistance, formatDuration } from "@/utils/parking";

describe("parking display formatting", () => {
  it("uses readable units for route distance, duration, and GPS accuracy", () => {
    expect(formatDistance(950)).toBe("950 ม.");
    expect(formatDistance(1500)).toBe("1.5 กม.");
    expect(formatDuration(61_000)).toBe("2 นาที");
    expect(formatAccuracy(8.7)).toBe("±9 ม.");
  });
});
