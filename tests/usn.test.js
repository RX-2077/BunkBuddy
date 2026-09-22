// tests/usn.test.js
// Run with: npm test (vitest)

import { describe, it, expect } from "vitest";
import { validateUSN, parseUSN } from "../src/lib/usn";

describe("validateUSN", () => {
  const validCases = ["4SF24IS006", "4SF25CS042", "4SF26CI103"];
  const invalidCases = [
    "4SF27IS001",  // year not allowed
    "4SF24EC006",  // branch not allowed
    "4SF24IS06",   // only 2 digits
    "4SF24IS0006", // 4 digits
    "4SF24ISABC",  // non-numeric student number
    "5SF24IS006",  // wrong prefix
    "24IS006",     // missing 4SF
    "4SF24ISE06",  // malformed branch
  ];

  validCases.forEach((usn) => {
    it(`accepts ${usn}`, () => {
      expect(validateUSN(usn).valid).toBe(true);
    });
  });

  invalidCases.forEach((usn) => {
    it(`rejects ${usn}`, () => {
      expect(validateUSN(usn).valid).toBe(false);
    });
  });
});

describe("parseUSN", () => {
  it("derives year, branch, and zero-padded number from 4SF24IS006", () => {
    const parsed = parseUSN("4SF24IS006");
    expect(parsed.year).toBe("24");
    expect(parsed.branch).toBe("IS");
    expect(parsed.number).toBe("006");
    expect(parsed.admissionYear).toBe(24);
  });

  it("preserves leading zeros in the student number", () => {
    const parsed = parseUSN("4SF25CS042");
    expect(parsed.number).toBe("042");
    expect(parsed.number).not.toBe("42");
  });

  it("throws for an invalid USN", () => {
    expect(() => parseUSN("4SF24EC006")).toThrow();
  });
});
