// src/features/onboarding/sectionOptions.js
//
// Doc section 9: UI should show only sections belonging to the selected
// branch. Kept as a thin function over the constants config so there's one
// place (constants.js) that owns the actual branch -> section mapping.

import { SECTIONS_BY_BRANCH } from "../../config/constants";

/**
 * @param {string} branch - "IS" | "CS" | "CI"
 * @returns {string[]} section letters for that branch, or [] if unknown.
 */
export function getSectionsForBranch(branch) {
  return SECTIONS_BY_BRANCH[branch] ?? [];
}
