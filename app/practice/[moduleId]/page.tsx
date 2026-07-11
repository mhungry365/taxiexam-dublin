import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Layers3, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StudentPracticeEngine } from "@/components/taxiexam/practice/student-practice-engine";
import {
  getQuestionBankModule,
  questionBankModules
} from "@/lib/question-bank";

type PracticeSize = 15 | 25 | "all";

export function generateStaticParams() {
  return questionBankModules.map((moduleItem) => ({
    moduleId: moduleItem.id
  }));
}

function parsePracticeSize(value?: string): PracticeSize | null {
  if (value === "15") {
    return 15;
  }

  if (value === "25") {
    return 25;
  }

  if (value === "all") {
    return "all";
  }

  return null;
}

export default async function PracticeModulePage({
  params,
  searchParams
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ size?: string }>;
}) {
  const { moduleId } = await params;
  const { size } = await searchParams;

  const questionModule = getQuestionBankModule(moduleId);
  const practiceSize = parsePracticeSize(size);

  if (!questionModule) {
    notFound();
  }

  if (!practiceSize) {
    return (
      <section className="section bg-snow">
        <div className="container">
          <div className="mb-8">
            <p className="font-bold text-teal">Choose question-set length</p>

            <h1 className="mt-2 text-4xl font-black text-navy">
              {questionModule.eyebrow.replace(" module", "")}
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              Select a short revision set, a medium practice session,
              or the complete category question bank.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Link href={`/practice/${questionModule.id}?size=15`}>
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-teal hover:shadow-lg">
                <Clock3 className="size-8 text-teal" />

                <p className="mt-5 text-sm font-black uppercase tracking-wide text-teal">
                  Short
                </p>

                <h2 className="mt-2 text-3xl font-black text-navy">
                  15 questions
                </h2>

                <p className="mt-3 text-muted-foreground">
                  A quick random revision session for daily practice.
                </p>

                <p className="mt-5 font-black text-navy">
                  Approximately 8–12 minutes
                </p>
              </Card>
            </Link>

            <Link href={`/practice/${questionModule.id}?size=25`}>
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-teal hover:shadow-lg">
                <ListChecks className="size-8 text-teal" />

                <p className="mt-5 text-sm font-black uppercase tracking-wide text-teal">
                  Medium
                </p>

                <h2 className="mt-2 text-3xl font-black text-navy">
                  25 questions
                </h2>

                <p className="mt-3 text-muted-foreground">
                  A balanced random set for a focused study session.
                </p>

                <p className="mt-5 font-black text-navy">
                  Approximately 15–20 minutes
                </p>
              </Card>
            </Link>

            <Link href={`/practice/${questionModule.id}?size=all`}>
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-teal hover:shadow-lg">
                <Layers3 className="size-8 text-teal" />

                <p className="mt-5 text-sm font-black uppercase tracking-wide text-teal">
                  Long
                </p>

                <h2 className="mt-2 text-3xl font-black text-navy">
                  All {questionModule.questions.length}
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Complete every question in this category.
                </p>

                <p className="mt-5 font-black text-navy">
                  Full category revision
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold text-teal">Category practice</p>

            <h1 className="mt-2 text-4xl font-black text-navy">
              {questionModule.eyebrow.replace(" module", "")}
            </h1>
          </div>

          <Link
            href={`/practice/${questionModule.id}`}
            className="font-black text-teal hover:underline"
          >
            Change question-set length
          </Link>
        </div>

        <StudentPracticeEngine
          moduleData={questionModule}
          practiceLength={practiceSize}
        />
      </div>
    </section>
  );
}
