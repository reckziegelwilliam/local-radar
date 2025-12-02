-- Beta Feedback Table Migration
-- This table stores feedback from beta testers
-- Create beta_feedback table
create table
    public.beta_feedback (
        id bigserial primary key,
        user_id uuid references auth.users (id) on delete set null,
        feedback text not null check (length (feedback) between 10 and 5000),
        feedback_type text not null check (feedback_type in ('bug', 'feature', 'general')),
        platform text,
        app_version text,
        device_info jsonb,
        screen_name text,
        created_at timestamptz default now ()
    );

-- Enable Row Level Security
alter table public.beta_feedback enable row level security;

-- Policy: Users can submit their own feedback
create policy "Users can submit feedback" on public.beta_feedback for insert
with
    check (auth.uid () = user_id);

-- Policy: Users can view their own feedback
create policy "Users can view own feedback" on public.beta_feedback for
select
    using (auth.uid () = user_id);

-- Policy: Admins can view all feedback (adjust based on your admin setup)
-- For now, allowing authenticated users to view all feedback for transparency
create policy "Authenticated users can view all feedback" on public.beta_feedback for
select
    using (auth.role () = 'authenticated');

-- Create index for faster queries
create index beta_feedback_user_id_idx on public.beta_feedback (user_id);

create index beta_feedback_created_at_idx on public.beta_feedback (created_at desc);

create index beta_feedback_type_idx on public.beta_feedback (feedback_type);

-- Add comment to table
comment on table public.beta_feedback is 'Stores feedback from beta testers including bugs, feature requests, and general comments';