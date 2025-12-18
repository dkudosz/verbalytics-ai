-- Add system_token and old_system_tokens columns to users table
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "system_token" TEXT,
ADD COLUMN IF NOT EXISTS "old_system_tokens" JSONB DEFAULT '[]'::jsonb;

-- Create index on system_token for faster lookups (optional, but useful if you need to query by token)
CREATE INDEX IF NOT EXISTS "users_system_token_idx" ON "users"("system_token") WHERE "system_token" IS NOT NULL;

