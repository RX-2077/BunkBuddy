import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { CURRENT_ACADEMIC_YEAR } from "../config/constants";
import {
  attendanceStatus,
  buildAttendanceSummary,
} from "../features/attendance/attendanceLogic";
import {
  getAttendanceSubjects,
  getScheduledAttendanceClasses,
} from "../features/attendance/attendanceSchedule";
import {
  loadAttendanceData,
  saveAttendanceBaseline,
  saveAttendanceRecord,
} from "../features/attendance/attendanceService";

const today = new Date().toISOString().slice(0, 10);

function formatPercentage(value) {
  return value === null ? "No attendance data" : `${value.toFixed(2)}%`;
}

export default function AttendancePage() {
  const { user, profile } = useAuth();
  const [data, setData] = useState({ baselines: {}, records: [] });
  const [date, setDate] = useState(today);
  const [view, setView] = useState("dashboard");
  const [baselineDate, setBaselineDate] = useState("");
  const [baselineValues, setBaselineValues] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const subjects = useMemo(() => getAttendanceSubjects({ ...profile, academicYear: profile?.academicYear ?? CURRENT_ACADEMIC_YEAR }), [profile]);
  const scheduledClasses = useMemo(() => getScheduledAttendanceClasses({ ...profile, academicYear: profile?.academicYear ?? CURRENT_ACADEMIC_YEAR }, date), [profile, date]);
  const summary = useMemo(() => buildAttendanceSummary(subjects, data.baselines, data.records), [subjects, data]);
  const hasBaseline = Object.keys(data.baselines).length > 0;

  async function refresh() {
    setLoading(true);
    try { setData(await loadAttendanceData(user.uid)); } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, [user.uid]);

  function initializeBaselineValue(courseCode, field, value) {
    setBaselineValues((current) => ({
      ...current,
      [courseCode]: { conductedClasses: 0, attendedClasses: 0, ...current[courseCode], [field]: value === "" ? "" : Number(value) },
    }));
  }

  async function handleBaselineSubmit(event) {
    event.preventDefault();
    setError("");
    if (!baselineDate) { setError("Choose the date your historical attendance totals take effect."); return; }
    setSaving(true);
    try { await saveAttendanceBaseline(user.uid, profile, baselineDate, baselineValues); await refresh(); setView("dashboard"); }
    catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function markClass(occurrence, status) {
    setError("");
    try { await saveAttendanceRecord(user.uid, profile, occurrence, status); await refresh(); }
    catch (err) { setError(err.message); }
  }

  if (loading) return <main className="page"><p>Loading attendance...</p></main>;

  if (!hasBaseline) {
    return <main className="page"><nav className="page-nav"><a href="/home">Home</a></nav><header className="page-header"><p className="eyebrow">Personal attendance</p><h1>Set Up Your Attendance</h1><p>Your semester is already in progress. Enter your current attendance before tracking new classes.</p></header>{error && <p className="error" role="alert">{error}</p>}<form className="baseline-form" onSubmit={handleBaselineSubmit}><label>Baseline effective date<input type="date" value={baselineDate} onChange={(event) => setBaselineDate(event.target.value)} required /></label>{subjects.map((subject) => { const values = baselineValues[subject.courseCode] ?? {}; return <fieldset key={subject.courseCode}><legend>{subject.courseCode} · {subject.courseName}</legend><label>Conducted classes<input type="number" min="0" step="1" value={values.conductedClasses ?? ""} onChange={(event) => initializeBaselineValue(subject.courseCode, "conductedClasses", event.target.value)} required /></label><label>Attended classes<input type="number" min="0" step="1" value={values.attendedClasses ?? ""} onChange={(event) => initializeBaselineValue(subject.courseCode, "attendedClasses", event.target.value)} required /></label></fieldset>; })}<button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Attendance"}</button></form></main>;
  }

  return <main className="page"><nav className="page-nav"><a href="/home">Home</a><a href="/timetable">Timetable</a><a href="/calendar">Calendar</a></nav><header className="page-header"><p className="eyebrow">Personal attendance</p><h1>Attendance</h1><p>Historical baseline plus your tracked scheduled classes.</p></header><div className="attendance-tabs"><button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>Dashboard</button><button className={view === "mark" ? "active" : ""} onClick={() => setView("mark")}>Mark classes</button><button className={view === "history" ? "active" : ""} onClick={() => setView("history")}>History</button></div>{error && <p className="error" role="alert">{error}</p>}{view === "dashboard" && <section><div className="overall"><p className="eyebrow">Overall attendance</p><strong>{formatPercentage(summary.overall.percentage)}</strong><p>Attended {summary.overall.attendedClasses} of {summary.overall.conductedClasses}</p><span>{attendanceStatus(summary.overall.percentage)}</span></div><div className="attendance-subjects">{summary.subjects.map((item) => <article className="attendance-subject" key={item.subject.courseCode}><div><strong>{item.subject.courseName}</strong><small>{item.subject.courseCode}</small></div><b>{item.attendedClasses} / {item.conductedClasses}</b><span>{formatPercentage(item.percentage)}</span><em>{attendanceStatus(item.percentage)}</em></article>)}</div></section>}{view === "mark" && <section><label className="date-picker">Class date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><h2>{scheduledClasses.length ? `Scheduled classes on ${date}` : `No attendance classes on ${date}`}</h2>{scheduledClasses.map((item) => { const record = data.records.find((entry) => entry.id === item.occurrenceId || entry.occurrenceId === item.occurrenceId); return <article className="scheduled-class" key={item.occurrenceId}><div><strong>{item.subject?.courseName ?? item.courseCode}</strong><small>{item.startTime} - {item.endTime} · {item.type} · {item.room}</small></div><button className={record?.status === "present" ? "selected" : ""} onClick={() => markClass(item, "present")}>Present</button><button className={record?.status === "absent" ? "selected absent" : ""} onClick={() => markClass(item, "absent")}>Absent</button></article>; })}</section>}{view === "history" && <section><h2>Attendance history</h2>{data.records.length ? <div className="history-list">{[...data.records].sort((a, b) => b.date.localeCompare(a.date)).map((record) => <article className="history-row" key={record.id}><span>{record.date}</span><strong>{subjects.find((subject) => subject.courseCode === record.courseCode)?.courseName ?? record.courseCode}</strong><em className={record.status}>{record.status}</em></article>)}</div> : <p className="muted">No tracked attendance records yet.</p>}</section>}</main>;
}
