import type { Metadata } from "next";
import SettingsAccount from "@/components/member/SettingsAccount";

export const metadata: Metadata = { title: "Settings" };

/** /settings/account — settings shell with category tabs (original layout). */
export default function SettingsPage() {
  return <SettingsAccount />;
}
