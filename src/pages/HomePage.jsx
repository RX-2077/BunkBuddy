// src/pages/HomePage.jsx
//
// Placeholder landing page after onboarding is complete. Doc section 19:
// do not build attendance/timetable/friends features here — this just
// confirms the identity that Module 1 established.

import { useAuth } from "../auth/useAuth";
import { logout } from "../auth/authService";

export default function HomePage() {
  const { profile } = useAuth();

  return (
    <main className="page">
      <h1>Application Home</h1>
      <p>Welcome, {profile?.usn}</p>
      <ul>
        <li>Branch: {profile?.branch}</li>
        <li>Section: {profile?.section}</li>
        <li>Semester: {profile?.semester}</li>
        <li>Admission Year: 20{profile?.admissionYear}</li>
      </ul>
      <p><a href="/timetable">My Timetable</a></p>
      <p><a href="/calendar">Academic Calendar</a></p>
      <p><a href="/attendance">Attendance</a></p>
      <button onClick={logout}>Log out</button>
    </main>
  );
}
