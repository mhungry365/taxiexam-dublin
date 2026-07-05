import { notFound } from "next/navigation";
import { QuestionBankBrowser } from "@/components/taxiexam/question-bank-browser";
import { getQuestionBankModule, questionBankModules } from "@/lib/question-bank";

export function generateStaticParams() {
  return questionBankModules.map((module) => ({
    moduleId: module.id
  }));
}

export default async function ModuleQuestionBankPage({
  params
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const module = getQuestionBankModule(moduleId);

  if (!module) notFound();

  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-8">
          <p className="font-bold text-teal">Question bank</p>
          <h1 className="mt-2 text-4xl font-black text-navy">
            {module.eyebrow.replace(" module", "")}
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Browse all questions in this category.
          </p>
        </div>
        <QuestionBankBrowser initialModuleId={module.id} />
      </div>
    </section>
  );
}
