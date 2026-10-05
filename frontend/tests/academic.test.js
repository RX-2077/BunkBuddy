import { describe, it, expect } from "vitest";
import { calendarEvents, sharedTimetables } from "../src/features/academic/academicData";
import {
  findTimetable,
  getCalendarEventsOnDate,
  getSubject,
  validateAcademicData,
} from "../src/features/academic/academicService";

describe("shared academic data", () => {
  it("resolves the IS B semester 5 timetable by full identity", () => {
    expect(findTimetable({ academicYear: "2026-27", semester: 5, branch: "IS", section: "B" })?.id).toBe("2026-27-5-IS-B");
  });

  it("isolates section, branch, and semester", () => {
    expect(findTimetable({ academicYear: "2026-27", semester: 5, branch: "IS", section: "A" })).toBeNull();
    expect(findTimetable({ academicYear: "2026-27", semester: 5, branch: "CS", section: "B" })).toBeNull();
    expect(findTimetable({ academicYear: "2026-27", semester: 6, branch: "IS", section: "B" })).toBeNull();
  });

  it("keeps subjects separate and resolves faculty information", () => {
    expect(getSubject("BIS501G")).toMatchObject({ courseName: "Data Science and Visualization", facultyInitial: "SB" });
  });

  it("retrieves single-day and multi-day calendar events", () => {
    expect(getCalendarEventsOnDate("2026-08-26")[0].name).toBe("Eid-Milad");
    expect(getCalendarEventsOnDate("2026-09-08")[0]).toMatchObject({ startDate: "2026-09-07", endDate: "2026-09-09" });
    expect(getCalendarEventsOnDate("2026-08-03")[0].name).toBe("Commencement of Regular Classes");
  });

  it("represents breaks, activities, and combined lab courses without attendance logic", () => {
    const timetable = sharedTimetables[0];
    expect(timetable.timeSlotIds).toContain("10:30-10:45");
    expect(timetable.entries.find((entry) => entry.type === "tutorial")?.courseCodes).toEqual([]);
    expect(timetable.entries.find((entry) => entry.type === "lab")?.courseCodes).toEqual(["BIS501G", "BIS502G", "BIS505L"]);
    expect(timetable.entries.find((entry) => entry.type === "lab")?.group).toBe("B1/B2/B3");
    expect(timetable.entries.find((entry) => entry.type === "activity")?.label).toBe("Mentor - Mentee Activity");
  });

  it("has no invalid timetable subject references", () => {
    expect(validateAcademicData()).toEqual([]);
    expect(calendarEvents.length).toBeGreaterThan(0);
  });
});
