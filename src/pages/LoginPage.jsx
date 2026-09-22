// src/pages/LoginPage.jsx
//
// Doc section 7: USN + password login only, no email.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateUSN } from "../lib/usn";
import { loginWithUSN } from "../auth/authService";

export default function LoginPage() {
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const check = validateUSN(usn);
    if (!check.valid) {
      setError(check.error);
      return;
    }

    setSubmitting(true);
    try {
      await loginWithUSN(usn, password);
      // AuthContext + AppRouter decide whether to land on /onboarding or /home
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

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
        autoComplete="current-password"
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Logging in..." : "Login"}
      </button>

      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </form>
  );
}
