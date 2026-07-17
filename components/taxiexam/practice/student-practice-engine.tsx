"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  LearningModuleData,
  LearningQuestion
} from "@/lib/learning-module";

type PracticeLength = 15 | 25 | "all";

type Props = {
  moduleData: LearningModuleData;
  practiceLength: PracticeLength;
  randomize?: boolean;
};

function shuffleQuestions<T>(items: T[]): T[] {
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

function createQuestionSet(
  questions: LearningQuestion[],
  practiceLength: PracticeLength,
  randomize: boolean
) {
  const preparedQuestions = randomize
    ? shuffleQuestions(questions)
    : [...questions];

  if (practiceLength === "all") {
    return preparedQuestions;
  }

  return preparedQuestions.slice(
    0,
    Math.min(practiceLength, preparedQuestions.length)
  );
}

function answerIsCorrect(
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

function getCorrectAnswerLetters(question: LearningQuestion) {
  return question.correctAnswers
    .map((answer) => String.fromCharCode(65 + answer))
    .join(", ");
}

export function StudentPracticeEngine({
  moduleData,
  practiceLength,
  randomize = true
}: Props) {
  const [sessionNumber, setSessionNumber] = useState(1);

  const questions = useMemo(
    () =>
      createQuestionSet(
        moduleData.questions,
        practiceLength,
        randomize
      ),
    [
      moduleData.questions,
      practiceLength,
      randomize,
      sessionNumber
    ]
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Record<string, boolean>
  >({});

  const currentQuestion = questions[questionIndex];

  const selectedAnswers = currentQuestion
    ? answers[currentQuestion.id] ?? []
    : [];

  const answerSubmitted = currentQuestion
    ? submittedAnswers[currentQuestion.id] ?? false
    : false;

  const answeredCount = questions.filter(
    (question) => submittedAnswers[question.id]
  ).length;

  const correctCount = questions.filter(
    (question) =>
      submittedAnswers[question.id] &&
      answerIsCorrect(question, answers[question.id] ?? [])
  ).length;

  const score = answeredCount
    ? Math.round((correctCount / answeredCount) * 100)
    : 0;

  function chooseAnswer(optionIndex: number) {
    if (!currentQuestion || answerSubmitted) {
      return;
    }

    setAnswers((current) => {
      if (currentQuestion.type === "single") {
        return {
          ...current,
          [currentQuestion.id]: [optionIndex]
        };
      }

      const currentAnswers = current[currentQuestion.id] ?? [];

      const nextAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter((answer) => answer !== optionIndex)
        : [...currentAnswers, optionIndex].sort(
            (first, second) => first - second
          );

      return {
        ...current,
        [currentQuestion.id]: nextAnswers
      };
    });
  }

  function submitAnswer() {
    if (!currentQuestion || selectedAnswers.length === 0) {
      return;
    }

    setSubmittedAnswers((current) => ({
      ...current,
      [currentQuestion.id]: true
    }));
  }

  function nextQuestion() {
    setQuestionIndex((current) =>
      Math.min(current + 1, questions.length - 1)
    );
  }

  function previousQuestion() {
    setQuestionIndex((current) => Math.max(current - 1, 0));
  }

  function restartWithNewQuestions() {
    setAnswers({});
    setSubmittedAnswers({});
    setQuestionIndex(0);
    setSessionNumber((current) => current + 1);
  }

  if (!currentQuestion) {
    return (
      <Card className="p-8 text-center">
        <p className="font-black text-navy">
          No questions were found in this category.
        </p>
      </Card>
    );
  }

  const currentAnswerIsCorrect = answerIsCorrect(
    currentQuestion,
    selectedAnswers
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="grid content-start gap-5">
        <Card className="p-5">
          <p className="text-sm font-bold text-teal">Practice session</p>

          <h2 className="mt-2 text-2xl font-black text-navy">
            {moduleData.eyebrow.replace(" module", "")}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {practiceLength === "all"
              ? "Long set"
              : practiceLength === 25
                ? "Medium set"
                : "Short set"}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xl font-black text-navy">
                {questions.length}
              </p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xl font-black text-navy">
                {answeredCount}
              </p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xl font-black text-navy">{score}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-teal transition-all"
              style={{
                width: `${Math.round(
                  (answeredCount / questions.length) * 100
                )}%`
              }}
            />
          </div>
        </Card>

        <Card className="p-5">
          <p className="font-black text-navy">Session progress</p>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const submitted = submittedAnswers[question.id];
              const correct =
                submitted &&
                answerIsCorrect(
                  question,
                  answers[question.id] ?? []
                );

              return (
                <button
                  key={question.id}
                  onClick={() => setQuestionIndex(index)}
                  className={cn(
                    "rounded-lg border p-2 text-sm font-black",
                    index === questionIndex &&
                      "border-teal ring-2 ring-teal/20",
                    submitted &&
                      correct &&
                      "border-green-500 bg-green-50",
                    submitted &&
                      !correct &&
                      "border-red-400 bg-red-50"
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </Card>

        <Button variant="outline" onClick={restartWithNewQuestions}>
          <RotateCcw className="mr-2 size-4" />
          Generate new random set
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-teal">
              Question {questionIndex + 1} of {questions.length}
            </p>

            <h1 className="mt-3 text-2xl font-black leading-8 text-navy">
              {currentQuestion.questionText}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {currentQuestion.type === "multiple"
                ? "Select all correct answers."
                : "Select one answer."}
            </p>
          </div>

          <div className="h-fit rounded-lg bg-muted px-3 py-2 text-sm font-black">
            {correctCount}/{answeredCount} correct
          </div>
        </div>

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
          {currentQuestion.options.map((option, optionIndex) => {
            const selected = selectedAnswers.includes(optionIndex);
            const correct =
              currentQuestion.correctAnswers.includes(optionIndex);

            return (
              <button
                key={`${currentQuestion.id}-${optionIndex}`}
                onClick={() => chooseAnswer(optionIndex)}
                disabled={answerSubmitted}
                className={cn(
                  "rounded-xl border bg-white p-4 text-left font-semibold transition hover:border-teal",
                  selected &&
                    !answerSubmitted &&
                    "border-teal bg-teal/5",
                  answerSubmitted &&
                    correct &&
                    "border-green-500 bg-green-50",
                  answerSubmitted &&
                    selected &&
                    !correct &&
                    "border-red-500 bg-red-50"
                )}
              >
                <span className="mr-3 font-black">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>

                {option}
              </button>
            );
          })}
        </div>

        {!answerSubmitted ? (
          <div className="mt-6">
            <Button
              onClick={submitAnswer}
              disabled={selectedAnswers.length === 0}
            >
              Submit answer
            </Button>

            <p className="mt-2 text-sm text-muted-foreground">
              The correct answer remains hidden until you submit.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "mt-6 rounded-xl border p-5",
              currentAnswerIsCorrect
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            )}
          >
            <div className="flex items-center gap-2 font-black text-navy">
              {currentAnswerIsCorrect ? (
                <CheckCircle2 className="text-green-700" />
              ) : (
                <XCircle className="text-red-700" />
              )}

              {currentAnswerIsCorrect ? "Correct" : "Incorrect"}
            </div>

            <p className="mt-3 text-sm leading-6">
              <strong>Correct answer:</strong>{" "}
              {getCorrectAnswerLetters(currentQuestion)}
            </p>

            
          </div>
        )}

        <div className="mt-6 flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={questionIndex === 0}
          ><div className="mt-4 space-y-4">

  {currentQuestion.explanation && (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
      <h3 className="font-bold text-green-800">
        ✅ Why is this the correct answer?
      </h3>

      <p className="mt-2 leading-7">
        {currentQuestion.explanation}
      </p>
    </div>
  )}

  {currentQuestion.memoryTip && (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <h3 className="font-bold text-blue-800">
        🧠 Memory Pattern
      </h3>

      <p className="mt-2 leading-7">
        {currentQuestion.memoryTip}
      </p>
    </div>
  )}

</div>
            Previous
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={
              !answerSubmitted ||
              questionIndex === questions.length - 1
            }
          >
            Next question
          </Button>
        </div>
      </Card>
    </div>
  );
}
