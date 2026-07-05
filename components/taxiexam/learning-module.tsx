"use client";

import { useMemo, useState } from "react";
import { AlertCircle, BookOpenCheck, CheckCircle2, Layers3, RotateCcw, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getLessonScore,
  getQuestionsForLesson,
  getWeakTopics,
  isQuestionCorrect,
  type LearningModuleData,
  type LearningQuestion
} from "@/lib/learning-module";

type Props = {
  moduleData: LearningModuleData;
};

export function LearningModule({ moduleData }: Props) {
  const [activeLessonId, setActiveLessonId] = useState(moduleData.lessons[0]?.id ?? "");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});

  const activeLesson = moduleData.lessons.find((lesson) => lesson.id === activeLessonId) ?? moduleData.lessons[0];
  const activeQuestions = getQuestionsForLesson(moduleData, activeLesson.id);
  const currentQuestion = activeQuestions[questionIndex];
  const lessonScore = getLessonScore(answers, activeQuestions);
  const answeredCount = Object.keys(answers).filter((questionId) =>
    activeQuestions.some((question) => question.id === questionId)
  ).length;

  const weakTopics = useMemo(() => getWeakTopics(moduleData, answers), [answers, moduleData]);

  const wrongQuestions = useMemo(
    () =>
      moduleData.questions.filter((question) => {
        const selected = answers[question.id] ?? [];
        return selected.length > 0 && !isQuestionCorrect(question, selected);
      }),
    [answers, moduleData.questions]
  );

  function selectLesson(lessonId: string) {
    setActiveLessonId(lessonId);
    setQuestionIndex(0);
  }

  function toggleAnswer(question: LearningQuestion, optionIndex: number) {
    setAnswers((current) => {
      const selected = current[question.id] ?? [];
      if (question.type === "single") return { ...current, [question.id]: [optionIndex] };

      return selected.includes(optionIndex)
        ? { ...current, [question.id]: selected.filter((item) => item !== optionIndex) }
        : { ...current, [question.id]: [...selected, optionIndex].sort((a, b) => a - b) };
    });
  }

  function resetActiveLesson() {
    const activeIds = new Set(activeQuestions.map((question) => question.id));
    setAnswers((current) =>
      Object.fromEntries(Object.entries(current).filter(([questionId]) => !activeIds.has(questionId)))
    );
    setQuestionIndex(0);
  }

  function openQuestion(question: LearningQuestion) {
    setActiveLessonId(question.lessonId);
    const lessonQuestions = getQuestionsForLesson(moduleData, question.lessonId);
    setQuestionIndex(Math.max(lessonQuestions.findIndex((item) => item.id === question.id), 0));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Layers3 className="text-teal" />
            <div>
              <p className="text-sm font-bold text-muted-foreground">Loaded questions</p>
              <p className="text-2xl font-black text-navy">
                {moduleData.questions.length}/{moduleData.targetQuestionCount}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-3">
          {moduleData.lessons.map((lesson) => {
            const questions = getQuestionsForLesson(moduleData, lesson.id);
            const score = getLessonScore(answers, questions);
            const isActive = lesson.id === activeLesson.id;

            return (
              <button
                key={lesson.id}
                onClick={() => selectLesson(lesson.id)}
                className={cn(
                  "rounded-lg border bg-white p-4 text-left transition hover:border-teal",
                  isActive && "border-teal ring-2 ring-teal/20"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-navy">{lesson.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{questions.length} questions</p>
                  </div>
                  <p className="rounded-md bg-muted px-2 py-1 text-xs font-bold">{score.percent}%</p>
                </div>
              </button>
            );
          })}
        </div>

        <Card className="p-5">
          <p className="font-black text-navy">Weak topics</p>
          {weakTopics.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {weakTopics.slice(0, 8).map((tag) => (
                <span key={tag} className="rounded-md bg-cream px-2 py-1 text-xs font-bold">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Answer questions to reveal weak topics.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-5">
        <Card className="p-6">
          <p className="font-bold text-teal">{moduleData.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black text-navy">{activeLesson.title}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{activeLesson.intro}</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-cream p-4">
              <p className="font-black text-navy">Memory trick</p>
              <p className="mt-2 text-sm leading-6">{activeLesson.memoryTrick}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="font-black text-navy">Common mistakes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {activeLesson.commonMistakes.map((mistake) => (
                  <li key={mistake}>{mistake}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="font-black text-navy">
                Question {activeQuestions.length ? questionIndex + 1 : 0} of {activeQuestions.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Answered {answeredCount}/{activeQuestions.length} · Score {lessonScore.correct}/{lessonScore.total}
              </p>
            </div>
            <Button variant="outline" onClick={resetActiveLesson}>
              <RotateCcw className="mr-2 size-4" />
              Reset lesson
            </Button>
          </div>

          {!currentQuestion ? (
            <div className="mt-6 rounded-lg border border-dashed p-6 text-center">
              <BookOpenCheck className="mx-auto text-muted-foreground" />
              <p className="mt-3 font-bold text-navy">No questions loaded for this lesson yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">Add original questions to the module data.</p>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-xl font-black leading-8 text-navy">{currentQuestion.questionText}</p>
              <div className="mt-5 grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  const selected = answers[currentQuestion.id]?.includes(index) ?? false;
                  return (
                    <button
                      key={option}
                      onClick={() => toggleAnswer(currentQuestion, index)}
                      className={cn(
                        "flex min-h-14 items-center gap-3 rounded-lg border bg-white p-4 text-left font-semibold transition hover:border-teal",
                        selected && "border-teal bg-teal/5"
                      )}
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-black">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {answers[currentQuestion.id]?.length ? (
                <div
                  className={cn(
                    "mt-5 rounded-lg p-4",
                    isQuestionCorrect(currentQuestion, answers[currentQuestion.id])
                      ? "bg-green-50"
                      : "bg-red-50"
                  )}
                >
                  <div className="flex items-center gap-2 font-black">
                    {isQuestionCorrect(currentQuestion, answers[currentQuestion.id]) ? (
                      <CheckCircle2 className="text-green-700" />
                    ) : (
                      <XCircle className="text-red-700" />
                    )}
                    {isQuestionCorrect(currentQuestion, answers[currentQuestion.id]) ? "Correct" : "Review this"}
                  </div>
                  <p className="mt-2 text-sm leading-6">{currentQuestion.explanation}</p>
                  <p className="mt-2 text-sm">
                    <strong>Memory tip:</strong> {currentQuestion.memoryTip}
                  </p>
                  <p className="mt-1 text-sm">
                    <strong>Common mistake:</strong> {currentQuestion.commonMistake}
                  </p>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => setQuestionIndex((current) => Math.min(current + 1, activeQuestions.length - 1))}
                  disabled={questionIndex >= activeQuestions.length - 1}
                >
                  Next question
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setQuestionIndex((current) => Math.max(current - 1, 0))}
                  disabled={questionIndex === 0}
                >
                  Previous
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-coral" />
            <div>
              <p className="font-black text-navy">Wrong-answer review</p>
              <p className="text-sm text-muted-foreground">{wrongQuestions.length} questions need review.</p>
            </div>
          </div>

          {wrongQuestions.length ? (
            <div className="mt-4 grid gap-2">
              {wrongQuestions.slice(0, 6).map((question) => (
                <button
                  key={question.id}
                  onClick={() => openQuestion(question)}
                  className="rounded-lg border bg-white p-3 text-left text-sm font-semibold hover:border-teal"
                >
                  {question.questionText}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
              <AlertCircle className="size-4" />
              Wrong answers will appear here.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
