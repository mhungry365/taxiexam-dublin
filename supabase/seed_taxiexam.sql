insert into public.categories (name, slug, module_type, description, sort_order)
values
  ('Passenger Safety', 'passenger-safety', 'industry', 'Driver duties, safety, accessibility, and passenger care.', 10),
  ('Fares and Receipts', 'fares-receipts', 'industry', 'Fare handling, receipts, and professional conduct.', 20),
  ('Hospitals', 'dublin-hospitals', 'dublin_area', 'Major Dublin hospitals and common passenger destinations.', 30),
  ('Train and DART Stations', 'train-dart-stations', 'dublin_area', 'Rail, DART, Luas, and transport hub knowledge.', 40),
  ('Landmarks', 'dublin-landmarks', 'dublin_area', 'Key Dublin landmarks and places of interest.', 50)
on conflict (slug) do nothing;

insert into public.questions (
  category_id,
  subcategory,
  module_type,
  question_text,
  options,
  correct_answer_index,
  explanation,
  difficulty,
  source_reference
)
select c.id, q.subcategory, q.module_type::public.module_type, q.question_text, q.options::jsonb, q.correct_answer_index, q.explanation, q.difficulty, q.source_reference
from (
  values
    ('passenger-safety', 'Driver duties', 'industry', 'What should an SPSV driver do before starting a journey with a passenger?', '["Confirm the destination and use the appropriate route", "Start the meter only after reaching the destination", "Refuse all short trips during busy periods", "Ask the passenger to navigate every turn"]', 0, 'Drivers should confirm the destination, begin the journey properly, and follow a suitable route unless the passenger requests otherwise.', 1, 'Original sample training content, not official exam text'),
    ('fares-receipts', 'Receipts', 'industry', 'When should a taxi driver be prepared to provide a receipt?', '["When the passenger requests one", "Only for airport journeys", "Only when paid by card", "Only for journeys over 20 euro"]', 0, 'A professional SPSV service should support receipts when requested by the passenger.', 1, 'Original sample training content, not official exam text'),
    ('dublin-hospitals', 'Major hospitals', 'dublin_area', 'Which Dublin hospital is located in the St James''s area?', '["St James''s Hospital", "Beaumont Hospital", "The Mater Hospital", "Tallaght University Hospital"]', 0, 'St James''s Hospital is associated with the St James''s area in Dublin 8.', 2, 'Original location knowledge sample, verify against current official guidance'),
    ('train-dart-stations', 'Stations', 'dublin_area', 'Which rail station is beside the IFSC and Docklands area?', '["Connolly Station", "Heuston Station", "Sandyford Luas", "Blackrock DART"]', 0, 'Connolly Station is a major city-centre rail and Luas hub close to the IFSC.', 1, 'Original sample training content, not official exam text'),
    ('dublin-landmarks', 'Places of interest', 'dublin_area', 'Which landmark is closest to College Green?', '["Trinity College Dublin", "Phoenix Park Visitor Centre", "Malahide Castle", "Dun Laoghaire Harbour"]', 0, 'Trinity College Dublin is located at College Green in Dublin city centre.', 1, 'Original sample training content, not official exam text')
) as q(slug, subcategory, module_type, question_text, options, correct_answer_index, explanation, difficulty, source_reference)
join public.categories c on c.slug = q.slug
where not exists (
  select 1 from public.questions existing
  where existing.question_text = q.question_text
);

insert into public.fares_lessons (id, title, intro, memory_trick, common_mistakes, sort_order)
values
  ('fare-basics', 'Fare Basics', 'Start with the core ideas: when a fare begins, what the passenger can expect, and how a fare should be handled clearly.', 'Before fare detail, remember the three Cs: confirm, charge correctly, communicate.', array['Mixing general fare duties with extra-charge rules', 'Forgetting receipt and passenger communication basics'], 10),
  ('standard-premium-special-rates', 'Standard, Premium and Special Rates', 'Learn how rate types differ so you can recognise the correct charging context quickly.', 'Standard is the baseline, premium is time-sensitive, special is event or rule-specific.', array['Treating premium and special rates as the same thing', 'Missing the condition that triggers a rate'], 20),
  ('tariff-a-tariff-b', 'Tariff A and Tariff B', 'Focus on the difference between Tariff A and Tariff B and when each one applies.', 'A comes first for the ordinary case; B is the exception you must identify.', array['Choosing the tariff from habit instead of the question facts', 'Ignoring time, date, or passenger-count clues'], 30),
  ('time-vs-distance-charging', 'Time vs Distance Charging', 'Understand when the fare is affected by time, distance, traffic, or waiting.', 'Moving means distance matters; delayed means time can matter.', array['Assuming only distance changes the fare', 'Missing waiting-time wording'], 40),
  ('extra-charges', 'Extra Charges', 'Practise recognising valid extra charges and spotting charges that should not be added.', 'Extras need a rule. If no rule supports it, do not add it.', array['Adding extras because a trip feels inconvenient', 'Confusing luggage, passenger, booking, or soiling charges'], 50),
  ('taximeter-rules', 'Taximeter Rules', 'Review how the taximeter should be used, displayed, and relied on during a journey.', 'Meter first, explanation second, receipt if requested.', array['Starting or stopping the meter at the wrong moment', 'Forgetting that the meter reading anchors the fare'], 60),
  ('fixed-payment-offences', 'Fixed Payment Offences', 'Learn the offence patterns that lead to fixed payment notices.', 'If the rule is clear and the breach is visible, expect a fixed-payment style question.', array['Reading offence questions as customer-service questions', 'Missing words like fail, refuse, display, or produce'], 70),
  ('customer-service-driver-rights', 'Customer Service and Driver Rights', 'Balance passenger service expectations with the rights and responsibilities of a professional driver.', 'Be fair, be clear, be professional.', array['Assuming drivers must accept every situation', 'Forgetting passenger-facing duties such as receipts'], 80),
  ('final-mixed-fares-test', 'Final Mixed Fares Test', 'Take every Fares question together to check whether you can handle mixed wording without lesson hints.', 'Read the facts first, identify the fare topic second, choose the rule last.', array['Answering by lesson title instead of the question facts', 'Rushing rate, tariff, and extra-charge questions'], 90)
on conflict (id) do update set
  title = excluded.title,
  intro = excluded.intro,
  memory_trick = excluded.memory_trick,
  common_mistakes = excluded.common_mistakes,
  sort_order = excluded.sort_order;

insert into public.fares_questions (
  id,
  lesson_id,
  question_number,
  question_text,
  type,
  options,
  correct_answers,
  explanation,
  memory_tip,
  common_mistake,
  tags,
  source
)
values (
  'fares-001',
  'customer-service-driver-rights',
  1,
  'When should a taxi driver be prepared to provide a receipt?',
  'single',
  '["When the passenger requests one", "Only for airport journeys", "Only when paid by card", "Only for journeys over 20 euro"]',
  array[0],
  'A professional SPSV service should support receipts when requested by the passenger.',
  'Receipt questions usually turn on the passenger request.',
  'Do not limit receipt duties to a payment method, journey type, or fare amount unless the original question says so.',
  array['receipts', 'customer-service'],
  'FREE_NOW'
)
on conflict (id) do update set
  lesson_id = excluded.lesson_id,
  question_number = excluded.question_number,
  question_text = excluded.question_text,
  type = excluded.type,
  options = excluded.options,
  correct_answers = excluded.correct_answers,
  explanation = excluded.explanation,
  memory_tip = excluded.memory_tip,
  common_mistake = excluded.common_mistake,
  tags = excluded.tags,
  source = excluded.source;
