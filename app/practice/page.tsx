import Link from "next/link";
import { Card } from "@/components/ui/card";
import { questionBankModules } from "@/lib/question-bank";

export const metadata = { title: "Practice" };

export default function PracticePage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-8">
          <p className="font-bold text-teal">Student mode</p>
          <h1 className="mt-2 text-4xl font-black text-navy">Practice by category</h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Choose a category. Answers are hidden until you submit.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {questionBankModules.map((moduleItem) => (
            <Link key={moduleItem.id} href={`/practice/${moduleItem.id}`}>
              <Card className="h-full p-6 transition hover:border-teal">
                <p className="font-bold text-teal">{moduleItem.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-black text-navy">{moduleItem.title}</h2>
                <p className="mt-3 text-muted-foreground">{moduleItem.questions.length} questions</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
