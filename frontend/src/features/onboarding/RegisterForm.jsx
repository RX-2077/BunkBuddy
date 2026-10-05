// src/features/onboarding/RegisterForm.jsx
//
// Doc section 6 & 17: collects USN + password only. Validates USN on the
// frontend for immediate feedback (backend validation happens again inside
// registerWithUSN, per doc section 2 — never rely on frontend-only checks).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUSN } from "../../lib/usn";
import { registerWithUSN } from "../../auth/authService";

export default function RegisterForm() {
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Frontend validation for immediate feedback.
    const check = validateUSN(usn);
    if (!check.valid) {
      setError(check.error);
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setSubmitting(true);
    try {
      await registerWithUSN(usn, password);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>

      <label htmlFor="usn">USN</label>
      <input
        id="usn"
        type="text"
        value={usn}
        onChange={(e) => setUsn(e.target.value)}
        placeholder="4SF24IS006"
        autoComplete="username"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
