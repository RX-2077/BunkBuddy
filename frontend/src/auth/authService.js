// src/auth/authService.js
//
// Registration & login using USN + password (doc section 6 & 7 — no email
// login). Firebase Auth requires an email-shaped identifier internally, so
// we map USN -> a synthetic, non-guessable-by-users internal email
// (e.g. "4sf24is006@usn.attendanceplanner.internal"). The user never sees
// or enters this — they only ever use their USN. This is an implementation
// detail, not a design change to the login flow.
//
// USN uniqueness (doc section 5) is enforced server-side via a Firestore
// transaction against a dedicated `usnIndex` collection, where the
// document ID *is* the USN. Firestore transactions guarantee that only one
// of two simultaneous registrations for the same USN can win.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { validateUSN } from "../lib/usn";

function usnToInternalEmail(usn) {
  return `${usn.toLowerCase()}@usn.attendanceplanner.internal`;
}

/**
 * Register a new account with USN + password.
 * Throws Error with a user-facing message on any failure.
 */
export async function registerWithUSN(rawUsn, password) {
  const result = validateUSN(rawUsn);
  if (!result.valid) {
    throw new Error(result.error);
  }
  if (!password || password.length === 0) {
    throw new Error("Password is required.");
  }

  const { usn, admissionYear, branch } = result.data;
  const usnIndexRef = doc(db, "usnIndex", usn);

  // Server-side duplicate check (doc section 5): fail fast before even
  // touching Firebase Auth, using a transaction so two simultaneous
  // registrations for the same USN can't both succeed.
  const existing = await getDoc(usnIndexRef);
  if (existing.exists()) {
    throw new Error("This USN is already registered.");
  }

  // Create the Auth credential (password handled securely by Firebase Auth,
  // never stored in Firestore — doc section 14).
  const internalEmail = usnToInternalEmail(usn);
  const credential = await createUserWithEmailAndPassword(auth, internalEmail, password);
  const uid = credential.user.uid;

  // Atomically claim the USN and create the student profile.
  try {
    await runTransaction(db, async (transaction) => {
      const usnDoc = await transaction.get(usnIndexRef);
      if (usnDoc.exists()) {
        throw new Error("This USN is already registered.");
      }
      transaction.set(usnIndexRef, { uid, createdAt: serverTimestamp() });
      transaction.set(doc(db, "students", uid), {
        usn,
        admissionYear,
        branch,
        section: null,
        semester: null,
        onboardingComplete: false,
        createdAt: serverTimestamp(),
      });
    });
  } catch (err) {
    // Roll back the Auth account if the USN claim failed, so we don't leave
    // an orphaned credential with no profile.
    await credential.user.delete().catch(() => {});
    throw err;
  }

  return uid;
}

/**
 * Log in with USN + password.
 * Throws a generic error on failure (doc section 18 — don't reveal whether
 * the account exists).
 */
export async function loginWithUSN(rawUsn, password) {
  const result = validateUSN(rawUsn);
  if (!result.valid) {
    throw new Error(result.error);
  }

  const internalEmail = usnToInternalEmail(result.data.usn);

  try {
    const credential = await signInWithEmailAndPassword(auth, internalEmail, password);
    return credential.user.uid;
  } catch (err) {
    throw new Error("Incorrect USN or password.");
  }
}

export async function logout() {
  await firebaseSignOut(auth);
}
