import { TOPICS, getTopicBySlug } from "@/data/topics";
import { notFound } from "next/navigation";
import LabClient from "./LabClient";

export const instant = false;

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export default async function LabPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return <LabClient topic={topic} />;
}
