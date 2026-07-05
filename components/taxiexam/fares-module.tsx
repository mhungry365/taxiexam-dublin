"use client";

import { useMemo, useState } from "react";
import { AlertCircle, BookOpenCheck, CheckCircle2, Layers3, RotateCcw, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  faresLessons,
  faresQuestions,
  faresQuestionTargetCount,
  getFaresLessonScore,
  getFaresQuestionsForLesson,
  getWeakFaresTopics,
  type FaresLessonId,
  type FaresQuestion
} from "@/lib/fares-module";

function isCorrect(question: FaresQuestion, selected: number[]) {
  return (
    selected.length === question.correctAnswers.length &&
    question.correctAnswers.every((answer) => selected.includes(answer))
  );
}

export function FaresModule() {
  const [activeLessonId, setActiveLessonId] = useState<FaresLessonId>("fare-basics");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const activeLesson = faresLessons.find((lesson) => lesson.id === activeLessonId) ?? faresLessons[0];
  const activeQuestions = getFaresQuestionsForLesson(activeLesson.id);
  const currentQuestion = activeQuestions[questionIndex];
  const lessonScore = getFaresLessonScore(answers, activeQuestions);
  const answeredCount = Object.keys(answers).filter((questionId) =>
    activeQuestions.some((question) => question.id === questionId)
  ).length;
  const weakTopics = useMemo(() => getWeakFaresTopics(answers), [answers]);
  const wrongQuestions = useMemo(
    () =>
      faresQuestions.filter((question) => {
        const selected = answers[question.id] ?? [];
        return selected.length > 0 && !isCorrect(question, selected);
      }),
    [answers]
  );

  function selectLesson(lessonId: FaresLessonId) {
    setActiveLessonId(lessonId);
    setQuestionIndex(0);
  }

  function toggleAnswer(question: FaresQuestion, optionIndex: number) {
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

  function openQuestion(question: FaresQuestion) {
    setActiveLessonId(question.lessonId);
    const lessonQuestions = getFaresQuestionsForLesson(question.lessonId);
    setQuestionIndex(Math.max(lessonQuestions.findIndex((item) => item.id === question.id), 0));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Layers3 className="text-teal" aria-hidden />
            <div>
              <p className="text-sm font-bold text-teal">Structured module</p>
              <h2 className="text-2xl font-black text-navy">Fares lessons</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {faresLessons.map((lesson) => {
              const lessonQuestions = getFaresQuestionsForLesson(lesson.id);
              const score = getFaresLessonScore(answers, lessonQuestions);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => selectLesson(lesson.id)}
                  className={cn(
                    "rounded-lg border border-border bg-white p-4 text-left transition hover:border-teal",
                    activeLesson.id === lesson.id && "border-teal bg-teal/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black text-navy">{lesson.title}</span>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold text-navy">
                      {score.total ? `${score.percent}%` : "0 Qs"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.intro}</p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Trophy className="text-coral" aria-hidden />
            <h2 className="text-2xl font-black text-navy">Progress</h2>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-teal"
              style={{ width: `${Math.round((faresQuestions.length / faresQuestionTargetCount) * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {faresQuestions.length} of {faresQuestionTargetCount} Fares questions loaded.
          </p>
          <div className="mt-5">
            <p className="font-black text-navy">Weak topics</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(weakTopics.length ? weakTopics : ["No weak topics yet"]).map((topic) => (
                <span key={topic} className="rounded-md bg-cream px-3 py-2 text-sm font-bold text-navy">{topic}</span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="font-black text-navy">Wrong-answer review</p>
          {wrongQuestions.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Missed questions will appear here after a mini quiz or final mixed test.</p>
          ) : (
            <div className="mt-4 grid gap-2">
              {wrongQuestions.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => openQuestion(question)}
                  className="rounded-lg border border-border bg-white p-3 text-left text-sm font-semibold text-navy transition hover:border-coral"
                >
                  Q{question.questionNumber}: {question.questionText}
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-5">
        <Card className="p-6 shadow-soft">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="font-bold text-teal">{activeLesson.title}</p>
              <h1 className="mt-2 text-3xl font-black text-navy">
                {activeLesson.id === "final-mixed-fares-test" ? "Final mixed Fares test" : "Study, then take the mini quiz"}
              </h1>
            </div>
            <div className="rounded-md bg-muted px-4 py-3 text-sm font-bold text-navy">
              {lessonScore.correct}/{lessonScore.total} correct
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-snow p-4">
              <BookOpenCheck className="text-teal" aria-hidden />
              <p className="mt-3 font-black text-navy">Intro</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeLesson.intro}</p>
            </div>
            <div className="rounded-lg bg-cream p-4">
              <CheckCircle2 className="text-teal" aria-hidden />
              <p className="mt-3 font-black text-navy">Memory trick</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeLesson.memoryTrick}</p>
            </div>
            <div className="rounded-lg bg-coral/10 p-4">
              <AlertCircle className="text-coral" aria-hidden />
              <p className="mt-3 font-black text-navy">Common mistakes</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeLesson.commonMistakes.join(" ")}</p>
            </div>
          </div>
        </Card>

        {!currentQuestion ? (
          <Card className="p-6">
            <p className="font-black text-navy">No original questions assigned yet</p>
            <p className="mt-3 leading-7 text-muted-foreground">
              This lesson is ready for the original FREE_NOW questions. Add them to `faresQuestions` with the exact wording, answer options, correct answers, and question order.
            </p>
          </Card>
        ) : (
          <QuestionCard
            question={currentQuestion}
            selected={answers[currentQuestion.id] ?? []}
            questionIndex={questionIndex}
            questionTotal={activeQuestions.length}
            answeredCount={answeredCount}
            onToggle={toggleAnswer}
            onNext={() => setQuestionIndex((current) => Math.min(current + 1, activeQuestions.length - 1))}
            onPrevious={() => setQuestionIndex((current) => Math.max(current - 1, 0))}
            onReset={resetActiveLesson}
          />
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  selected,
  questionIndex,
  questionTotal,
  answeredCount,
  onToggle,
  onNext,
  onPrevious,
  onReset
}: {
  question: FaresQuestion;
  selected: number[];
  questionIndex: number;
  questionTotal: number;
  answeredCount: number;
  onToggle: (question: FaresQuestion, optionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
}) {
  const answered = selected.length > 0;
  const correct = isCorrect(question, selected);

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-teal">
            Question {question.questionNumber} - {question.type === "multiple" ? "multiple choice" : "single choice"}
          </p>
          <h2 className="mt-2 text-3xl font-black text-navy">{question.questionText}</h2>
        </div>
        <div className="rounded-md bg-muted px-4 py-3 text-sm font-bold text-navy">
          {questionIndex + 1}/{questionTotal} - {answeredCount} answered
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {question.options.map((option, optionIndex) => {
          const optionSelected = selected.includes(optionIndex);
          const optionCorrect = question.correctAnswers.includes(optionIndex);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(question, optionIndex)}
              className={cn(
                "flex min-h-14 w-full items-center justify-between rounded-lg border border-border bg-white p-4 text-left font-semibold transition hover:border-teal",
                answered && optionCorrect && "border-teal bg-teal/10",
                answered && optionSelected && !optionCorrect && "border-coral bg-coral/10"
              )}
            >
              <span>{option}</span>
              {answered && optionCorrect && <CheckCircle2 className="text-teal" size={20} aria-hidden />}
              {answered && optionSelected && !optionCorrect && <XCircle className="text-coral" size={20} aria-hidden />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-cream p-4">
            <p className="font-black text-navy">{correct ? "Correct" : "Review this one"}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{question.explanation}</p>
          </div>
          <div className="rounded-lg bg-snow p-4">
            <p className="font-black text-navy">Memory tip</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{question.memoryTip}</p>
          </div>
          <div className="rounded-lg bg-coral/10 p-4">
            <p className="font-black text-navy">Common mistake</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{question.commonMistake}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onPrevious} disabled={questionIndex === 0} variant="outline">Previous</Button>
        <Button onClick={onNext} disabled={questionIndex === questionTotal - 1}>Next question</Button>
        <Button onClick={onReset} variant="outline"><RotateCcw size={16} aria-hidden /> Reset lesson</Button>
      </div>
    </Card>
  );
}
