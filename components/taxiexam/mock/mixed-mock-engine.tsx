"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Flag,
  RotateCcw,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { questionBankModules } from "@/lib/question-bank";
import type { LearningQuestion } from "@/lib/learning-module";

type MockLength = 25 | 40 | 60 | "all";

type MixedQuestion = LearningQuestion & {
  categoryTitle: string;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [
      result[randomIndex],
      result[index]
    ];
  }

  return result;
}

function makeMixedMock(mockLength: MockLength) {
  const allQuestions: MixedQuestion[] =
    questionBankModules.flatMap((moduleItem) =>
      moduleItem.questions.map((question) => ({
        ...question,
        categoryTitle: moduleItem.eyebrow.replace(" module", "")
      }))
    );

  const mixed = shuffle(allQuestions);

  if (mockLength === "all") {
    return mixed;
  }

  return mixed.slice(0, Math.min(mockLength, mixed.length));
}

function isCorrect(
  question: LearningQuestion,
  selectedAnswers: number[]
) {
  return (
    selectedAnswers.length === question.correctAnswers.length &&
    question.correctAnswers.every((answer) =>
      selectedAnswers.includes(answer)
    )
  );
}

export function MixedMockEngine({
  mockLength
}: {
  mockLength: MockLength;
}) {
  const [attemptNumber, setAttemptNumber] = useState(1);

  const questions = useMemo(
    () => makeMixedMock(mockLength),
    [mockLength, attemptNumber]
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[questionIndex];
  const selectedAnswers = currentQuestion
    ? answers[currentQuestion.id] ?? []
    : [];

  const answeredCount = questions.filter(
    (question) => (answers[question.id] ?? []).length > 0
  ).length;

  const correctCount = finished
    ? questions.filter((question) =>
        isCorrect(question, answers[question.id] ?? [])
      ).length
    : 0;

  const score = finished
    ? Math.round((correctCount / questions.length) * 100)
    : 0;

  function chooseAnswer(optionIndex: number) {
    if (!currentQuestion || finished) {
      return;
    }

    setAnswers((current) => {
      if (currentQuestion.type === "single") {
        return {
          ...current,
          [currentQuestion.id]: [optionIndex]
        };
      }

      const existing = current[currentQuestion.id] ?? [];

      return {
        ...current,
        [currentQuestion.id]: existing.includes(optionIndex)
          ? existing.filter((answer) => answer !== optionIndex)
          : [...existing, optionIndex].sort(
              (first, second) => first - second
            )
      };
    });
  }

  function restartMock() {
    setAnswers({});
    setFlagged({});
    setFinished(false);
    setQuestionIndex(0);
    setAttemptNumber((current) => current + 1);
  }

  if (finished) {
    return (
      <div className="grid gap-6">
        <Card className="p-8 text-center">
          {score >= 75 ? (
            <CheckCircle2 className="mx-auto size-12 text-green-700" />
          ) : (
            <XCircle className="mx-auto size-12 text-red-700" />
          )}

          <p className="mt-5 text-sm font-black uppercase tracking-wide text-teal">
            Mock exam complete
          </p>

          <h2 className="mt-2 text-5xl font-black text-navy">
            {score}%
          </h2>

          <p className="mt-3 text-lg text-muted-foreground">
            {correctCount} correct out of {questions.length}
          </p>

          <Button className="mt-6" onClick={restartMock}>
            <RotateCcw className="mr-2 size-4" />
            Start a new random mock
          </Button>
        </Card>

        <div className="grid gap-4">
          {questions.map((question, index) => {
            const selected = answers[question.id] ?? [];
            const correct = isCorrect(question, selected);

            return (
              <Card key={question.id} className="p-5">
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="mt-1 shrink-0 text-green-700" />
                  ) : (
                    <XCircle className="mt-1 shrink-0 text-red-700" />
                  )}

                  <div>
                    <p className="text-xs font-black uppercase text-teal">
                      Question {index + 1} · {question.categoryTitle}
                    </p>

                    <p className="mt-2 font-black text-navy">
                      {question.questionText}
                    </p>

                    <p className="mt-3 text-sm">
                      <strong>Your answer:</strong>{" "}
                      {selected.length
                        ? selected
                            .map((answer) =>
                              String.fromCharCode(65 + answer)
                            )
                            .join(", ")
                        : "Not answered"}
                    </p>

                    <p className="mt-1 text-sm">
                      <strong>Correct answer:</strong>{" "}
                      {question.correctAnswers
                        .map((answer) =>
                          String.fromCharCode(65 + answer)
                        )
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="grid content-start gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="text-teal" />

            <div>
              <p className="text-sm font-bold text-muted-foreground">
                Mixed SPSV mock
              </p>

              <p className="text-2xl font-black text-navy">
                {questions.length} questions
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xl font-black text-navy">
                {answeredCount}
              </p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xl font-black text-navy">
                {
                  questions.filter(
                    (question) => flagged[question.id]
                  ).length
                }
              </p>
              <p className="text-xs text-muted-foreground">Flagged</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="font-black text-navy">Question navigator</p>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const answered =
                (answers[question.id] ?? []).length > 0;

              return (
                <button
                  key={`${question.id}-${index}`}
                  onClick={() => setQuestionIndex(index)}
                  className={cn(
                    "relative rounded-lg border p-2 text-sm font-black",
                    index === questionIndex &&
                      "border-teal ring-2 ring-teal/20",
                    answered && "bg-teal/10",
                    flagged[question.id] && "border-amber-500"
                  )}
                >
                  {index + 1}

                  {flagged[question.id] ? (
                    <span className="absolute -right-1 -top-1 size-2 rounded-full bg-amber-500" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-teal">
              {currentQuestion.categoryTitle}
            </p>

            <p className="mt-1 text-sm font-bold text-muted-foreground">
              Question {questionIndex + 1} of {questions.length}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setFlagged((current) => ({
                ...current,
                [currentQuestion.id]:
                  !current[currentQuestion.id]
              }))
            }
          >
            <Flag className="mr-2 size-4" />
            {flagged[currentQuestion.id] ? "Flagged" : "Flag"}
          </Button>
        </div>

        <h1 className="mt-5 text-2xl font-black leading-8 text-navy">
          {currentQuestion.questionText}
        </h1>

        {currentQuestion.questionImage ? (
          <Image
            src={currentQuestion.questionImage}
            alt={`${currentQuestion.id} question reference`}
            width={900}
            height={650}
            className="mt-5 h-auto w-full rounded-xl border object-contain"
          />
        ) : null}

        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={`${currentQuestion.id}-${optionIndex}`}
              onClick={() => chooseAnswer(optionIndex)}
              className={cn(
                "rounded-xl border bg-white p-4 text-left font-semibold hover:border-teal",
                selectedAnswers.includes(optionIndex) &&
                  "border-teal bg-teal/5"
              )}
            >
              <span className="mr-3 font-black">
                {String.fromCharCode(65 + optionIndex)}.
              </span>

              {option}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Answers and results remain hidden until the entire mock test is
          submitted.
        </p>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button
            variant="outline"
            onClick={() =>
              setQuestionIndex((current) =>
                Math.max(current - 1, 0)
              )
            }
            disabled={questionIndex === 0}
          >
            Previous
          </Button>

          {questionIndex < questions.length - 1 ? (
            <Button
              onClick={() =>
                setQuestionIndex((current) => current + 1)
              }
            >
              Next question
            </Button>
          ) : (
            <Button
              onClick={() => setFinished(true)}
              disabled={answeredCount === 0}
            >
              Submit mock exam
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
