import type { Metadata } from "next";
import ClassroomChooserLanding from "@/components/member/ClassroomChooserLanding";

export const metadata: Metadata = { title: "GCSE Lessons" };

/** /gcse/lessons — member landing, classroom chooser (original behavior). */
export default function GcseLessonsLanding() {
  return <ClassroomChooserLanding kind="lessons" />;
}
