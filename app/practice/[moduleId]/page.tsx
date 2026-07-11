import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  Brain,
  Clock3,
  Layers3,
  Lightbulb,
  ListChecks,
  PlayCircle
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { StudentPracticeEngine } from "@/components/taxiexam/practice/student-practice-engine";
import {
  getQuestionBankModule,
  questionBankModules
} from "@/lib/question-bank";
import type { LearningModuleData } from "@/lib/learning-module";

type PracticeSize = 15 | 25 | "all";

export function generateStaticParams() {
  return questionBankModules.map((moduleItem) => ({
    moduleId: moduleItem.id
  }));
}

function parsePracticeSize(
  value?: string
): PracticeSize | null {
  if (value === "15") return 15;
  if (value === "25") return 25;
  if (value === "all") return "all";

  return null;
}

export default async function PracticeModulePage({
  params,
  searchParams
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{
    size?: string;
    lesson?: string;
  }>;
}) {
  const { moduleId } = await params;
  const { size, lesson: lessonId } = await searchParams;

  const questionModule = getQuestionBankModule(moduleId);

  if (!questionModule) {
    notFound();
  }

  const learningLessons = questionModule.lessons.filter(
    (lesson) => !lesson.isFinalTest
  );

  const selectedLesson = lessonId
    ? learningLessons.find(
        (lesson) => lesson.id === lessonId
      )
    : undefined;

  /*
   * LESSON MODE
   *
   * Questions remain grouped by topic and keep their
   * original order. This is the main memorisation path.
   */
  if (lessonId) {
    if (!selectedLesson) {
      notFound();
    }

    const lessonQuestions =
      questionModule.questions.filter(
        (question) =>
          question.lessonId === selectedLesson.id
      );

    const lessonModule: LearningModuleData = {
      ...questionModule,
      title: selectedLesson.title,
      eyebrow: `${selectedLesson.title} lesson`,
      description: selectedLesson.intro,
      targetQuestionCount: lessonQuestions.length,
      lessons: [selectedLesson],
      questions: lessonQuestions
    };

    return (
      <section className="section bg-snow">
        <div className="container">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-bold text-teal">
                Lesson practice
              </p>

              <h1 className="mt-2 text-4xl font-black text-navy">
                {selectedLesson.title}
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                {selectedLesson.intro}
              </p>
            </div>

            <Link
              href={`/practice/${questionModule.id}`}
              className="font-black text-teal hover:underline"
            >
              Back to category
            </Link>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 shrink-0 text-teal" />

                <div>
                  <p className="font-black text-navy">
                    Memory trick
                  </p>

                  <p className="mt-2 leading-7 text-muted-foreground">
                    {selectedLesson.memoryTrick}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 shrink-0 text-amber-600" />

                <div>
                  <p className="font-black text-navy">
                    Common mistakes
                  </p>

                  <div className="mt-2 grid gap-2">
                    {selectedLesson.commonMistakes.map(
                      (mistake) => (
                        <p
                          key={mistake}
                          className="leading-6 text-muted-foreground"
                        >
                          • {mistake}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <StudentPracticeEngine
            moduleData={lessonModule}
            practiceLength="all"
            randomize={false}
          />
        </div>
      </section>
    );
  }

  const practiceSize = parsePracticeSize(size);

  /*
   * RANDOM SET MODE
   *
   * This is separate from lessons and is used for revision,
   * testing recall and exam preparation.
   */
  if (practiceSize) {
    return (
      <section className="section bg-snow">
        <div className="container">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-bold text-teal">
                Random category practice
              </p>

              <h1 className="mt-2 text-4xl font-black text-navy">
                {questionModule.eyebrow.replace(
                  " module",
                  ""
                )}
              </h1>

              <p className="mt-3 text-muted-foreground">
                Questions are randomly selected from all
                lessons in this category.
              </p>
            </div>

            <Link
              href={`/practice/${questionModule.id}`}
              className="font-black text-teal hover:underline"
            >
              Back to lessons and sets
            </Link>
          </div>

          <StudentPracticeEngine
            moduleData={questionModule}
            practiceLength={practiceSize}
            randomize
          />
        </div>
      </section>
    );
  }

  /*
   * CATEGORY HOME
   *
   * Lessons come first because understanding patterns and
   * grouping related rules is the core learning method.
   */
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-10">
          <p className="font-bold text-teal">
            Structured learning
          </p>

          <h1 className="mt-2 text-4xl font-black text-navy">
            {questionModule.eyebrow.replace(
              " module",
              ""
            )}
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Learn related questions together first. Use the
            memory patterns and common mistakes to understand
            why an answer is correct. Then test yourself using
            a random short, medium or full set.
          </p>
        </div>

        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <Brain className="size-7 text-teal" />

            <div>
              <p className="text-sm font-black uppercase tracking-wide text-teal">
                Step 1
              </p>

              <h2 className="text-3xl font-black text-navy">
                Learn by lesson
              </h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {learningLessons.map((lesson, index) => {
              const questionCount =
                questionModule.questions.filter(
                  (question) =>
                    question.lessonId === lesson.id
                ).length;

              return (
                <Card
                  key={lesson.id}
                  className="flex h-full flex-col p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-teal">
                        Lesson {index + 1}
                      </p>

                      <h3 className="mt-2 text-2xl font-black leading-8 text-navy">
                        {lesson.title}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-lg bg-muted px-3 py-2 text-sm font-black text-navy">
                      {questionCount} Qs
                    </span>
                  </div>

                  <p className="mt-4 leading-7 text-muted-foreground">
                    {lesson.intro}
                  </p>

                  <div className="mt-5 rounded-xl bg-teal/5 p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="mt-1 size-4 shrink-0 text-teal" />

                      <div>
                        <p className="text-sm font-black text-navy">
                          Memory pattern
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {lesson.memoryTrick}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-amber-50 p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-1 size-4 shrink-0 text-amber-700" />

                      <div>
                        <p className="text-sm font-black text-navy">
                          Watch out for
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {lesson.commonMistakes[0]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/practice/${questionModule.id}?lesson=${lesson.id}`}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-teal px-4 py-3 font-black text-white hover:bg-teal/90"
                  >
                    <PlayCircle className="size-5" />
                    Start lesson
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center gap-3">
            <ListChecks className="size-7 text-teal" />

            <div>
              <p className="text-sm font-black uppercase tracking-wide text-teal">
                Step 2
              </p>

              <h2 className="text-3xl font-black text-navy">
                Test your memory
              </h2>
            </div>
          </div>

          <p className="mb-6 max-w-3xl leading-7 text-muted-foreground">
            These sets mix questions from all lessons in this
            category. Use them after studying the lesson
            breakdowns.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href={`/practice/${questionModule.id}?size=15`}
            >
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-teal hover:shadow-lg">
                <Clock3 className="size-8 text-teal" />

                <p className="mt-5 text-sm font-black uppercase tracking-wide text-teal">
                  Short
                </p>

                <h3 className="mt-2 text-3xl font-black text-navy">
                  15 questions
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  Quick random revision after completing one or
                  more lessons.
                </p>
              </Card>
            </Link>

            <Link
              href={`/practice/${questionModule.id}?size=25`}
            >
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-teal hover:shadow-lg">
                <ListChecks className="size-8 text-teal" />

                <p className="mt-5 text-sm font-black uppercase tracking-wide text-teal">
                  Medium
                </p>

                <h3 className="mt-2 text-3xl font-black text-navy">
                  25 questions
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  A balanced random test covering several lesson
                  patterns.
                </p>
              </Card>
            </Link>

            <Link
              href={`/practice/${questionModule.id}?size=all`}
            >
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-teal hover:shadow-lg">
                <Layers3 className="size-8 text-teal" />

                <p className="mt-5 text-sm font-black uppercase tracking-wide text-teal">
                  Long
                </p>

                <h3 className="mt-2 text-3xl font-black text-navy">
                  All {questionModule.questions.length}
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  Full-category revision with every question
                  mixed randomly.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
