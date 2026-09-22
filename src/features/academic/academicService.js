import {
  academicSemesters,
  calendarEvents,
  sharedTimetables,
  subjects,
} from "./academicData";

export function getAcademicSemester(academicYear, semester) {
  return academicSemesters.find(
    (record) => record.academicYear === academicYear && record.semester === Number(semester)
  ) ?? null;
}

export function findTimetable({ academicYear, semester, branch, section }) {
  return sharedTimetables.find(
    (record) =>
      record.academicYear === academicYear &&
      record.semester === Number(semester) &&
      record.branch === branch &&
      record.section === section
  ) ?? null;
}

export function getSubject(courseCode) {
  return subjects.find((subject) => subject.courseCode === courseCode) ?? null;
}

export function getCalendarEventsOnDate(date) {
  return calendarEvents.filter(
    (event) => event.startDate <= date && date <= event.endDate
  );
}

export function validateAcademicData() {
  const subjectCodes = new Set(subjects.map((subject) => subject.courseCode));
  const invalidEntries = [];

  for (const timetable of sharedTimetables) {
    for (const entry of timetable.entries) {
      for (const courseCode of entry.courseCodes) {
        if (!subjectCodes.has(courseCode)) {
          invalidEntries.push({ timetableId: timetable.id, courseCode });
        }
      }
    }
  }

  return invalidEntries;
}

const invalidEntries = validateAcademicData();
if (invalidEntries.length > 0) {
  throw new Error(`Invalid academic seed references: ${JSON.stringify(invalidEntries)}`);
}
