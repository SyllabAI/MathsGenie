import type { Metadata } from "next";
import ClassroomChooserLanding from "@/components/member/ClassroomChooserLanding";

export const metadata: Metadata = { title: "GCSE Videos" };

/** /gcse/videos — member landing, classroom chooser (original behavior). */
export default function GcseVideosLanding() {
  return <ClassroomChooserLanding kind="videos" />;
}
