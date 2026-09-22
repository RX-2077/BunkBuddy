// tests/sections.test.js
import { describe, it, expect } from "vitest";
import { getSectionsForBranch } from "../src/features/onboarding/sectionOptions";

describe("getSectionsForBranch", () => {
  it("IS has sections A, B", () => {
    expect(getSectionsForBranch("IS")).toEqual(["A", "B"]);
  });

  it("CS has sections A, B, C, D", () => {
    expect(getSectionsForBranch("CS")).toEqual(["A", "B", "C", "D"]);
  });

  it("CI has sections A, B, C", () => {
    expect(getSectionsForBranch("CI")).toEqual(["A", "B", "C"]);
  });

  it("returns an empty list for an unknown branch", () => {
    expect(getSectionsForBranch("EC")).toEqual([]);
  });
});
