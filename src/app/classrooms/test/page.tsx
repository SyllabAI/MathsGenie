import type { Metadata } from "next";
import EmptyClassroomState from "@/components/member/EmptyClassroomState";

export const metadata: Metadata = { title: "Tests" };

/** /classrooms/test — original shows a classroom-gated empty state. */
export default function TestsPage() {
  return (
    <EmptyClassroomState
      title="Tests"
      note="Tests belong to classrooms. Create one to set your first test."
    />
  );
}
