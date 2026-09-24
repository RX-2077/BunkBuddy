// tests/auth.test.js
//
// Integration tests against the Firebase Local Emulator Suite.
// Requires: firebase emulators:start --only auth,firestore  (run separately,
// or via a pretest script) and firebase.js pointed at the emulator hosts
// when NODE_ENV === "test" / import.meta.env.MODE === "test".
//
// These cover doc section 21 "Duplicate account" plus login success/failure
// (Test 9, Test 13, Test 14 in the requirements doc).

import { describe, it, expect, beforeEach } from "vitest";
import { registerWithUSN, loginWithUSN, logout } from "../src/auth/authService";

const TEST_USN = "4SF24IS006";
const TEST_PASSWORD = "testpass123";

describe("registerWithUSN", () => {
  it("registers a valid, unique USN", async () => {
    const uid = await registerWithUSN(TEST_USN, TEST_PASSWORD);
    expect(uid).toBeTruthy();
    await logout();
  });

  it("rejects a duplicate USN", async () => {
    await registerWithUSN(TEST_USN, TEST_PASSWORD);
    await logout();

    await expect(
      registerWithUSN(TEST_USN, "differentPassword1")
    ).rejects.toThrow("This USN is already registered.");
  });

  it("rejects an invalid USN before touching Auth", async () => {
    await expect(registerWithUSN("4SF24EC006", TEST_PASSWORD)).rejects.toThrow(
      "Branch EC is not currently supported."
    );
  });
});

describe("loginWithUSN", () => {
  beforeEach(async () => {
    await registerWithUSN(TEST_USN, TEST_PASSWORD).catch(() => {});
    await logout();
  });

  it("logs in with correct USN + password", async () => {
    const uid = await loginWithUSN(TEST_USN, TEST_PASSWORD);
    expect(uid).toBeTruthy();
  });

  it("rejects an incorrect password with a generic error", async () => {
    await expect(loginWithUSN(TEST_USN, "wrongPassword")).rejects.toThrow(
      "Incorrect USN or password."
    );
  });
});
