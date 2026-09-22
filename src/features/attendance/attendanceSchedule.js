import { getCalendarEventsOnDate, findTimetable, getSubject } from "../academic/academicService";
import { CURRENT_ACADEMIC_YEAR } from "../../config/constants";

const TRACKED_ENTRY_TYPES = new Set(["class", "lab"]);

function dayNameForDate(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function isHoliday(date) {
  return getCalendarEventsOnDate(date).some((event) => event.type === "holiday");
}

export function getAttendanceSubjects(profile) {
  const timetable = findTimetable({
    academicYear: profile?.academicYear ?? CURRENT_ACADEMIC_YEAR,
    semester: profile?.semester,
    branch: profile?.branch,
    section: profile?.section,
  });
  if (!timetable) return [];
  return [...new Set(timetable.entries.flatMap((entry) => entry.courseCodes))]
    .map((courseCode) => getSubject(courseCode))
    .filter(Boolean);
}

export function getScheduledAttendanceClasses(profile, date) {
  const timetable = findTimetable({
    academicYear: profile?.academicYear ?? CURRENT_ACADEMIC_YEAR,
    semester: profile?.semester,
    branch: profile?.branch,
    section: profile?.section,
  });
  if (!timetable || isHoliday(date)) return [];
  const day = dayNameForDate(date);
  return timetable.entries.flatMap((entry, entryIndex) => {
    if (!TRACKED_ENTRY_TYPES.has(entry.type) || entry.courseCodes.length !== 1) return [];
    return entry.courseCodes.map((courseCode) => ({
      occurrenceId: `${date}-${timetable.id}-${entryIndex}-${courseCode}`,
      timetableId: timetable.id,
      timetableEntryId: `${timetable.id}-${entryIndex}`,
      date,
      day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      courseCode,
      subject: getSubject(courseCode),
      type: entry.type,
      group: entry.group ?? null,
      room: entry.room ?? timetable.room,
    }));
  });
}
