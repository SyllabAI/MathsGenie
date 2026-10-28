import { redirect } from "next/navigation";

/** Old demo dashboard removed — the member home now lives at /classrooms. */
export default function DashboardRedirect() {
  redirect("/classrooms");
}
