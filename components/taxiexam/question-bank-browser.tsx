"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { BookOpenCheck, Search, Tag, Layers3, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAllQuestions, getQuestionStats, questionBankModules } from "@/lib/question-bank";

type Props = {
  initialModuleId?: string;
};

export function QuestionBankBrowser({ initialModuleId }: Props) {
  const [activeModuleId, setActiveModuleId] = useState(initialModuleId ?? "all");
  const [activeLessonId, setActiveLessonId] = useState("all");
  const [query, setQuery] = useState("");

  const globalStats = getQuestionStats();
  const allQuestions = getAllQuestions();
  const activeModule = questionBankModules.find((moduleItem) => moduleItem.id === activeModuleId);

  const stats =
    activeModuleId === "all" || !activeModule
      ? globalStats
      : {
          totalQuestions: activeModule.questions.length,
          totalModules: 1,
          byModule: [
            {
              id: activeModule.id,
              title: activeModule.eyebrow.replace(" module", ""),
              count: activeModule.questions.length,
              target: activeModule.targetQuestionCount,
              lessons: activeModule.lessons.filter((lesson) => !lesson.isFinalTest).length
            }
          ]
        };

  const lessons = activeModule?.lessons.filter((lesson) => !lesson.isFinalTest) ?? [];

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((question) => {
      const moduleMatch = activeModuleId === "all" || question.module === activeModuleId;
      const lessonMatch = activeLessonId === "all" || question.lessonId === activeLessonId;
      const text = `${question.id} ${question.questionText} ${question.options.join(" ")} ${question.tags.join(" ")}`.toLowerCase();
      const searchMatch = !query.trim() || text.includes(query.trim().toLowerCase());

      return moduleMatch && lessonMatch && searchMatch;
    });
  }, [activeModuleId, activeLessonId, allQuestions, query]);

  function selectModule(moduleId: string) {
    setActiveModuleId(moduleId);
    setActiveLessonId("all");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="text-teal" />
            <div>
              <p className="text-sm font-bold text-muted-foreground">Question database</p>
              <p className="text-3xl font-black text-navy">{stats.totalQuestions} questions</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <p className="font-black text-navy">{stats.totalModules}</p>
              <p className="text-muted-foreground">modules</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="font-black text-navy">
                {stats.byModule.reduce((total, item) => total + item.lessons, 0)}
              </p>
              <p className="text-muted-foreground">lessons</p>
            </div>
          </div>

          {activeModule ? (
            <Link
              href={`/practice/${activeModule.id}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-3 text-sm font-black text-white"
            >
              <PlayCircle className="size-4" />
              Start practice
            </Link>
          ) : (
            <Link
              href="/practice"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-3 text-sm font-black text-white"
            >
              <PlayCircle className="size-4" />
              Choose practice category
            </Link>
          )}
        </Card>

        <Card className="p-5">
          <p className="font-black text-navy">Categories</p>
          <div className="mt-4 grid gap-3">
            <button
              onClick={() => selectModule("all")}
              className={cn(
                "rounded-lg border bg-white p-4 text-left hover:border-teal",
                activeModuleId === "all" && "border-teal bg-teal/5"
              )}
            >
              <p className="font-black text-navy">All categories</p>
              <p className="text-sm text-muted-foreground">{globalStats.totalQuestions} questions</p>
            </button>

            {globalStats.byModule.map((moduleItem) => (
              <button
                key={moduleItem.id}
                onClick={() => selectModule(moduleItem.id)}
                className={cn(
                  "rounded-lg border bg-white p-4 text-left hover:border-teal",
                  activeModuleId === moduleItem.id && "border-teal bg-teal/5"
                )}
              >
                <p className="font-black text-navy">{moduleItem.title}</p>
                <p className="text-sm text-muted-foreground">
                  {moduleItem.count}/{moduleItem.target} questions · {moduleItem.lessons} lessons
                </p>
              </button>
            ))}
          </div>
        </Card>

        {activeModule ? (
          <Card className="p-5">
            <p className="font-black text-navy">Lessons</p>
            <div className="mt-4 grid gap-2">
              <button
                onClick={() => setActiveLessonId("all")}
                className={cn(
                  "rounded-lg border bg-white p-3 text-left text-sm font-bold hover:border-teal",
                  activeLessonId === "all" && "border-teal bg-teal/5"
                )}
              >
                All lessons
              </button>

              {lessons.map((lesson) => {
                const count = activeModule.questions.filter((question) => question.lessonId === lesson.id).length;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={cn(
                      "rounded-lg border bg-white p-3 text-left text-sm font-bold hover:border-teal",
                      activeLessonId === lesson.id && "border-teal bg-teal/5"
                    )}
                  >
                    {lesson.title}
                    <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs">{count} Qs</span>
                  </button>
                );
              })}
            </div>
          </Card>
        ) : null}
      </div>

      <div className="grid gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Search className="text-teal" />
            <div>
              <p className="font-black text-navy">Search questions</p>
              <p className="text-sm text-muted-foreground">
                Showing {filteredQuestions.length} of {activeModule ? activeModule.questions.length : allQuestions.length}
              </p>
            </div>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tariff, licence, receipt, toll..."
            className="mt-4 w-full rounded-lg border px-4 py-3 outline-none focus:border-teal"
          />
        </Card>

        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="p-5">
              <p className="text-xs font-black uppercase tracking-wide text-teal">
                {question.id} · {question.moduleTitle} · {question.lessonTitle}
              </p>

              <h3 className="mt-2 text-xl font-black leading-7 text-navy">{question.questionText}</h3>


              {question.questionImage ? (
                <Image
                  src={question.questionImage}
                  alt={`${question.id} map or reference image`}
                  width={900}
                  height={650}
                  className="mt-4 h-auto w-full rounded-xl border object-contain"
                />
              ) : null}

              <div className="mt-4 grid gap-2">
                {question.options.map((option, index) => (
                  <div
                    key={`${question.id}-${index}`}
                    className="rounded-lg border bg-white p-3 text-sm font-semibold"
                  >
                    <span className="mr-2 font-black">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-bold">
                    <Tag className="size-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 rounded-lg bg-cream p-3 text-sm font-semibold text-muted-foreground">
                Answers are hidden here. Use Practice Mode to answer first and reveal feedback after submitting.
              </p>
            </Card>
          ))}

          {!filteredQuestions.length ? (
            <Card className="p-8 text-center">
              <Layers3 className="mx-auto text-muted-foreground" />
              <p className="mt-3 font-black text-navy">No questions found.</p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
