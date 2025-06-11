import { describe, it, expect } from "vitest";
import {
  getUserTimezone,
  formatDateInTimezone,
  getTimezoneOffset,
  COMMON_TIMEZONES,
} from "./timezone-utils";

describe("timezone-utils", () => {
  describe("getUserTimezone", () => {
    it("returns user timezone", () => {
      const timezone = getUserTimezone();
      expect(typeof timezone).toBe("string");
      expect(timezone.length).toBeGreaterThan(0);
    });
  });

  describe("formatDateInTimezone", () => {
    it("formats date in specified timezone", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const formatted = formatDateInTimezone(date, "Europe/Moscow");

      expect(typeof formatted).toBe("string");
      expect(formatted).toContain("15");
    });

    it("formats date with custom options", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const formatted = formatDateInTimezone(date, "Europe/Moscow", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      expect(formatted).toMatch(/\d{4}/);
    });
  });

  describe("getTimezoneOffset", () => {
    it("returns correct offset for Moscow", () => {
      const offset = getTimezoneOffset("Europe/Moscow");
      expect(offset).toBe("+03:00");
    });

    it("returns correct offset for New York", () => {
      const offset = getTimezoneOffset("America/New_York");
      expect(offset).toBe("-05:00");
    });

    it("returns default offset for unknown timezone", () => {
      const offset = getTimezoneOffset("Unknown/Timezone");
      expect(offset).toBe("+00:00");
    });
  });

  describe("COMMON_TIMEZONES", () => {
    it("contains expected timezones", () => {
      expect(COMMON_TIMEZONES).toBeInstanceOf(Array);
      expect(COMMON_TIMEZONES.length).toBeGreaterThan(0);

      const moscowTimezone = COMMON_TIMEZONES.find(
        (tz) => tz.id === "Europe/Moscow",
      );
      expect(moscowTimezone).toBeDefined();
      expect(moscowTimezone?.name).toBe("Москва");
      expect(moscowTimezone?.offset).toBe("+03:00");
    });

    it("has all required properties for each timezone", () => {
      COMMON_TIMEZONES.forEach((timezone) => {
        expect(timezone).toHaveProperty("id");
        expect(timezone).toHaveProperty("name");
        expect(timezone).toHaveProperty("offset");
        expect(timezone).toHaveProperty("label");

        expect(typeof timezone.id).toBe("string");
        expect(typeof timezone.name).toBe("string");
        expect(typeof timezone.offset).toBe("string");
        expect(typeof timezone.label).toBe("string");
      });
    });
  });
});
