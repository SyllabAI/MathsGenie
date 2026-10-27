import type { Metadata } from "next";
import { Suspense } from "react";
import CourseInner from "@/components/CourseInner";

export const metadata: Metadata = { title: "Course" };

export default function CoursePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-12 text-muted">Loading…</div>}>
      <CourseInner />
    </Suspense>
  );
}
