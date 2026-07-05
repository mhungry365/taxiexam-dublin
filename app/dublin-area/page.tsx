import { Card } from "@/components/ui/card";
import { dublinCategories } from "@/lib/taxiexam-data";

export const metadata = {
  title: "Dublin Area Knowledge"
};

export default function DublinAreaPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <p className="font-bold text-teal">Dublin Area Knowledge</p>
        <h1 className="mt-2 text-4xl font-black text-navy">Train the map knowledge categories that matter.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Use category quizzes and weak-question review to build confidence across routes, hospitals, hotels, transport hubs, stations, landmarks, one-way streets, and places of interest.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dublinCategories.map(({ name, icon: Icon, count }) => (
            <Card key={name} className="p-5">
              <Icon className="text-teal" aria-hidden />
              <h2 className="mt-4 font-black text-navy">{name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{count} practice prompts planned</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/5 rounded-full bg-coral" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
