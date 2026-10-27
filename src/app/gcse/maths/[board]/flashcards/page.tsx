import type { Metadata } from "next";
import HubPage from "@/components/HubPage";

export const metadata: Metadata = { title: "GCSE Maths Flashcards" };

export default async function Page({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  return HubPage({ board, mode: "flashcards" });
}
