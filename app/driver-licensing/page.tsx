import { LearningModule } from "@/components/taxiexam/learning-module";
import { getLearningModule } from "@/lib/module-data";

const moduleData = getLearningModule("driver-licensing");

export const metadata = {
  title: "Driver Licensing Module"
};

export default function DriverLicensingPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-8">
          <p className="font-bold text-teal">{moduleData.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-black text-navy">{moduleData.title}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{moduleData.description}</p>
        </div>
        <LearningModule moduleData={moduleData} />
      </div>
    </section>
  );
}
