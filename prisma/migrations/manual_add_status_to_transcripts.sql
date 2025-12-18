-- Add status enum type
DO $$ BEGIN
    CREATE TYPE "TranscriptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add status column to transcripts table with default value
ALTER TABLE "transcripts" 
ADD COLUMN IF NOT EXISTS "status" "TranscriptStatus" NOT NULL DEFAULT 'IN_PROGRESS';

