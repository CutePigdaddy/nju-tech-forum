create table if not exists profiles (
  id uuid primary key,
  nickname text not null,
  avatar_url text,
  department text,
  bio text,
  reputation integer not null default 0,
  level text not null default '魔法学徒',
  created_at timestamptz not null default now()
);

alter table profiles
  add column if not exists last_check_in_date date;

create table if not exists reputation_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  reason text not null,
  delta integer not null,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  title text not null,
  excerpt text,
  content text not null,
  category text not null,
  tags text[] not null default '{}',
  cover_url text,
  is_featured boolean not null default false,
  like_count integer not null default 0,
  reproduction_count integer not null default 0,
  favorite_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists prompt_cards (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null unique references posts(id) on delete cascade,
  title text not null,
  model text,
  prompt text not null,
  notes text
);

create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists reproductions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
