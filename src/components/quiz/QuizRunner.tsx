"use client";

import React, { useState } from "react";
import { QuizQuestion, TopicData } from "@/types";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  FlaskConical,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { saveTopicProgress } from "@/lib/storage";

interface QuizRunnerProps {
  topic: TopicData;
  onComplete?: (score: number, total: number) => void;
}

export default function QuizRunner({ topic, onComplete }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hasConfirmed, setHasConfirmed] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const questions = topic.quiz;
  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isConfirmed = hasConfirmed[currentIndex] === true;

  const handleSelectOption = (index: number) => {
    if (isConfirmed) return; // Prevent changing after confirmation
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: index }));
  };

  const handleConfirmAnswer = () => {
    if (!isAnswered) return;
    setHasConfirmed((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          correctCount++;
        }
      });

      const percentage = Math.round((correctCount / questions.length) * 100);

      // Save progress to local storage
      saveTopicProgress(topic.slug, {
        quizScore: correctCount,
        quizTotal: questions.length,
        quizPercentage: percentage,
        quizDate: new Date().toLocaleDateString("id-ID")
      });

      if (percentage >= 80) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      }

      setIsFinished(true);
      if (onComplete) {
        onComplete(correctCount, questions.length);
      }
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setHasConfirmed({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  // Calculate stats for finished state
  const total = questions.length;
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswerIndex) correctCount++;
  });
  const percentage = Math.round((correctCount / total) * 100);

  let category = "Perlu ditinjau";
  let categoryColor = "text-[#174A8B] bg-[#DDF0FF]";
  if (percentage >= 80) {
    category = "Memahami dengan baik";
    categoryColor = "text-[#23845B] bg-[#23845B]/10";
  } else if (percentage >= 60) {
    category = "Cukup memahami";
    categoryColor = "text-[#A96508] bg-[#FFF4C7]";
  }

  // Summary View
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#DDF0FF] text-[#2583E8] flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-[#172B45] mb-1">
          Hasil Evaluasi Pemahaman
        </h2>
        <p className="text-xs text-[#617187] mb-6">
          {topic.title}
        </p>

        {/* Score Card */}
        <div className="p-6 bg-[#F3F8FF] rounded-xl border border-[#DCE6F1] max-w-sm mx-auto mb-6">
          <div className="text-4xl font-extrabold text-[#174A8B] mb-1 font-mono">
            {percentage}%
          </div>
          <div className="text-xs font-medium text-[#617187] mb-3">
            {correctCount} dari {total} Soal Terjawab Benar
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}
          >
            {category}
          </span>
        </div>

        {/* Review list */}
        <div className="text-left mb-8">
          <h3 className="text-xs font-bold text-[#174A8B] uppercase tracking-wider mb-3">
            Tinjauan Konsep Soal:
          </h3>
          <div className="space-y-2">
            {questions.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correctAnswerIndex;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    isCorrect
                      ? "bg-green-50/50 border-green-200"
                      : "bg-red-50/50 border-red-200"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-[#23845B] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#C43D4B] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold text-[#172B45]">
                      Soal {idx + 1}: {q.conceptTag}
                    </span>
                    <p className="text-[#617187] mt-0.5 text-[11px]">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DCE6F1] text-xs font-semibold text-[#174A8B] bg-white hover:bg-[#F3F8FF] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Kuis
          </button>
          <Link
            href={`/topics/${topic.slug}/lab`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2583E8] hover:bg-[#1f6fc7] transition-all"
          >
            <FlaskConical className="w-4 h-4" />
            Eksplorasi Lab Ulang
          </Link>
          <Link
            href={`/topics/${topic.slug}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DCE6F1] text-xs font-semibold text-[#617187] bg-white hover:bg-slate-50"
          >
            <BookOpen className="w-4 h-4" />
            Tinjau Materi
          </Link>
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#174A8B] hover:underline"
          >
            Katalog Tema
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-6 md:p-8">
      {/* Quiz Header & Progress Bar */}
      <div className="mb-6 pb-4 border-b border-[#DCE6F1]">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-[#174A8B]">{topic.title}</span>
          <span className="text-[#617187]">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2583E8] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Concept Badge */}
      <div className="mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#174A8B] bg-[#DDF0FF] px-2.5 py-1 rounded-md">
          {currentQ.conceptTag}
        </span>
      </div>

      {/* Question Prompt */}
      <h3 className="text-base md:text-lg font-bold text-[#172B45] leading-relaxed mb-6">
        {currentQ.question}
      </h3>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedAnswers[currentIndex] === idx;
          const isCorrect = idx === currentQ.correctAnswerIndex;

          let btnStyle = "border-[#DCE6F1] bg-white text-[#172B45] hover:bg-[#F3F8FF]";
          if (isConfirmed) {
            if (isCorrect) {
              btnStyle = "border-[#23845B] bg-[#23845B]/10 text-[#23845B] font-semibold";
            } else if (isSelected && !isCorrect) {
              btnStyle = "border-[#C43D4B] bg-red-50 text-[#C43D4B] font-semibold";
            } else {
              btnStyle = "border-[#E2E8F0] opacity-50 text-[#64748B]";
            }
          } else if (isSelected) {
            btnStyle = "border-[#2583E8] bg-[#DDF0FF] text-[#174A8B] font-semibold ring-2 ring-[#2583E8]";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isConfirmed}
              className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-mono text-xs shrink-0 font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
              {isConfirmed && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-[#23845B] shrink-0 ml-2" />
              )}
              {isConfirmed && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-[#C43D4B] shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner (Appears after confirmation) */}
      {isConfirmed && (
        <div
          className={`p-4 rounded-xl mb-6 border text-xs leading-relaxed ${
            selectedAnswers[currentIndex] === currentQ.correctAnswerIndex
              ? "bg-green-50 border-green-200 text-[#172B45]"
              : "bg-amber-50 border-amber-200 text-[#172B45]"
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
            {selectedAnswers[currentIndex] === currentQ.correctAnswerIndex ? (
              <span className="text-[#23845B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Jawaban Tepat!
              </span>
            ) : (
              <span className="text-[#A96508] flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Pembahasan Konsep
              </span>
            )}
          </div>
          <p className="text-[#617187] text-xs">{currentQ.explanation}</p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#DCE6F1]">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#617187] hover:text-[#172B45] disabled:opacity-30 disabled:hover:text-[#617187]"
        >
          <ArrowLeft className="w-4 h-4" />
          Soal Sebelumnya
        </button>

        {!isConfirmed ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={!isAnswered}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2583E8] hover:bg-[#1f6fc7] disabled:opacity-40 transition-all shadow-xs"
          >
            Kunci Jawaban
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#174A8B] hover:bg-[#12396d] transition-all shadow-xs"
          >
            {currentIndex < questions.length - 1 ? (
              <>
                Lanjut ke Soal Berikutnya
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Lihat Ringkasan Nilai
                <Sparkles className="w-4 h-4 text-[#FFD45A]" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
