# Authentication Setup Guide

## Overview

The application uses Supabase Auth with OAuth providers (Google, Discord, Facebook) and email/password authentication. Users are automatically assigned the `subscriber` role by default and are synced to your Prisma database.

## Features

- ✅ Email/Password authentication
- ✅ OAuth providers: Google, Discord, Facebook
- ✅ Role-based access control (subscriber, admin)
- ✅ Protected routes
- ✅ Automatic user sync to database
- ✅ Session management

## Route Protection

### Subscriber Routes
- `/dashboard` - Accessible to subscribers and admins
- `/account` - Accessible to subscribers and admins

### Admin Routes
- `/admin/*` - Accessible only to admins

## Setting Up OAuth Providers

### 1. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Add authorized redirect URI:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** and **Client Secret**
7. In Supabase Dashboard → **Authentication** → **Providers** → **Google**
8. Enable Google provider and paste credentials

### 2. Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to **OAuth2** section
4. Add redirect URI:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
5. Copy **Client ID** and **Client Secret**
6. In Supabase Dashboard → **Authentication** → **Providers** → **Discord**
7. Enable Discord provider and paste credentials

### 3. Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add **Facebook Login** product
4. Go to **Settings** → **Basic**
5. Add authorized redirect URI:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
6. Copy **App ID** and **App Secret**
7. In Supabase Dashboard → **Authentication** → **Providers** → **Facebook**
8. Enable Facebook provider and paste credentials

## Default User Role

All new users are automatically assigned the `subscriber` role when they sign up. To promote a user to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Or use Prisma Studio:
```bash
npm run prisma:studio
```

## User Metadata

The system stores user metadata from OAuth providers:
- **name** - User's full name
- **image** - Profile picture URL
- **metadata** - JSON field with additional provider-specific data

## Testing Authentication

1. **Sign up with email/password**: Visit `/signin` and use the Sign Up tab
2. **OAuth login**: Click any OAuth provider button on `/signin` page
3. **Protected routes**: Try accessing `/dashboard` or `/account` when logged out (should redirect to sign in)
4. **Admin access**: Try accessing `/admin/*` as a subscriber (should redirect to dashboard)

## Environment Variables

Make sure your `.env.local` includes:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string
```

## Database Schema

After running migrations, your `users` table will have:
- `id` - UUID primary key
- `email` - Unique email address
- `name` - User's name
- `role` - Enum: `subscriber` (default) or `admin`
- `image` - Profile picture URL
- `supabaseId` - Unique Supabase user ID
- `metadata` - JSON field for additional data
- `createdAt` / `updatedAt` - Timestamps

## Troubleshooting

### OAuth not working
- Verify redirect URIs match exactly
- Check that providers are enabled in Supabase
- Ensure credentials are correct

### Users not syncing to database
- Check that `syncUserToDatabase` is called in `/api/auth/callback`
- Verify Prisma client is generated: `npm run prisma:generate`
- Check database connection: `npm run db:test`

### Role checks not working
- Ensure user exists in database with correct role
- Check that `getUserWithRole` is working correctly
- Verify middleware is running (check browser console)

