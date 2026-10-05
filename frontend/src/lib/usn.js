// src/lib/usn.js
//
// Single authoritative USN validation/parsing function (doc section 16).
// Every other part of the app (frontend form, backend/Firestore rules logic,
// onboarding) must call THIS function rather than re-implementing regex.
//
// USN format: 4SF + YY + BRANCH + NNN   e.g. 4SF24IS006

import { USN_PREFIX, ALLOWED_ADMISSION_YEARS, BRANCHES } from "../config/constants";

const USN_REGEX = /^([A-Z0-9]{3})(\d{2})([A-Z]{2})(\d{3})$/;

/**
 * Validate and parse a USN.
 *
 * @param {string} rawUsn
 * @returns {{ valid: true, data: { usn: string, prefix: string, year: string,
 *              branch: string, number: string, admissionYear: number } }
 *           | { valid: false, error: string }}
 */
export function validateUSN(rawUsn) {
  if (typeof rawUsn !== "string") {
    return { valid: false, error: "Invalid USN format." };
  }

  const usn = rawUsn.trim().toUpperCase();

  const match = usn.match(USN_REGEX);
  if (!match) {
    return { valid: false, error: "Invalid USN format." };
  }

  const [, prefix, year, branch, number] = match;

  if (prefix !== USN_PREFIX) {
    return { valid: false, error: "Invalid USN format." };
  }

  if (!ALLOWED_ADMISSION_YEARS.includes(year)) {
    return { valid: false, error: `Admission year ${year} is not currently supported.` };
  }

  if (!BRANCHES.includes(branch)) {
    return { valid: false, error: `Branch ${branch} is not currently supported.` };
  }

  // number is guaranteed exactly 3 digits by the regex; preserve as string
  // so a leading zero (e.g. "006") is never lost.
  return {
    valid: true,
    data: {
      usn,
      prefix,
      year,               // "24"
      branch,             // "IS"
      number,             // "006" (string, zero-padded)
      admissionYear: Number(year), // 24 (numeric form for storage, per doc example)
    },
  };
}

/**
 * Convenience wrapper: parse a USN that is already known to be valid.
 * Throws if invalid — use validateUSN() first in any user-facing flow.
 */
export function parseUSN(rawUsn) {
  const result = validateUSN(rawUsn);
  if (!result.valid) {
    throw new Error(result.error);
  }
  return result.data;
}
