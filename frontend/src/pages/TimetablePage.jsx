import { useMemo } from "react";
import { useAuth } from "../auth/useAuth";
import { findTimetable, getSubject } from "../features/academic/academicService";
import { timeSlots } from "../features/academic/academicData";
import { CURRENT_ACADEMIC_YEAR } from "../config/constants";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function entryLabel(entry) {
  if (entry.label) return entry.label;
  return entry.courseCodes.map((code) => getSubject(code)?.courseName ?? code).join(" / ");
}

export default function TimetablePage() {
  const { profile } = useAuth();
  const timetable = useMemo(() => findTimetable({
    academicYear: profile?.academicYear ?? CURRENT_ACADEMIC_YEAR,
    semester: profile?.semester,
    branch: profile?.branch,
    section: profile?.section,
  }), [profile]);

  if (!timetable) {
    return <main className="page"><a href="/home">Back to home</a><h1>My Timetable</h1><p>No shared timetable is available for this academic profile yet.</p></main>;
  }

  return (
    <main className="page">
      <nav className="page-nav"><a href="/home">Home</a><a href="/calendar">Academic Calendar</a></nav>
      <header className="page-header">
        <p className="eyebrow">Shared timetable</p>
        <h1>My Timetable</h1>
        <p>{timetable.department} · {timetable.academicYear} · Semester {timetable.semester} · {timetable.branch} {timetable.section} · {timetable.room}</p>
      </header>
      <div className="timetable-wrap">
        <table className="timetable">
          <thead><tr><th>Time</th>{DAYS.map((day) => <th key={day}>{day}</th>)}</tr></thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.id} className={slot.type === "break" ? "break-row" : ""}>
                <th>{slot.label}</th>
                {DAYS.map((day) => {
                  const entries = timetable.entries.filter((entry) => entry.day === day && entry.startTime === slot.startTime);
                  const entry = entries[0];
                  return <td key={day}>{entry ? <><strong>{entryLabel(entry)}</strong>{entry.group && <small>{entry.group}</small>}<small>{entry.type}</small></> : slot.type === "break" ? <span className="muted">Break</span> : <span className="muted">-</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">This is the shared baseline timetable. It is read-only in Module 2.</p>
    </main>
  );
}
