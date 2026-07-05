import { FaresModule } from "@/components/taxiexam/fares-module";

export const metadata = {
  title: "Fares Module"
};

export default function FaresPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-8">
          <p className="font-bold text-teal">Fares module</p>
          <h1 className="mt-2 text-4xl font-black text-navy">Learn Fares lesson by lesson.</h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Study fare topics in focused lessons, take a mini quiz, review wrong answers, and finish with a mixed Fares test using every loaded original question.
          </p>
        </div>
        <FaresModule />
      </div>
    </section>
  );
}
