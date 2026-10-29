"use client";

import ALevelHub from "@/components/a-level/ALevelHub";
import { AS_LEVEL_SUBJECTS, asSubjectHref } from "@/lib/aslevel-subjects";

/**
 * Client wrapper for the AS-Level subjects hub — the deck cards need a
 * link resolver function, which cannot cross the server/client boundary,
 * so the AS binding lives here.
 */
export default function AsLevelHub() {
  return (
    <ALevelHub
      title="AS Level Subjects"
      subjects={AS_LEVEL_SUBJECTS}
      hrefFor={asSubjectHref}
      internalCourse="/as-level/maths/edexcel"
      courseName="AS Level Maths"
    />
  );
}
