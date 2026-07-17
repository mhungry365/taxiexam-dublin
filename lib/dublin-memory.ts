export interface DublinMemoryHint {
  explanation: string;
  memoryTip: string;
  pattern: string;
}

const STREET_KEYWORDS = [
  "Road",
  "Street",
  "Avenue",
  "Lane",
  "Place",
  "Drive",
  "Park",
  "Green",
  "Quay",
  "Square",
  "Terrace",
];

function districtOf(text: string) {
  const m = text.match(/Dublin\s+(\d+)/i);
  return m ? `Dublin ${m[1]}` : null;
}

function landmark(text: string) {
  const known = [
    "Temple Bar",
    "Heuston",
    "Connolly",
    "O'Connell",
    "St. Stephen",
    "Phoenix Park",
    "Croke Park",
    "Trinity",
    "Grafton",
    "Malahide",
    "Howth",
    "Dundrum",
    "Tallaght",
    "Blanchardstown",
    "Smithfield",
    "Docklands",
    "IFSC",
    "Ballsbridge",
    "Ranelagh",
    "Drumcondra",
    "Cabra",
    "Kilmainham"
  ];

  for (const k of known) {
    if (text.toLowerCase().includes(k.toLowerCase()))
      return k;
  }

  return null;
}

function street(text:string){
  for(const s of STREET_KEYWORDS){
    if(text.includes(s))
      return s;
  }
  return null;
}

export function buildMemoryHint(question:string, answer:string):DublinMemoryHint{

  const district = districtOf(answer);
  const lm = landmark(answer);
  const st = street(answer);

  let explanation =
    `"${answer}" is the correct location for this question.`;

  let memoryTip =
    "Picture yourself driving there and associate one unique landmark with the destination.";

  let pattern =
    "Visual memory";

  if(district){
    explanation =
      `"${answer}" belongs to ${district}. Questions asking about this place usually stay inside the same postal district.`;

    memoryTip =
      `Remember the district first (${district}), then the exact location.`;

    pattern =
      "District → Location";
  }

  if(lm){
    explanation =
      `"${answer}" is associated with ${lm}.`;

    memoryTip =
      `When you hear "${lm}", immediately think of "${answer}".`;

    pattern =
      "Landmark association";
  }

  if(st){
    memoryTip +=
      ` Also remember that it is on a ${st}.`;

    pattern +=
      " + Street type";
  }

  return {
    explanation,
    memoryTip,
    pattern
  };
}
