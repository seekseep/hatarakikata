-- Drop tables (reverse dependency order)
drop table if exists career_guides cascade;
drop table if exists career_questions cascade;
drop table if exists career_map_event_tag_attachments cascade;
drop table if exists career_map_event_tags cascade;
drop table if exists career_events cascade;
drop table if exists career_map_vectors cascade;
drop table if exists career_maps cascade;
drop table if exists users cascade;

-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  name text
);

-- Career Maps
create table career_maps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  start_date text
);

create index career_maps_user_id_idx on career_maps(user_id);

-- Career Events
create table career_events (
  id uuid primary key default gen_random_uuid(),
  career_map_id uuid not null references career_maps(id) on delete cascade,
  name text not null,
  type text not null default 'working' check (type in ('living', 'working', 'feeling')),
  start_date text not null,
  end_date text not null check (end_date != start_date),
  strength integer not null default 3 check (strength >= 1 and strength <= 5),
  row integer not null default 0,
  description text
);

create index career_events_career_map_id_idx on career_events(career_map_id);

-- Career Map Event Tags
create table career_map_event_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- Career Map Event Tag Attachments
create table career_map_event_tag_attachments (
  career_event_id uuid not null references career_events(id) on delete cascade,
  career_map_event_tag_id uuid not null references career_map_event_tags(id) on delete cascade,
  primary key (career_event_id, career_map_event_tag_id)
);

create index career_map_event_tag_attachments_career_event_id_idx on career_map_event_tag_attachments(career_event_id);
create index career_map_event_tag_attachments_tag_id_idx on career_map_event_tag_attachments(career_map_event_tag_id);

-- Career Questions
create table career_questions (
  id uuid primary key default gen_random_uuid(),
  career_map_id uuid not null references career_maps(id) on delete cascade,
  name text not null default '',
  title text not null default '',
  status text not null default 'open' check (status in ('open', 'closed')),
  fields jsonb not null default '[]'::jsonb,
  row integer,
  start_date text,
  end_date text
);

create index career_questions_career_map_id_idx on career_questions(career_map_id);

-- Career Guides
create table career_guides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  base_career_map_id uuid not null references career_maps(id) on delete cascade,
  guide_career_map_id uuid not null references career_maps(id) on delete cascade,
  content text not null,
  next_actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index career_guides_user_id_idx on career_guides(user_id);
create index career_guides_base_career_map_id_idx on career_guides(base_career_map_id);
create index career_guides_guide_career_map_id_idx on career_guides(guide_career_map_id);

-- Vector search (pgvector)
create extension if not exists vector;

create table career_map_vectors (
  career_map_id uuid primary key references career_maps(id) on delete cascade,
  embedding vector(1536) not null,
  tag_weights jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index career_map_vectors_embedding_idx on career_map_vectors using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Match career map vectors by cosine similarity
create or replace function match_career_map_vectors(
  query_embedding vector(1536),
  match_count int,
  exclude_career_map_id uuid
)
returns table (career_map_id uuid, similarity float, tag_weights jsonb, user_name text)
language sql
as $$
  select
    v.career_map_id,
    1 - (v.embedding <=> query_embedding) as similarity,
    v.tag_weights,
    u.name as user_name
  from career_map_vectors v
  join career_maps cm on cm.id = v.career_map_id
  join users u on u.id = cm.user_id
  where v.career_map_id != exclude_career_map_id
  order by v.embedding <=> query_embedding
  limit match_count;
$$;
