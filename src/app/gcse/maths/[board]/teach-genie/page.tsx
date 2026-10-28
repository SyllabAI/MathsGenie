import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourceHubShell from "@/components/member/ResourceHubShell";
import TeachGenieSession from "@/components/member/TeachGenieSession";
import { gradeTabs, isBoard, loadTopics } from "@/lib/data";

export const metadata: Metadata = { title: "Teach Genie" };

/**
 * /gcse/maths/[board]/teach-genie — interactive "Learn by Teaching"
 * session: pick topics → teach Baby Genie → see what stuck, with the
 * landing hero + How-it-works strip from the original pattern.
 */
export default async function TeachGeniePage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const groups = gradeTabs(doc).map((grade) => ({
    grade,
    topics: doc.grades[grade].map((t) => ({ slug: t.slug, title: t.title })),
  }));

  const tabs = [
    { label: "All resources", href: `/gcse/maths/${board}`, icon: "▦" },
    { label: "Question bank", href: `/gcse/maths/${board}/questions`, icon: "◉" },
    { label: "Flashcards", href: `/gcse/maths/${board}/flashcards`, icon: "🗂" },
    { label: "Teach Genie", href: `/gcse/maths/${board}/teach-genie`, icon: "🧞" },
    { label: "Lessons", href: `/gcse/maths/${board}/lessons`, icon: "📖" },
  ];

  return (
    <ResourceHubShell board={board} title="Teach Genie" activeTab="Teach Genie" tabs={tabs}>
      <TeachGenieSession board={board} groups={groups} />
    </ResourceHubShell>
  );
}
