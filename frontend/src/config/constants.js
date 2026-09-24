// src/config/constants.js
//
// Central configuration for Module 1 (Account, Login & Onboarding).
// Requirements doc section 4 & 9: allowed admission years and branch/section
// structure must live in ONE place, not be scattered across components.

export const USN_PREFIX = "4SF";

// Allowed admission years (2-digit form, as they appear in the USN).
// To allow a new year later, add it here only.
export const ALLOWED_ADMISSION_YEARS = ["23", "24", "25", "26"];

// Allowed branches.
export const BRANCHES = ["IS", "CS", "CI"];

// Sections available per branch (doc section 9).
export const SECTIONS_BY_BRANCH = {
  IS: ["A", "B"],
  CS: ["A", "B", "C", "D"],
  CI: ["A", "B", "C"],
};

// Semester options shown during onboarding.
// Kept generic (1-8) since the doc says "provide semester selection
// appropriate to the application" without specifying promotion logic.
export const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export const CURRENT_ACADEMIC_YEAR = "2026-27";
