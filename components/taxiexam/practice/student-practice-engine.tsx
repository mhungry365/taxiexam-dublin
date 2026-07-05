"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LearningModuleData, LearningQuestion } from "@/lib/learning-module";

type Props = { moduleData: LearningModuleData };

function isCorrect(question: LearningQuestion, selected: number[]) {
  return selected.length === question.correctAnswers.length &&
    question.correctAnswers.every((answer) => selected.includes(answer));
}

function letters(question: LearningQuestion) {
  return question.correctAnswers.map((i) => String.fromCharCode(65 + i)).join(", ");
}

export function StudentPracticeEngine({ moduleData }: Props) {
  const lessons = moduleData.lessons.filter((lesson) => !lesson.isFinalTest);
  const [lessonId, setLessonId] = useState("all");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const questions = useMemo(() => {
    return lessonId === "all"
      ? moduleData.questions
      : moduleData.questions.filter((q) => q.lessonId === lessonId);
  }, [lessonId, moduleData.questions]);

  const question = questions[index];
  const selected = question ? answers[question.id] ?? [] : [];
  const done = question ? submitted[question.id] ?? false : false;

  const answered = questions.filter((q) => submitted[q.id]).length;
  const correct = questions.filter((q) => submitted[q.id] && isCorrect(q, answers[q.id] ?? [])).length;

  function choose(optionIndex: number) {
    if (!question || done) return;

    setAnswers((current) => {
      const selectedNow = current[question.id] ?? [];

      if (question.type === "single") {
        return { ...current, [question.id]: [optionIndex] };
      }

      return selectedNow.includes(optionIndex)
        ? { ...current, [question.id]: selectedNow.filter((item) => item !== optionIndex) }
        : { ...current, [question.id]: [...selectedNow, optionIndex].sort((a, b) => a - b) };
    });
  }

  function submit() {
    if (!question || selected.length === 0) return;
    setSubmitted((current) => ({ ...current, [question.id]: true }));
  }

  function next() {
    setIndex((current) => Math.min(current + 1, questions.length - 1));
  }

  function changeLesson(nextLessonId: string) {
    setLessonId(nextLessonId);
    setIndex(0);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="grid gap-5">
        <Card className="p-5">
          <p className="text-sm font-bold text-muted-foreground">Practice mode</p>
          <h2 className="mt-1 text-3xl font-black text-navy">{moduleData.eyebrow.replace(" module", "")}</h2>
          <p className="mt-3 text-muted-foreground">
            {answered}/{questions.length} answered · {correct} correct
          </p>
        </Card>

        <Card className="p-5">
          <p className="font-black text-navy">Lessons</p>
          <div className="mt-4 grid gap-2">
            <button onClick={() => changeLesson("all")} className={cn("rounded-lg border p-3 text-left font-bold", lessonId === "all" && "border-teal bg-teal/5")}>
              All questions <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs">{moduleData.questions.length} Qs</span>
            </button>

            {lessons.map((lesson) => {
              const count = moduleData.questions.filter((q) => q.lessonId === lesson.id).length;
              return (
                <button key={lesson.id} onClick={() => changeLesson(lesson.id)} className={cn("rounded-lg border p-3 text-left font-bold", lessonId === lesson.id && "border-teal bg-teal/5")}>
                  {lesson.title} <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs">{count} Qs</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        {!question ? (
          <p>No questions found.</p>
        ) : (
          <>
            <p className="text-xs font-black uppercase tracking-wide text-teal">
              {question.id} · Question {index + 1} of {questions.length}
            </p>

            <h1 className="mt-3 text-2xl font-black leading-8 text-navy">{question.questionText}</h1>

            <div className="mt-6 grid gap-3">
              {question.options.map((option, optionIndex) => {
                const selectedOption = selected.includes(optionIndex);
                const correctOption = question.correctAnswers.includes(optionIndex);

                return (
                  <button
                    key={option}
                    onClick={() => choose(optionIndex)}
                    disabled={done}
                    className={cn(
                      "rounded-lg border bg-white p-4 text-left font-semibold hover:border-teal",
                      selectedOption && !done && "border-teal bg-teal/5",
                      done && correctOption && "border-teal bg-teal/10",
                      done && selectedOption && !correctOption && "border-red-400 bg-red-50"
                    )}
                  >
                    <span className="mr-3 font-black">{String.fromCharCode(65 + optionIndex)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {!done ? (
              <div className="mt-6">
                <Button onClick={submit} disabled={selected.length === 0}>Submit answer</Button>
                <p className="mt-2 text-sm text-muted-foreground">Correct answer is hidden until you submit.</p>
              </div>
            ) : (
              <div className={cn("mt-6 rounded-lg p-5", isCorrect(question, selected) ? "bg-green-50" : "bg-red-50")}>
                <p className="font-black">{isCorrect(question, selected) ? "Correct" : "Incorrect"}</p>
                <p className="mt-2 text-sm"><strong>Correct answer:</strong> {letters(question)}</p>
                <p className="mt-2 text-sm">{question.explanation}</p>
                <Button className="mt-5" onClick={next} disabled={index >= questions.length - 1}>Next question</Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
