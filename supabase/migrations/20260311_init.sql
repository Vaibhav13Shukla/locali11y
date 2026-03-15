-- ════════════════════════════════════════
-- Extensions and helpers
-- ════════════════════════════════════════
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ════════════════════════════════════════
-- profiles
-- ════════════════════════════════════════
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users_read_own" on public.profiles
  for select using (id = auth.uid());
create policy "users_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "users_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users_delete_own" on public.profiles
  for delete using (id = auth.uid());

-- ════════════════════════════════════════
-- audits
-- ════════════════════════════════════════
create table public.audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_url text not null,
  source_locale text not null,
  target_locales text[] not null,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index audits_user_created_at_idx
  on public.audits (user_id, created_at desc);

create trigger set_audits_updated_at
  before update on public.audits
  for each row execute function public.set_updated_at();

alter table public.audits enable row level security;

create policy "users_read_own_audits" on public.audits
  for select using (user_id = auth.uid());
create policy "users_insert_own_audits" on public.audits
  for insert to authenticated with check (user_id = auth.uid());
create policy "users_update_own_audits" on public.audits
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "users_delete_own_audits" on public.audits
  for delete using (user_id = auth.uid());

-- ════════════════════════════════════════
-- audit_locale_results
-- ════════════════════════════════════════
create table public.audit_locale_results (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.audits(id) on delete cascade,
  locale text not null,
  locale_url text not null,
  score integer not null check (score >= 0 and score <= 100),
  total_checks integer not null,
  passed_checks integer not null,
  failed_checks integer not null,
  critical_issues integer not null default 0,
  important_issues integer not null default 0,
  info_issues integer not null default 0,
  locale_specific_issues integer not null default 0,
  fetched_at timestamptz not null default now(),
  unique (audit_id, locale)
);

create index audit_locale_results_audit_idx
  on public.audit_locale_results (audit_id);

alter table public.audit_locale_results enable row level security;

create policy "users_read_own_locale_results" on public.audit_locale_results
  for select using (
    exists (select 1 from public.audits a
            where a.id = audit_id and a.user_id = auth.uid())
  );
create policy "users_insert_own_locale_results" on public.audit_locale_results
  for insert to authenticated with check (
    exists (select 1 from public.audits a
            where a.id = audit_id and a.user_id = auth.uid())
  );
create policy "users_delete_own_locale_results" on public.audit_locale_results
  for delete using (
    exists (select 1 from public.audits a
            where a.id = audit_id and a.user_id = auth.uid())
  );

-- ════════════════════════════════════════
-- audit_issues
-- ════════════════════════════════════════
create table public.audit_issues (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.audits(id) on delete cascade,
  locale_result_id uuid not null references public.audit_locale_results(id) on delete cascade,
  locale text not null,
  check_id text not null,
  severity text not null check (severity in ('critical', 'important', 'info')),
  category text not null,
  element_selector text,
  element_html text,
  source_value text,
  target_value text,
  is_locale_specific boolean not null default false,
  fix_suggestion text,
  created_at timestamptz not null default now()
);

create index audit_issues_audit_idx
  on public.audit_issues (audit_id);
create index audit_issues_locale_result_idx
  on public.audit_issues (locale_result_id);
create index audit_issues_locale_specific_idx
  on public.audit_issues (audit_id, is_locale_specific)
  where is_locale_specific = true;

alter table public.audit_issues enable row level security;

create policy "users_read_own_issues" on public.audit_issues
  for select using (
    exists (select 1 from public.audits a
            where a.id = audit_id and a.user_id = auth.uid())
  );
create policy "users_insert_own_issues" on public.audit_issues
  for insert to authenticated with check (
    exists (select 1 from public.audits a
            where a.id = audit_id and a.user_id = auth.uid())
  );
create policy "users_update_own_issues" on public.audit_issues
  for update using (
    exists (select 1 from public.audits a
            where a.id = audit_id and a.user_id = auth.uid())
  );
create policy "users_delete_own_issues" on public.audit_issues
  for delete using (
    exists (select 1 from public.audits a
            where a.id = audit_id and a.user_id = auth.uid())
  );
