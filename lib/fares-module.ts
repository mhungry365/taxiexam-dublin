export type FaresLessonId =
  | "fare-basics"
  | "standard-premium-special-rates"
  | "tariff-a-tariff-b"
  | "time-vs-distance-charging"
  | "extra-charges"
  | "taximeter-rules"
  | "fixed-payment-offences"
  | "customer-service-driver-rights"
  | "final-mixed-fares-test";

export type FaresQuestion = {
  id: string;
  module: "fares";
  lessonId: Exclude<FaresLessonId, "final-mixed-fares-test">;
  questionNumber: number;
  questionText: string;
  type: "single" | "multiple";
  options: string[];
  correctAnswers: number[];
  explanation: string;
  memoryTip: string;
  commonMistake: string;
  tags: string[];
  source: "FREE_NOW";
};

export type FaresLesson = {
  id: FaresLessonId;
  title: string;
  intro: string;
  memoryTrick: string;
  commonMistakes: string[];
  tags: string[];
};

export const faresQuestionTargetCount = 44;

export const faresLessons: FaresLesson[] = [
  {
    id: "fare-basics",
    title: "Fare Basics",
    intro: "Start with the core ideas: when a fare begins, what the passenger can expect, and how a fare should be handled clearly.",
    memoryTrick: "Before fare detail, remember the three Cs: confirm, charge correctly, communicate.",
    commonMistakes: ["Mixing general fare duties with extra-charge rules", "Forgetting receipt and passenger communication basics"],
    tags: ["fare-basics", "receipts"]
  },
  {
    id: "standard-premium-special-rates",
    title: "Standard, Premium and Special Rates",
    intro: "Learn how rate types differ so you can recognise the correct charging context quickly.",
    memoryTrick: "Standard is the baseline, premium is time-sensitive, special is event or rule-specific.",
    commonMistakes: ["Treating premium and special rates as the same thing", "Missing the condition that triggers a rate"],
    tags: ["standard-rate", "premium-rate", "special-rate"]
  },
  {
    id: "tariff-a-tariff-b",
    title: "Tariff A and Tariff B",
    intro: "Focus on the difference between Tariff A and Tariff B and when each one applies.",
    memoryTrick: "A comes first for the ordinary case; B is the exception you must identify.",
    commonMistakes: ["Choosing the tariff from habit instead of the question facts", "Ignoring time, date, or passenger-count clues"],
    tags: ["tariff-a", "tariff-b"]
  },
  {
    id: "time-vs-distance-charging",
    title: "Time vs Distance Charging",
    intro: "Understand when the fare is affected by time, distance, traffic, or waiting.",
    memoryTrick: "Moving means distance matters; delayed means time can matter.",
    commonMistakes: ["Assuming only distance changes the fare", "Missing waiting-time wording"],
    tags: ["time", "distance", "waiting"]
  },
  {
    id: "extra-charges",
    title: "Extra Charges",
    intro: "Practise recognising valid extra charges and spotting charges that should not be added.",
    memoryTrick: "Extras need a rule. If no rule supports it, do not add it.",
    commonMistakes: ["Adding extras because a trip feels inconvenient", "Confusing luggage, passenger, booking, or soiling charges"],
    tags: ["extras", "charges"]
  },
  {
    id: "taximeter-rules",
    title: "Taximeter Rules",
    intro: "Review how the taximeter should be used, displayed, and relied on during a journey.",
    memoryTrick: "Meter first, explanation second, receipt if requested.",
    commonMistakes: ["Starting or stopping the meter at the wrong moment", "Forgetting that the meter reading anchors the fare"],
    tags: ["taximeter", "meter"]
  },
  {
    id: "fixed-payment-offences",
    title: "Fixed Payment Offences",
    intro: "Learn the offence patterns that lead to fixed payment notices.",
    memoryTrick: "If the rule is clear and the breach is visible, expect a fixed-payment style question.",
    commonMistakes: ["Reading offence questions as customer-service questions", "Missing words like fail, refuse, display, or produce"],
    tags: ["offences", "fixed-payment"]
  },
  {
    id: "customer-service-driver-rights",
    title: "Customer Service and Driver Rights",
    intro: "Balance passenger service expectations with the rights and responsibilities of a professional driver.",
    memoryTrick: "Be fair, be clear, be professional.",
    commonMistakes: ["Assuming drivers must accept every situation", "Forgetting passenger-facing duties such as receipts"],
    tags: ["customer-service", "driver-rights", "receipts"]
  },
  {
    id: "final-mixed-fares-test",
    title: "Final Mixed Fares Test",
    intro: "Take every Fares question together to check whether you can handle mixed wording without lesson hints.",
    memoryTrick: "Read the facts first, identify the fare topic second, choose the rule last.",
    commonMistakes: ["Answering by lesson title instead of the question facts", "Rushing rate, tariff, and extra-charge questions"],
    tags: ["mixed-test"]
  }
];

export const faresQuestions: FaresQuestion[] = [
  {
    id: "fares-001",
    module: "fares",
    lessonId: "customer-service-driver-rights",
    questionNumber: 1,
    questionText: "When should a taxi driver be prepared to provide a receipt?",
    type: "single",
    options: ["When the passenger requests one", "Only for airport journeys", "Only when paid by card", "Only for journeys over 20 euro"],
    correctAnswers: [0],
    explanation: "A professional SPSV service should support receipts when requested by the passenger.",
    memoryTip: "Receipt questions usually turn on the passenger request.",
    commonMistake: "Do not limit receipt duties to a payment method, journey type, or fare amount unless the original question says so.",
    tags: ["receipts", "customer-service"],
    source: "FREE_NOW"
  }
];

export function getFaresQuestionsForLesson(lessonId: FaresLessonId) {
  if (lessonId === "final-mixed-fares-test") return faresQuestions;
  return faresQuestions.filter((question) => question.lessonId === lessonId);
}

export function getFaresLessonScore(answers: Record<string, number[]>, questions: FaresQuestion[]) {
  const correct = questions.filter((question) => {
    const answer = answers[question.id] ?? [];
    return (
      answer.length === question.correctAnswers.length &&
      question.correctAnswers.every((correctAnswer) => answer.includes(correctAnswer))
    );
  }).length;

  return {
    correct,
    total: questions.length,
    percent: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
  };
}

export function getWeakFaresTopics(answers: Record<string, number[]>) {
  const missedTags = new Map<string, number>();

  faresQuestions.forEach((question) => {
    const answer = answers[question.id] ?? [];
    const isCorrect =
      answer.length === question.correctAnswers.length &&
      question.correctAnswers.every((correctAnswer) => answer.includes(correctAnswer));

    if (!isCorrect && answer.length > 0) {
      question.tags.forEach((tag) => missedTags.set(tag, (missedTags.get(tag) ?? 0) + 1));
    }
  });

  return [...missedTags.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}
