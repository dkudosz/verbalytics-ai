# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for the database to be set up

## 2. Get Your Credentials

### API Keys
1. Go to Project Settings → API
2. Copy your **Project URL** and **anon/public key**

### Database Connection String
1. Go to Project Settings → Database
2. Under "Connection string", select "URI" mode
3. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

## 3. Create `.env.local` File

Create a `.env.local` file in the root of your project with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database URL for Prisma (Supabase Postgres Connection String)
# Use DIRECT connection for migrations (port 5432)
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Getting Your Database Connection String

1. Go to **Project Settings → Database**
2. Under **Connection string**, select **URI** mode
3. Copy the connection string - it will look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
4. **IMPORTANT**: For Prisma migrations, you need to use the **DIRECT connection** format:
   - Change `postgres.[PROJECT-REF]` to just `postgres`
   - Change port `6543` to `5432`
   - Change host from `aws-0-[REGION].pooler.supabase.com` to `db.[PROJECT-REF].supabase.co`
   
   Final format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Alternative: Get Direct Connection String

1. In Supabase Dashboard → **Project Settings → Database**
2. Scroll to **Connection string** section
3. Look for **Direct connection** or **Session mode** (not Transaction mode)
4. Copy that connection string directly

**Troubleshooting Connection Issues:**

- Make sure your database password doesn't contain special characters that need URL encoding
- If your password has special characters, URL encode them (e.g., `@` becomes `%40`, `#` becomes `%23`)
- Verify your project is active in Supabase dashboard
- Check that you're using the correct project reference ID from your Supabase URL

## 4. Run Prisma Migrations

After setting up your `.env.local` file:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## 5. Usage

### Client Components (Browser)
```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data } = await supabase.from("users").select();
```

### Server Components / Server Actions
```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data } = await supabase.from("users").select();
```

