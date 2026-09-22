import { useState } from "react";
import { calendarEvents, academicSemesters } from "../features/academic/academicData";
import { getCalendarEventsOnDate } from "../features/academic/academicService";

const monthLabel = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });

export default function AcademicCalendarPage() {
  const [selectedDate, setSelectedDate] = useState("2026-08-26");
  const selectedEvents = getCalendarEventsOnDate(selectedDate);
  const semester = academicSemesters[0];

  return (
    <main className="page">
      <nav className="page-nav"><a href="/home">Home</a><a href="/timetable">My Timetable</a></nav>
      <header className="page-header">
        <p className="eyebrow">Academic calendar</p>
        <h1>{monthLabel.format(new Date(`${selectedDate}T00:00:00`))}</h1>
        <p>{semester.academicYear} · Semester {semester.semester} · {semester.semesterStartDate} to {semester.semesterEndDate}</p>
      </header>
      <section className="calendar-layout">
        <label className="date-picker">Inspect a date<input type="date" value={selectedDate} min={semester.semesterStartDate} max={semester.semesterEndDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>
        <div className="event-detail"><h2>{selectedDate}</h2>{selectedEvents.length ? selectedEvents.map((event) => <article className={`event event-${event.type}`} key={`${event.startDate}-${event.name}`}><strong>{event.name}</strong><span>{event.type.replace("_", " ")}{event.startDate !== event.endDate && ` · ${event.startDate} to ${event.endDate}`}</span></article>) : <p className="muted">No recorded event for this date.</p>}</div>
      </section>
      <section className="event-list"><h2>Semester events</h2>{calendarEvents.map((event) => <button className="event-row" key={`${event.startDate}-${event.name}`} onClick={() => setSelectedDate(event.startDate)}><span>{event.startDate}{event.startDate !== event.endDate && ` - ${event.endDate}`}</span><strong>{event.name}</strong><em>{event.type.replace("_", " ")}</em></button>)}</section>
    </main>
  );
}
