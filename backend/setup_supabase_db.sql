-- CampaignAI Database Setup for Supabase
-- Run this in Supabase SQL Editor

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('social_media', 'email', 'meta_ads')),
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    product_description TEXT NOT NULL,
    tone TEXT NOT NULL CHECK (tone IN ('professional', 'casual', 'sales_focused')),
    content JSONB NOT NULL,
    poster_design JSONB,
    reference_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_campaign_type ON campaigns(campaign_type);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns table
-- Users can only see their own campaigns
CREATE POLICY "Users can view own campaigns"
    ON campaigns FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own campaigns
CREATE POLICY "Users can insert own campaigns"
    ON campaigns FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own campaigns
CREATE POLICY "Users can update own campaigns"
    ON campaigns FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own campaigns
CREATE POLICY "Users can delete own campaigns"
    ON campaigns FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for reference images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('reference-images', 'reference-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for reference-images bucket
CREATE POLICY "Users can upload own images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'reference-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'reference-images');

CREATE POLICY "Users can delete own images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'reference-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
