import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getAttendanceSubjects, getScheduledAttendanceClasses } from "./attendanceSchedule";
import {
  buildAttendanceSummary,
  calculateOverallAttendance,
  calculatePercentage,
  calculateSubjectAttendance,
  attendanceStatus,
  validateBaseline,
} from "./attendanceLogic";

export {
  buildAttendanceSummary,
  calculateOverallAttendance,
  calculatePercentage,
  calculateSubjectAttendance,
  attendanceStatus,
  validateBaseline,
} from "./attendanceLogic";
export { getAttendanceSubjects, getScheduledAttendanceClasses } from "./attendanceSchedule";

function attendanceRoot(uid, collectionName) {
  return collection(db, "students", uid, collectionName);
}

export async function loadAttendanceData(uid) {
  const [baselineSnapshot, recordSnapshot] = await Promise.all([
    getDocs(query(attendanceRoot(uid, "attendanceBaselines"))),
    getDocs(query(attendanceRoot(uid, "attendanceRecords"))),
  ]);
  return {
    baselines: Object.fromEntries(baselineSnapshot.docs.map((item) => [item.id, item.data()])),
    records: recordSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
  };
}

export async function saveAttendanceBaseline(uid, profile, baselineDate, values) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(baselineDate)) {
    throw new Error("Choose a valid baseline date.");
  }
  const allowedCodes = new Set(getAttendanceSubjects(profile).map((subject) => subject.courseCode));
  const batch = writeBatch(db);
  for (const [courseCode, value] of Object.entries(values)) {
    if (!allowedCodes.has(courseCode)) throw new Error("Baseline contains a subject outside your timetable.");
    const validated = validateBaseline(value.conductedClasses, value.attendedClasses);
    batch.set(doc(db, "students", uid, "attendanceBaselines", courseCode), {
      courseCode,
      baselineDate,
      ...validated,
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

export async function saveAttendanceRecord(uid, profile, occurrence, status) {
  if (!occurrence?.occurrenceId || !["present", "absent"].includes(status)) {
    throw new Error("Choose Present or Absent for a scheduled class.");
  }
  const scheduled = getScheduledAttendanceClasses(profile, occurrence.date)
    .find((item) => item.occurrenceId === occurrence.occurrenceId);
  if (!scheduled) throw new Error("Attendance can only be marked for a scheduled class.");
  const baselineSnapshot = await getDoc(doc(db, "students", uid, "attendanceBaselines", scheduled.courseCode));
  if (baselineSnapshot.exists() && scheduled.date < baselineSnapshot.data().baselineDate) {
    throw new Error("This class is before the subject's attendance baseline date.");
  }
  await setDoc(doc(db, "students", uid, "attendanceRecords", scheduled.occurrenceId), {
    occurrenceId: scheduled.occurrenceId,
    timetableId: scheduled.timetableId,
    timetableEntryId: scheduled.timetableEntryId,
    date: scheduled.date,
    courseCode: scheduled.courseCode,
    status,
    updatedAt: serverTimestamp(),
  });
}
