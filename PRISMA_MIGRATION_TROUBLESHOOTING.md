# Prisma Migration Troubleshooting

## Common Issue: Migrations Stuck or Timing Out

### Problem
Prisma migrations use the **connection pooler** (port 6543), which can cause migrations to hang or fail.

### Solution: Use Direct Connection for Migrations

Prisma migrations **must use the direct database connection** (port 5432), not the pooler (port 6543).

## Step-by-Step Fix

### 1. Get Your Direct Connection String

In Supabase Dashboard:
1. Go to **Project Settings** → **Database**
2. Under **Connection string**, select **URI** mode
3. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

4. **Convert it to direct connection:**
   - Change `postgres.[PROJECT-REF]` → `postgres`
   - Change port `6543` → `5432`
   - Change host from `aws-0-[REGION].pooler.supabase.com` → `db.[PROJECT-REF].supabase.co`
   
   **Direct connection format:**
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 2. Update .env.local

Create or update `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database URL for Prisma (DIRECT connection for migrations)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Optional: Connection Pooler (for application use, not migrations)
# DATABASE_URL_POOLER=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Important:** Replace:
- `[PASSWORD]` with your database password
- `[PROJECT-REF]` with your project reference ID

### 3. Test Connection

Before running migrations, test the connection:

```bash
npm run db:test
```

If this works, your connection string is correct.

### 4. Run Migration

```bash
npm run prisma:migrate
```

If prompted for a migration name, enter: `init` or `add_user_table`

### 5. Alternative: Manual Migration

If migrations still fail, you can create the table manually in Supabase:

#### Option A: SQL Editor in Supabase

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Paste this SQL:

```sql
-- Create enum type
CREATE TYPE "UserRole" AS ENUM ('subscriber', 'admin');

-- Create users table
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'subscriber',
    "image" TEXT,
    "supabase_id" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_supabase_id_key" ON "users"("supabase_id");
```

4. Click **Run**

#### Option B: Mark Migration as Applied

After creating the table manually, mark the migration as applied:

```bash
npx prisma migrate resolve --applied add_user_roles_and_metadata
```

Then generate the Prisma client:

```bash
npm run prisma:generate
```

## Why This Happens

- **Connection Pooler (6543)**: Optimized for many concurrent connections, but has limitations for migrations
- **Direct Connection (5432)**: Full PostgreSQL features, required for schema changes

## After Migration Succeeds

Once migrations work:
- ✅ Your `users` table will exist
- ✅ User sync will work on OAuth callback
- ✅ You can use the pooler connection in your app code (optional)

## Quick Checklist

- [ ] Using direct connection (port 5432) in `.env.local`
- [ ] DATABASE_URL has correct password and project ref
- [ ] Tested connection with `npm run db:test`
- [ ] No other processes using the database
- [ ] Migration completes successfully
- [ ] Prisma client generated: `npm run prisma:generate`

