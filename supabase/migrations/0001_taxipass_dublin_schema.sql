create extension if not exists "pgcrypto";

create type public.app_role as enum ('learner', 'admin');
create type public.module_type as enum ('industry', 'dublin_area');
create type public.quiz_mode as enum ('learn', 'category', 'weak_questions', 'daily_review', 'mock_exam', 'quick_10');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role public.app_role not null default 'learner',
  streak_count integer not null default 0 check (streak_count >= 0),
  target_exam_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  module_type public.module_type not null,
  parent_id uuid references public.categories(id) on delete set null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  subcategory text,
  module_type public.module_type not null,
  question_text text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  correct_answer_index integer not null check (correct_answer_index between 0 and 3),
  explanation text not null,
  difficulty integer not null default 2 check (difficulty between 1 and 5),
  source_reference text,
  image_url text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode public.quiz_mode not null,
  module_type public.module_type,
  category_id uuid references public.categories(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  industry_score_percent numeric(5,2),
  dublin_area_score_percent numeric(5,2),
  total_questions integer not null default 0 check (total_questions >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  passed boolean,
  readiness_score numeric(5,2),
  metadata jsonb not null default '{}'
);

create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer_index integer check (selected_answer_index between 0 and 3),
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  time_spent_seconds integer check (time_spent_seconds is null or time_spent_seconds >= 0),
  confidence_after integer check (confidence_after between 1 and 5)
);

create table public.user_question_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  seen_count integer not null default 0 check (seen_count >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  confidence integer not null default 1 check (confidence between 1 and 5),
  ease_factor numeric(4,2) not null default 2.50,
  interval_days integer not null default 0 check (interval_days >= 0),
  due_at timestamptz not null default now(),
  last_seen_at timestamptz,
  last_answer_correct boolean,
  primary key (user_id, question_id)
);

create table public.study_plan_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_day integer not null check (plan_day between 1 and 28),
  study_date date not null,
  target_questions integer not null default 30 check (target_questions > 0),
  completed_questions integer not null default 0 check (completed_questions >= 0),
  focus_modules public.module_type[] not null default '{}',
  focus_category_ids uuid[] not null default '{}',
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, plan_day)
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.user_question_progress enable row level security;
alter table public.study_plan_days enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "Users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "Anyone reads active categories" on public.categories for select using (is_active = true or public.is_admin());
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "Anyone reads active questions" on public.questions for select using (is_active = true or public.is_admin());
create policy "Admins manage questions" on public.questions for all using (public.is_admin()) with check (public.is_admin());

create policy "Users manage own attempts" on public.quiz_attempts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admins read attempts" on public.quiz_attempts for select using (public.is_admin());

create policy "Users manage own answers" on public.quiz_answers for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admins read answers" on public.quiz_answers for select using (public.is_admin());

create policy "Users manage own question progress" on public.user_question_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admins read question progress" on public.user_question_progress for select using (public.is_admin());

create policy "Users manage own study plan" on public.study_plan_days for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admins read study plans" on public.study_plan_days for select using (public.is_admin());

create policy "Admins read audit logs" on public.admin_audit_logs for select using (public.is_admin());

create index questions_module_category_idx on public.questions(module_type, category_id) where is_active = true;
create index user_question_progress_due_idx on public.user_question_progress(user_id, due_at);
create index quiz_attempts_user_started_idx on public.quiz_attempts(user_id, started_at desc);
