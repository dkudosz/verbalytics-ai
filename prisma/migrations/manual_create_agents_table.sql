-- Create agents table
CREATE TABLE IF NOT EXISTS "agents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "agent_id" TEXT NOT NULL,
    "agent_name" TEXT NOT NULL,
    "agent_surname" TEXT NOT NULL,
    "agent_email" TEXT NOT NULL,
    "agent_phone" TEXT,
    "agent_slack" TEXT,
    "agent_discord" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- Create foreign key constraint
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create unique constraint for user_id and agent_id combination
CREATE UNIQUE INDEX "agents_user_id_agent_id_key" ON "agents"("user_id", "agent_id");

-- Create index on user_id for faster queries
CREATE INDEX "agents_user_id_idx" ON "agents"("user_id");

-- Create index on agent_email for faster lookups
CREATE INDEX "agents_agent_email_idx" ON "agents"("agent_email");

