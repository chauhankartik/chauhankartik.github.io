-- =========================================================================
-- 2026 Master Study Portal & Portfolio — PostgreSQL Database Schema
-- Compatible with Supabase, Neon, AWS RDS, or Standard PostgreSQL 14+
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Study Sessions Log (Daily Streak, Hours Invested, Key Proofs & Notes)
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_date DATE DEFAULT CURRENT_DATE,
    topic TEXT NOT NULL,
    hours NUMERIC(4, 2) NOT NULL DEFAULT 1.5,
    notes TEXT,
    difficulty TEXT DEFAULT 'Staff'
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(session_date DESC);

-- 2. Curriculum Module Mastery State (Interactive 25-Module Checklist)
CREATE TABLE IF NOT EXISTS module_progress (
    module_id TEXT PRIMARY KEY,
    module_name TEXT,
    phase_id INT,
    status TEXT NOT NULL CHECK (status IN ('unstarted', 'in_progress', 'mastered', 'review')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Daily Spaced Repetition (SM-2 Active Recall Reviews)
CREATE TABLE IF NOT EXISTS spaced_repetition_reviews (
    review_date DATE PRIMARY KEY,
    items_count INT DEFAULT 5,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 13-Week Master Roadmap Progress State
CREATE TABLE IF NOT EXISTS roadmap_progress (
    week_number INT PRIMARY KEY,
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Public Engineering Thoughts / Tweets Comments & Discussion
CREATE TABLE IF NOT EXISTS thought_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thought_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_handle TEXT DEFAULT '@engineer',
    author_avatar TEXT DEFAULT '💬',
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_thought_comments_thought ON thought_comments(thought_id, created_at ASC);

-- =========================================================================
-- Row-Level Security (RLS) Policies
-- Public read & write for portfolio demonstrations and multi-device sync
-- =========================================================================

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaced_repetition_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE thought_comments ENABLE ROW LEVEL SECURITY;

-- Study Sessions RLS
CREATE POLICY "Allow public read on study_sessions" ON study_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on study_sessions" ON study_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on study_sessions" ON study_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on study_sessions" ON study_sessions FOR DELETE USING (true);

-- Module Progress RLS
CREATE POLICY "Allow public read on module_progress" ON module_progress FOR SELECT USING (true);
CREATE POLICY "Allow public insert on module_progress" ON module_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on module_progress" ON module_progress FOR UPDATE USING (true);

-- Spaced Repetition Reviews RLS
CREATE POLICY "Allow public read on spaced_repetition_reviews" ON spaced_repetition_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert on spaced_repetition_reviews" ON spaced_repetition_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on spaced_repetition_reviews" ON spaced_repetition_reviews FOR UPDATE USING (true);

-- Roadmap Progress RLS
CREATE POLICY "Allow public read on roadmap_progress" ON roadmap_progress FOR SELECT USING (true);
CREATE POLICY "Allow public insert on roadmap_progress" ON roadmap_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on roadmap_progress" ON roadmap_progress FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on roadmap_progress" ON roadmap_progress FOR DELETE USING (true);

-- Thought Comments RLS
CREATE POLICY "Allow public read on thought_comments" ON thought_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on thought_comments" ON thought_comments FOR INSERT WITH CHECK (true);
