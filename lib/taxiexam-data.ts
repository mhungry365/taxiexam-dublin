import {
  BadgeCheck,
  BookOpenCheck,
  Brain,
  Building2,
  CalendarDays,
  CarTaxiFront,
  ClipboardCheck,
  Clock3,
  Flag,
  Gauge,
  Hotel,
  Landmark,
  Map,
  MapPinned,
  Route,
  ShieldCheck,
  Train,
  Trophy
} from "lucide-react";

export const examModules = [
  {
    key: "industry",
    name: "Industry Knowledge",
    questions: 54,
    target: 75,
    ready: 85,
    color: "bg-teal"
  },
  {
    key: "dublin_area",
    name: "Dublin Area Knowledge",
    questions: 36,
    target: 75,
    ready: 85,
    color: "bg-coral"
  }
];

export const planWeeks = [
  {
    week: "Week 1",
    title: "Build the base",
    focus: "Rules, duties, licence basics, and Dublin geography foundations",
    target: "20 minutes daily",
    progress: 25
  },
  {
    week: "Week 2",
    title: "Drill categories",
    focus: "Hospitals, stations, hotels, routes, fares, and passenger safety",
    target: "30 questions daily",
    progress: 50
  },
  {
    week: "Week 3",
    title: "Close weak spots",
    focus: "Spaced repetition, wrong-answer review, and map confidence",
    target: "2 weak-topic sessions daily",
    progress: 75
  },
  {
    week: "Week 4",
    title: "Mock exam ready",
    focus: "Timed full mocks until both modules are consistently 85%+",
    target: "3 full mocks weekly",
    progress: 100
  }
];

export const quizModes = [
  { name: "Learn mode", icon: BookOpenCheck, detail: "See explanations after every answer." },
  { name: "Category quiz", icon: MapPinned, detail: "Focus on one skill area at a time." },
  { name: "Weak questions", icon: Brain, detail: "Prioritise questions you miss or rate low." },
  { name: "Daily review", icon: CalendarDays, detail: "Spaced repetition for today." },
  { name: "Mock exam", icon: ClipboardCheck, detail: "54 industry and 36 Dublin questions." },
  { name: "Quick 10", icon: Gauge, detail: "A fast practice burst for spare minutes." }
];

export const dublinCategories = [
  { name: "Routes", icon: Route, count: 42 },
  { name: "Hospitals", icon: Building2, count: 28 },
  { name: "Hotels", icon: Hotel, count: 24 },
  { name: "Train/DART stations", icon: Train, count: 30 },
  { name: "Landmarks", icon: Landmark, count: 34 },
  { name: "Transport hubs", icon: CarTaxiFront, count: 18 },
  { name: "One-way streets", icon: Map, count: 16 },
  { name: "Places of interest", icon: Flag, count: 26 }
];

export const dashboardStats = [
  { label: "Overall progress", value: "38%", icon: Trophy },
  { label: "Current streak", value: "6 days", icon: BadgeCheck },
  { label: "Mock readiness", value: "71%", icon: ShieldCheck },
  { label: "Daily target", value: "30 Qs", icon: Clock3 }
];

export const weakCategories = ["Dublin hospitals", "Passenger safety", "DART stations", "One-way streets"];

export const sampleQuestions = [
  {
    id: "sample-industry-1",
    module: "industry",
    category: "Passenger Safety",
    subcategory: "Driver duties",
    difficulty: "easy",
    question: "What should an SPSV driver do before starting a journey with a passenger?",
    options: [
      "Confirm the destination and use the appropriate route",
      "Start the meter only after reaching the destination",
      "Refuse all short trips during busy periods",
      "Ask the passenger to navigate every turn"
    ],
    correct: 0,
    explanation:
      "Drivers should confirm the destination, begin the journey properly, and follow a suitable route unless the passenger requests otherwise.",
    source: "Sample training content, not official exam text"
  },
  {
    id: "sample-dublin-1",
    module: "dublin_area",
    category: "Hospitals",
    subcategory: "Major hospitals",
    difficulty: "medium",
    question: "Which Dublin hospital is located in the St James's area?",
    options: ["St James's Hospital", "Beaumont Hospital", "The Mater Hospital", "Tallaght University Hospital"],
    correct: 0,
    explanation:
      "St James's Hospital is associated with the St James's area in Dublin 8.",
    source: "Sample location knowledge, verify against current official guidance"
  },
  {
    id: "sample-dublin-2",
    module: "dublin_area",
    category: "Transport hubs",
    subcategory: "Stations",
    difficulty: "easy",
    question: "Which rail station is beside the IFSC and Docklands area?",
    options: ["Connolly Station", "Heuston Station", "Sandyford Luas", "Blackrock DART"],
    correct: 0,
    explanation:
      "Connolly Station is a major city-centre rail and Luas hub close to the IFSC.",
    source: "Sample training content, not official exam text"
  }
];
