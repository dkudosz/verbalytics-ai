-- Create scripts table
CREATE TABLE IF NOT EXISTS "scripts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "script_name" TEXT NOT NULL,
    "script_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scripts_pkey" PRIMARY KEY ("id")
);

-- Create foreign key constraint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index on user_id for faster queries
CREATE INDEX "scripts_user_id_idx" ON "scripts"("user_id");

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_scripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON "scripts"
    FOR EACH ROW EXECUTE FUNCTION update_scripts_updated_at();

