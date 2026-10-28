import { redirect } from "next/navigation";

/** Old demo dashboard removed — member sections now live under /classrooms and /settings. */
export default async function DashboardSectionRedirect({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  redirect(section === "settings" ? "/settings/account" : "/classrooms");
}
