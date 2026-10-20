import { TOPICS, getTopicBySlug } from "@/data/topics";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import QuizRunner from "@/components/quiz/QuizRunner";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export default async function QuizPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="pb-20">
      <Breadcrumb
        topicSlug={topic.slug}
        topicTitle={topic.title}
        activeStage="quiz"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuizRunner topic={topic} />
      </div>
    </div>
  );
}
