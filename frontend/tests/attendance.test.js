import { describe, it, expect } from "vitest";
import {
  attendanceStatus,
  buildAttendanceSummary,
  calculatePercentage,
  calculateSubjectAttendance,
  validateBaseline,
} from "../src/features/attendance/attendanceLogic";
import { getAttendanceSubjects, getScheduledAttendanceClasses } from "../src/features/attendance/attendanceSchedule";

describe("attendance logic", () => {
  it("validates baseline counts", () => {
    expect(validateBaseline(20, 18)).toEqual({ conductedClasses: 20, attendedClasses: 18 });
    expect(() => validateBaseline(20, 21)).toThrow("Attended classes cannot exceed conducted classes.");
    expect(() => validateBaseline(-1, 0)).toThrow("Conducted classes must be a non-negative integer.");
    expect(() => validateBaseline(1, -1)).toThrow("Attended classes must be a non-negative integer.");
  });

  it("handles zero attendance without NaN or Infinity", () => {
    expect(calculatePercentage(0, 0)).toBeNull();
    expect(calculateSubjectAttendance({ conductedClasses: 0, attendedClasses: 0 }, [])).toMatchObject({ conductedClasses: 0, attendedClasses: 0, percentage: null });
  });

  it("adds present and absent tracked records to the baseline", () => {
    const baseline = { conductedClasses: 10, attendedClasses: 8 };
    expect(calculateSubjectAttendance(baseline, [{ status: "present" }])).toMatchObject({ conductedClasses: 11, attendedClasses: 9 });
    expect(calculateSubjectAttendance(baseline, [{ status: "absent" }])).toMatchObject({ conductedClasses: 11, attendedClasses: 8 });
  });

  it("calculates rounded subject percentages", () => {
    expect(calculatePercentage(9, 10)).toBe(90);
  });

  it("calculates overall attendance from total counts", () => {
    const summary = buildAttendanceSummary(
      [{ courseCode: "A" }, { courseCode: "B" }],
      { A: { conductedClasses: 10, attendedClasses: 9 }, B: { conductedClasses: 20, attendedClasses: 18 } },
      []
    );
    expect(summary.overall).toMatchObject({ conductedClasses: 30, attendedClasses: 27, percentage: 90 });
  });

  it("reports the official minimum status", () => {
    expect(attendanceStatus(null)).toBe("No attendance data");
    expect(attendanceStatus(84.99)).toBe("Below college minimum");
    expect(attendanceStatus(85)).toBe("Meets college minimum");
  });

  it("isolates student summaries and prevents duplicate occurrence effects", () => {
    const studentA = buildAttendanceSummary([{ courseCode: "BIS504T" }], { BIS504T: { conductedClasses: 20, attendedClasses: 18 } }, [{ occurrenceId: "one", courseCode: "BIS504T", status: "present" }, { occurrenceId: "one", courseCode: "BIS504T", status: "present" }]);
    const studentB = buildAttendanceSummary([{ courseCode: "BIS504T" }], { BIS504T: { conductedClasses: 25, attendedClasses: 20 } }, []);
    expect(studentA.overall).toMatchObject({ conductedClasses: 21, attendedClasses: 19 });
    expect(studentB.overall).toMatchObject({ conductedClasses: 25, attendedClasses: 20 });
  });

  it("derives attendance subjects and scheduled classes from the shared timetable", () => {
    const profile = { academicYear: "2026-27", semester: 5, branch: "IS", section: "B" };
    expect(getAttendanceSubjects(profile).map((subject) => subject.courseCode)).toContain("BIS504T");
    const classes = getScheduledAttendanceClasses(profile, "2026-09-21");
    expect(classes.some((item) => item.courseCode === "BIS501G")).toBe(true);
    expect(getScheduledAttendanceClasses(profile, "2026-08-26")).toEqual([]);
    expect(classes.some((item) => item.type === "tutorial")).toBe(false);
    expect(getScheduledAttendanceClasses(profile, "2026-09-22").some((item) => item.type === "lab")).toBe(false);
  });
});
