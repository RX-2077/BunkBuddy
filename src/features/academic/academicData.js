// Shared academic seed data for Module 2.
// Add future timetable records here without changing the timetable UI.

export const ACADEMIC_YEAR = "2026-27";
export const SEMESTER = 5;

export const academicSemesters = [
  {
    id: "2026-27-semester-5",
    academicYear: ACADEMIC_YEAR,
    semester: SEMESTER,
    semesterStartDate: "2026-07-20",
    semesterEndDate: "2026-11-28",
    regularClassesStartDate: "2026-08-03",
  },
];

export const subjects = [
  { courseCode: "BIS501G", courseName: "Data Science and Visualization", faculty: "Ms. Sneha Bose", facultyInitial: "SB", credits: 4, contactHours: "4 + 2" },
  { courseCode: "BIS502G", courseName: "Data Communications and Networking", faculty: "Mr. Pratheek H", facultyInitial: "PH", credits: 4, contactHours: "4 + 2" },
  { courseCode: "BIS503T", courseName: "Automata Theory and Computability", faculty: "Dr. Sudheer Shetty", facultyInitial: "SD", credits: 3, contactHours: "4" },
  { courseCode: "BIS504T", courseName: "Database Management Systems", faculty: "Dr. Vasudeva Rao P V", facultyInitial: "VR", credits: 3, contactHours: "4" },
  { courseCode: "BIS505L", courseName: "Database Management Systems Laboratory", faculty: "Dr. Vasudeva Rao P V", facultyInitial: "VR", credits: 1, contactHours: "2" },
  { courseCode: "BIS506E1", courseName: "Information Storage and Management", faculty: "Dr. Rithesh Pakkala P", facultyInitial: "RP", credits: 3, contactHours: "4" },
  { courseCode: "BIS507P", courseName: "Mini-Project Work", faculty: "Ms. Sneha Bose", facultyInitial: "SB", credits: 2, contactHours: "4" },
  { courseCode: "BBS508AK", courseName: "Research Methodology and IPR", faculty: "Mrs. Shwetha S Shetty", facultyInitial: "SS", credits: 1, contactHours: "1" },
  { courseCode: "BBS509TK", courseName: "Environmental Studies", faculty: "Ms. Madhura", facultyInitial: "MD", credits: 1, contactHours: "1" },
];

export const timeSlots = [
  { id: "08:30-09:30", startTime: "08:30", endTime: "09:30", label: "8:30 - 9:30", type: "period" },
  { id: "09:30-10:30", startTime: "09:30", endTime: "10:30", label: "9:30 - 10:30", type: "period" },
  { id: "10:30-10:45", startTime: "10:30", endTime: "10:45", label: "Morning break", type: "break" },
  { id: "10:45-11:45", startTime: "10:45", endTime: "11:45", label: "10:45 - 11:45", type: "period" },
  { id: "11:45-12:45", startTime: "11:45", endTime: "12:45", label: "11:45 - 12:45", type: "period" },
  { id: "12:45-13:30", startTime: "12:45", endTime: "13:30", label: "Lunch break", type: "break" },
  { id: "13:30-14:30", startTime: "13:30", endTime: "14:30", label: "1:30 - 2:30", type: "period" },
  { id: "14:30-15:30", startTime: "14:30", endTime: "15:30", label: "2:30 - 3:30", type: "period" },
  { id: "15:30-16:30", startTime: "15:30", endTime: "16:30", label: "3:30 - 4:30", type: "period" },
  { id: "16:30-17:00", startTime: "16:30", endTime: "17:00", label: "4:30 - 5:00", type: "period" },
];

const classEntry = (day, startTime, endTime, courseCode, type = "class", extra = {}) => ({
  day,
  startTime,
  endTime,
  courseCodes: courseCode ? [courseCode] : [],
  type,
  room: "LH 323",
  ...extra,
});

export const sharedTimetables = [
  {
    id: "2026-27-5-IS-B",
    academicYear: ACADEMIC_YEAR,
    semester: SEMESTER,
    branch: "IS",
    section: "B",
    department: "Information Science & Engineering",
    room: "LH 323",
    timeSlotIds: timeSlots.map(({ id }) => id),
    entries: [
      classEntry("Monday", "08:30", "09:30", "BIS501G"),
      classEntry("Monday", "09:30", "10:30", "BIS503T"),
      classEntry("Monday", "10:45", "11:45", "BIS502G"),
      classEntry("Tuesday", "08:30", "09:30", "BIS501G"),
      classEntry("Tuesday", "09:30", "10:30", "BIS504T"),
      classEntry("Tuesday", "13:30", "15:30", "BIS501G", "lab", { courseCodes: ["BIS501G", "BIS502G", "BIS505L"], group: "B1/B2/B3" }),
      classEntry("Wednesday", "10:45", "11:45", "BIS506E1"),
      classEntry("Wednesday", "11:45", "12:45", "BBS508AK"),
      classEntry("Thursday", "08:30", "09:30", "BIS502G"),
      classEntry("Thursday", "09:30", "10:30", "BIS503T"),
      classEntry("Thursday", "13:30", "15:30", "BIS505L", "lab", { courseCodes: ["BIS501G", "BIS502G", "BIS505L"], group: "B1/B2/B3" }),
      classEntry("Friday", "10:45", "11:45", "BIS504T"),
      classEntry("Friday", "11:45", "12:45", "BBS509TK"),
      classEntry("Friday", "13:30", "17:00", "BIS507P"),
      classEntry("Saturday", "08:30", "09:30", null, "tutorial", { label: "TUTORIALS" }),
      classEntry("Saturday", "09:30", "10:30", null, "remedial", { label: "REMEDIAL CLASS" }),
      classEntry("Saturday", "10:45", "11:45", null, "activity", { label: "Mentor - Mentee Activity" }),
      classEntry("Saturday", "11:45", "12:45", null, "other", { label: "10 SEC - PRACTICE" }),
    ],
  },
];

export const calendarEvents = [
  { startDate: "2026-07-20", endDate: "2026-07-20", name: "Semester calendar begins", type: "academic_event" },
  { startDate: "2026-08-03", endDate: "2026-08-03", name: "Commencement of Regular Classes", type: "academic_event" },
  { startDate: "2026-08-15", endDate: "2026-08-15", name: "Independence Day", type: "holiday" },
  { startDate: "2026-08-26", endDate: "2026-08-26", name: "Eid-Milad", type: "holiday" },
  { startDate: "2026-09-07", endDate: "2026-09-09", name: "Continuous Internal Evaluation - I", type: "evaluation" },
  { startDate: "2026-09-21", endDate: "2026-09-21", name: "Student feedback period", type: "feedback" },
  { startDate: "2026-10-02", endDate: "2026-10-02", name: "Gandhi Jayanti", type: "holiday" },
  { startDate: "2026-11-28", endDate: "2026-11-28", name: "Semester completion", type: "academic_event" },
];

export const calendarWeekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
