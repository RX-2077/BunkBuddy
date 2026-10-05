// src/features/onboarding/onboardingService.js
//
// Saves the academic-identity portion of onboarding (section + semester).
// Branch and admission year are NOT accepted here — they come only from
// the USN, parsed at registration time (doc section 17: branch must be
// read-only/derived, never user-editable, to prevent a mismatch).

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  CURRENT_ACADEMIC_YEAR,
  SECTIONS_BY_BRANCH,
  SEMESTER_OPTIONS,
} from "../../config/constants";

/**
 * @param {string} uid - Firebase Auth uid of the current user
 * @param {string} branch - the student's branch, already known/derived (for validation only)
 * @param {string} section
 * @param {number} semester
 */
export async function saveAcademicProfile(uid, branch, section, semester) {
  const validSections = SECTIONS_BY_BRANCH[branch] ?? [];

  if (!section || !validSections.includes(section)) {
    throw new Error("Please select a section.");
  }
  if (!semester || !SEMESTER_OPTIONS.includes(Number(semester))) {
    throw new Error("Please select a semester.");
  }

  await updateDoc(doc(db, "students", uid), {
    section,
    semester: Number(semester),
    academicYear: CURRENT_ACADEMIC_YEAR,
    onboardingComplete: true,
  });
}
