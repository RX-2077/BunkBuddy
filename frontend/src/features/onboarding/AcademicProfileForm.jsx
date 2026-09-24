// src/features/onboarding/AcademicProfileForm.jsx
//
// Doc section 17: Branch is derived from USN and shown read-only. User only
// selects section (filtered by branch, doc section 9) and semester.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { getSectionsForBranch } from "./sectionOptions";
import { saveAcademicProfile } from "./onboardingService";
import { SEMESTER_OPTIONS } from "../../config/constants";

export default function AcademicProfileForm() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const branch = profile?.branch ?? "";
  const sections = getSectionsForBranch(branch);

  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!section) {
      setError("Please select a section.");
      return;
    }
    if (!semester) {
      setError("Please select a semester.");
      return;
    }

    setSubmitting(true);
    try {
      await saveAcademicProfile(user.uid, branch, section, Number(semester));
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Set Up Your Academic Profile</h1>

      <label>USN</label>
      <p>{profile?.usn}</p>

      <label>Branch</label>
      <p>{branch} (derived from USN)</p>

      <label htmlFor="section">Section</label>
      <select id="section" value={section} onChange={(e) => setSection(e.target.value)}>
        <option value="">Select section</option>
        {sections.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label htmlFor="semester">Semester</label>
      <select id="semester" value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">Select semester</option>
        {SEMESTER_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
