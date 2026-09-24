export const OFFICIAL_MINIMUM_ATTENDANCE = 85;

function assertInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer.`);
  }
}

export function validateBaseline(conductedClasses, attendedClasses) {
  assertInteger(conductedClasses, "Conducted classes");
  assertInteger(attendedClasses, "Attended classes");
  if (attendedClasses > conductedClasses) {
    throw new Error("Attended classes cannot exceed conducted classes.");
  }
  return { conductedClasses, attendedClasses };
}

export function calculatePercentage(attendedClasses, conductedClasses) {
  if (conductedClasses === 0) return null;
  return Math.round((attendedClasses / conductedClasses) * 10000) / 100;
}

export function calculateSubjectAttendance(baseline = { conductedClasses: 0, attendedClasses: 0 }, records = []) {
  const uniqueRecords = [...new Map(records.map((record, index) => [record.occurrenceId ?? index, record])).values()];
  const conductedClasses = baseline.conductedClasses + uniqueRecords.length;
  const attendedClasses = baseline.attendedClasses + uniqueRecords.filter((record) => record.status === "present").length;
  return { conductedClasses, attendedClasses, percentage: calculatePercentage(attendedClasses, conductedClasses) };
}

export function calculateOverallAttendance(subjectAttendances) {
  const conductedClasses = subjectAttendances.reduce((total, subject) => total + subject.conductedClasses, 0);
  const attendedClasses = subjectAttendances.reduce((total, subject) => total + subject.attendedClasses, 0);
  return { conductedClasses, attendedClasses, percentage: calculatePercentage(attendedClasses, conductedClasses) };
}

export function attendanceStatus(percentage) {
  if (percentage === null) return "No attendance data";
  return percentage >= OFFICIAL_MINIMUM_ATTENDANCE ? "Meets college minimum" : "Below college minimum";
}

export function buildAttendanceSummary(subjects, baselines, records) {
  const subjectSummaries = subjects.map((subject) => {
    const baseline = baselines[subject.courseCode] ?? { conductedClasses: 0, attendedClasses: 0 };
    const subjectRecords = records.filter((record) => record.courseCode === subject.courseCode);
    return { subject, ...calculateSubjectAttendance(baseline, subjectRecords) };
  });
  return { subjects: subjectSummaries, overall: calculateOverallAttendance(subjectSummaries) };
}
