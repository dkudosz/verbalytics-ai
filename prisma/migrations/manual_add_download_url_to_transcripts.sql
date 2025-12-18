-- Add download_url column to transcripts table
ALTER TABLE "transcripts" 
ADD COLUMN IF NOT EXISTS "download_url" TEXT;

