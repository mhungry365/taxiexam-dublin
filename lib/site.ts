export const siteConfig = {
  name: "TaxiExam Dublin",
  description: "Pass your Dublin SPSV taxi exam in 4 weeks with smart quizzes, mock exams, and weak-area practice.",
  url: "https://taxiexamdublin.vercel.app"
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
}
