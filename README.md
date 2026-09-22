# Attendance Planner — Modules 1 and 2

Account, Login & Onboarding plus the shared academic calendar and shared timetable.
Attendance and personal timetable changes are intentionally out of scope.

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in your Firebase project keys
npm run dev
```

Deploy Firestore rules (enforces USN uniqueness + per-user access):

```bash
firebase deploy --only firestore:rules
```

## Tests

```bash
npm test
```

`tests/auth.test.js` requires the Firebase emulator suite running against
`auth` and `firestore` emulators, and `src/lib/firebase.js` pointed at
those emulators in test mode.

## Module 2 academic data

The initial shared dataset is stored in
`src/features/academic/academicData.js`, separately from the React views:

- `academicSemesters` stores the 2026-27 Semester 5 date range and regular-class start date.
- `subjects` stores course and faculty metadata.
- `timeSlots` stores class periods and non-class breaks.
- `sharedTimetables` stores the IS / B / Semester 5 timetable by full identity.
- `calendarEvents` stores holidays and academic events, including date ranges.

`academicService.js` resolves timetables by academic year, semester, branch, and
section, resolves subjects, retrieves calendar events by date, and validates
that every timetable course reference exists. Add another shared timetable by
adding a record to `sharedTimetables`; the UI does not need a new component.

The seed is intentionally a source-controlled data layer for this module. No
student-facing upload or timetable editing feature has been added, and no
attendance logic is derived from the calendar or timetable.

## Module 3 attendance data

Attendance is stored below the authenticated student's document:

- `students/{uid}/attendanceBaselines/{courseCode}` stores historical conducted and attended counts plus the inclusive `baselineDate`.
- `students/{uid}/attendanceRecords/{occurrenceId}` stores one scheduled occurrence, its date, course, and `present` or `absent` status.

The occurrence ID includes the date, timetable identity, timetable-entry index,
and course code. Re-marking a class uses the same document and corrects its
status instead of creating a second record. Firestore rules restrict both
collections to the owning authenticated UID. Rotational multi-course lab rows
remain in the shared timetable but are not attendance opportunities until a
student subgroup rule exists.

## Assumptions made

- Frontend stack: React + Vite. Backend: Firebase Authentication + Firestore
  (the example architecture named in the requirements doc). Swap these files
  for your actual stack if different.
- Firebase Auth requires an email-shaped identifier internally, so USNs are
  mapped to a synthetic internal email (`usn@usn.attendanceplanner.internal`)
  that the user never sees or enters — they only ever type their USN.
- USN uniqueness is enforced via a `usnIndex` collection keyed by USN,
  written inside a Firestore transaction, plus security rules that forbid
  client-side updates/deletes to that collection.
- Semester options are a plain 1–8 list since the doc doesn't specify a
  program length; adjust `SEMESTER_OPTIONS` in `constants.js` if needed.
