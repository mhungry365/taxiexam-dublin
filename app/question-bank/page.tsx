import { QuestionBankBrowser } from "@/components/taxiexam/question-bank-browser";

export const metadata = {
  title: "Question Bank"
};

export default function QuestionBankPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-8">
          <p className="font-bold text-teal">Master database</p>
          <h1 className="mt-2 text-4xl font-black text-navy">Question Bank</h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Browse every question by category, lesson, tag, and correct answer.
          </p>
        </div>
        <QuestionBankBrowser />
      </div>
    </section>
  );
}
