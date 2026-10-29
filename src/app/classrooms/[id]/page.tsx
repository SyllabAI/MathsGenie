import type { Metadata } from "next";
import ClassroomDetailClient from "@/components/member/ClassroomDetailClient";

export const metadata: Metadata = { title: "Classroom" };

/**
 * /classrooms/[id] — teacher view of one classroom (research/04-member-area.md §4):
 * "View as student" banner, name, tabs (Resources/Lessons/Tests/Homework/Members).
 * The Tests and Homework tabs are classroom-scoped lists (this class only) with
 * wizards pre-scoped to the class; "View as student" flips to the student view
 * whose Resources tab becomes the chronological class feed. All interactivity
 * lives in ClassroomDetailClient (data comes from localStorage).
 */
export default async function ClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClassroomDetailClient id={id} />;
}
