"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { sampleQuestions } from "@/lib/taxipass-data";

type Question = (typeof sampleQuestions)[number];

export function QuizRunner({ title, questions = sampleQuestions }: { title: string; questions?: Question[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const question = questions[index];
  const score = useMemo(
    () => questions.filter((item) => answers[item.id] === item.correct).length,
    [answers, questions]
  );
  const answered = selected !== null;

  function choose(optionIndex: number) {
    setSelected(optionIndex);
    setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
  }

  function next() {
    setSelected(answers[questions[index + 1]?.id] ?? null);
    setIndex((current) => Math.min(current + 1, questions.length - 1));
  }

  function reset() {
    setIndex(0);
    setSelected(null);
    setAnswers({});
  }

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-teal">{title}</p>
          <h2 className="mt-2 text-3xl font-black text-navy">{question.question}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {question.module === "industry" ? "Industry Knowledge" : "Dublin Area Knowledge"} - {question.category} - {question.difficulty}
          </p>
        </div>
        <div className="rounded-md bg-muted px-4 py-3 text-sm font-bold text-navy">
          {index + 1}/{questions.length} - {score} correct
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correct;
          const isSelected = selected === optionIndex;
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(optionIndex)}
              className={cn(
                "flex min-h-14 w-full items-center justify-between rounded-lg border border-border bg-white p-4 text-left font-semibold transition hover:border-teal",
                answered && isCorrect && "border-teal bg-teal/10",
                answered && isSelected && !isCorrect && "border-coral bg-coral/10"
              )}
            >
              <span>{option}</span>
              {answered && isCorrect && <CheckCircle2 className="text-teal" size={20} aria-hidden />}
              {answered && isSelected && !isCorrect && <XCircle className="text-coral" size={20} aria-hidden />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6 rounded-lg bg-cream p-4">
          <p className="font-black text-navy">{selected === question.correct ? "Correct" : "Review this one"}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{question.explanation}</p>
          <p className="mt-2 text-xs font-semibold uppercase text-muted-foreground">{question.source}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={next} disabled={index === questions.length - 1 || !answered}>Next question</Button>
        <Button onClick={reset} variant="outline"><RotateCcw size={16} aria-hidden /> Reset</Button>
      </div>
    </Card>
  );
}
