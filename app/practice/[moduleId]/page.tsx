import { notFound } from "next/navigation";
import { StudentPracticeEngine } from "@/components/taxiexam/practice/student-practice-engine";
import { getQuestionBankModule, questionBankModules } from "@/lib/question-bank";

export function generateStaticParams() {
  return questionBankModules.map((moduleItem) => ({ moduleId: moduleItem.id }));
}

export default async function PracticeModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const questionModule = getQuestionBankModule(moduleId);

  if (!questionModule) notFound();

  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-8">
          <p className="font-bold text-teal">Practice mode</p>
          <h1 className="mt-2 text-4xl font-black text-navy">{questionModule.eyebrow.replace(" module", "")}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Answer first. Then see the correct answer and explanation.
          </p>
        </div>

        <StudentPracticeEngine moduleData={questionModule} />
      </div>
    </section>
  );
}
