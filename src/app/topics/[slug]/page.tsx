import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicBySlug, TOPICS } from "@/data/topics";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import {
  CheckCircle2,
  Clock,
  GraduationCap,
  FlaskConical,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  FileText
} from "lucide-react";


export function generateStaticParams() {
  return TOPICS.map((topic) => ({
    slug: topic.slug
  }));
}

export default async function TopicDetailPage({
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
    <div className="pb-16">
      <Breadcrumb
        topicSlug={topic.slug}
        topicTitle={topic.title}
        activeStage="material"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Topic Header Card */}
        <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-6 sm:p-8 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#DDF0FF] text-[#174A8B]">
              {topic.badge}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#617187] ml-2">
              <GraduationCap className="w-4 h-4" />
              <span>{topic.gradeLevel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#617187] ml-2">
              <Clock className="w-4 h-4" />
              <span>Estimasi: {topic.durationMinutes} menit</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172B45] tracking-tight mb-4">
            {topic.title}
          </h1>

          <p className="text-sm sm:text-base text-[#617187] leading-relaxed mb-6">
            {topic.formalContent.introduction}
          </p>

          {/* Quick CTA to Lab */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#DCE6F1]">
            <Link
              href={`/topics/${topic.slug}/lab`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2583E8] hover:bg-[#1f6fc7] shadow-xs transition-all"
            >
              <FlaskConical className="w-4 h-4" />
              Masuk ke Laboratorium 2D
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-xs text-[#617187]">
              Atau baca materi lengkap di bawah ini terlebih dahulu.
            </span>
          </div>
        </div>

        {/* Learning Objectives & Prerequisites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-6">
            <h2 className="text-sm font-bold text-[#174A8B] uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#23845B]" />
              Tujuan Pembelajaran
            </h2>
            <ul className="space-y-2.5">
              {topic.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#172B45] leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#F3F8FF] text-[#2583E8] border border-[#DCE6F1] flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl border border-[#DCE6F1] p-6">
            <h2 className="text-sm font-bold text-[#174A8B] uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2583E8]" />
              Prasyarat Konsep
            </h2>
            <ul className="space-y-2">
              {topic.prerequisites.map((req, i) => (
                <li key={i} className="text-xs text-[#617187] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2583E8] shrink-0 mt-1.5"></span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-6 mb-8">
          {topic.formalContent.sections.map((sec, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-[#174A8B] mb-4">
                {sec.title}
              </h2>
              <div className="space-y-3 mb-5">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-[#172B45] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {sec.keyPoints && sec.keyPoints.length > 0 && (
                <div className="p-4 bg-[#F3F8FF] rounded-xl border border-[#DCE6F1]">
                  <span className="text-[11px] font-bold text-[#174A8B] uppercase tracking-wider block mb-2">
                    Poin Kunci Konsep:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {sec.keyPoints.map((point, kIdx) => (
                      <div key={kIdx} className="text-xs text-[#172B45] flex items-start gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#23845B] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formula Tables */}
        <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-6 sm:p-8 mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[#174A8B] mb-4">
            Rumus & Persamaan Ilmiah
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topic.formalContent.formulas.map((form, fIdx) => (
              <div key={fIdx} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F1]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#172B45]">{form.name}</span>
                </div>
                <div className="text-lg font-extrabold text-[#2583E8] font-mono py-2 px-3 bg-white rounded-lg border border-[#DCE6F1] inline-block mb-3">
                  {form.formula}
                </div>
                <p className="text-xs text-[#617187] mb-3">{form.description}</p>
                <div className="space-y-1 pt-2 border-t border-[#DCE6F1]">
                  {form.variables.map((v, vIdx) => (
                    <div key={vIdx} className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#174A8B]">{v.symbol}</span>
                      <span className="text-[#617187]">{v.name} ({v.unit})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real World Applications & Safety Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-6">
            <h3 className="text-sm font-bold text-[#174A8B] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#A96508]" />
              Penerapan dalam Kehidupan Sehari-hari
            </h3>
            <ul className="space-y-2.5">
              {topic.formalContent.realWorldApplications.map((app, i) => (
                <li key={i} className="text-xs text-[#617187] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD45A] shrink-0 mt-1.5"></span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FFF4C7]/40 rounded-2xl border border-[#FFD45A]/50 p-6">
            <h3 className="text-sm font-bold text-[#A96508] uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#A96508]" />
              Catatan Keselamatan & Asumsi Model
            </h3>
            <ul className="space-y-2">
              {topic.formalContent.safetyAndAssumptions.map((note, i) => (
                <li key={i} className="text-xs text-[#617187] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A96508] shrink-0 mt-1.5"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-8 text-center">
          <h3 className="text-lg font-bold text-[#172B45] mb-2">
            Siap untuk Menguji Variabel Secara Mandiri?
          </h3>
          <p className="text-xs text-[#617187] max-w-lg mx-auto mb-6">
            Langkah selanjutnya adalah mencoba eksperimen virtual 2D. Ubah parameter dan amati responsnya sebelum mengerjakan kuis evaluasi.
          </p>
          <Link
            href={`/topics/${topic.slug}/lab`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#2583E8] hover:bg-[#1f6fc7] shadow-md hover:shadow-lg transition-all"
          >
            <FlaskConical className="w-5 h-5" />
            Lanjut ke Laboratorium 2D
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
