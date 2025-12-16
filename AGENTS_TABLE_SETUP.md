# Agents Table Setup Instructions

## Overview
This document explains how to set up the agents table and functionality that was just added to the application.

## Files Created/Modified

### Database Schema
- **prisma/schema.prisma** - Added `Agent` model with relationship to `User`
- **prisma/migrations/manual_create_agents_table.sql** - SQL migration to create the agents table

### API Routes
- **src/app/api/agents/route.ts** - GET (fetch agents) and DELETE (delete agent) endpoints
- **src/app/api/agents/upload/route.ts** - Updated to save CSV data to database

### Components
- **src/components/dashboard/AgentsTable.tsx** - Table component displaying agents with delete functionality
- **src/components/dashboard/CsvUploadWrapper.tsx** - Wrapper connecting upload and table refresh
- **src/components/dashboard/CsvUpload.tsx** - Updated to trigger table refresh after upload

### Pages
- **src/app/dashboard/agents/page.tsx** - Updated to display agents table

## Setup Steps

### 1. Run the Database Migration

You have two options:

#### Option A: Run SQL Migration Manually (Recommended)
1. Go to your Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `prisma/migrations/manual_create_agents_table.sql`
4. Click **Run**

#### Option B: Use Prisma Migrate
```bash
npm run prisma:migrate
```
When prompted, enter migration name: `create_agents_table`

**Note:** Make sure you're using the direct database connection (port 5432) in your `.env.local` file for migrations. See `PRISMA_MIGRATION_TROUBLESHOOTING.md` for details.

### 2. Generate Prisma Client

After the migration is complete, regenerate the Prisma client:

```bash
npm run prisma:generate
```

This will update the Prisma client to include the new `Agent` model, which will resolve the TypeScript errors.

### 3. Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard/agents`
3. You should see:
   - CSV upload component
   - Agents table (empty initially)
   - Download example CSV button

## Database Schema

The `agents` table has the following structure:

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `agent_id` (TEXT, required) - Unique per user
- `agent_name` (TEXT, required)
- `agent_surname` (TEXT, required)
- `agent_email` (TEXT, required)
- `agent_phone` (TEXT, optional)
- `agent_slack` (TEXT, optional)
- `agent_discord` (TEXT, optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Constraints:**
- Unique constraint on `(user_id, agent_id)` - prevents duplicate agent IDs per user
- Foreign key to `users` table with CASCADE delete
- Indexes on `user_id` and `agent_email` for performance

## Features

### CSV Upload
- Validates CSV format against expected columns
- Validates required fields (agentId, agentName, agentSurname, agentEmail)
- Validates email format
- Updates existing agents if agentId already exists for the user
- Creates new agents if agentId doesn't exist
- Links all agents to the current authenticated user

### Agents Table
- Displays all agents for the current user
- Shows all agent details in a table format
- Delete button with confirmation dialog for each agent
- Auto-refreshes after CSV upload
- Loading states during operations

### Delete Functionality
- Confirmation dialog before deletion
- Verifies agent belongs to current user before deletion
- Shows loading spinner during deletion
- Refreshes table after successful deletion

## Troubleshooting

### TypeScript Errors
If you see errors like "Property 'agent' does not exist on type 'PrismaClient'":
1. Make sure you've run the database migration
2. Run `npm run prisma:generate` to regenerate the Prisma client
3. Restart your TypeScript server in your IDE

### Migration Issues
If migrations fail, refer to `PRISMA_MIGRATION_TROUBLESHOOTING.md` for common solutions.

### Database Connection
Ensure your `.env.local` has the correct `DATABASE_URL` with:
- Direct connection (port 5432) for migrations
- Correct password and project reference

