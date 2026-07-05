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
