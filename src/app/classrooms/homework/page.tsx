import type { Metadata } from "next";
import Link from "next/link";
import EmptyClassroomState from "@/components/member/EmptyClassroomState";

export const metadata: Metadata = { title: "Homework" };

/** /classrooms/homework — original shows a classroom-gated empty state. */
export default function HomeworkPage() {
  return (
    <EmptyClassroomState
      title="Homework"
      note="Homework you set (or receive) lives in your classrooms. Create one to get started."
    />
  );
}
