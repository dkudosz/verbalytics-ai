# Enable OAuth Providers in Supabase

## Quick Steps

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Enable the providers you want to use (Google, Discord, Facebook)
5. Configure each provider with the required credentials

## Detailed Instructions

### Step 1: Access Provider Settings

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Click on your project
3. In the left sidebar, go to **Authentication**
4. Click on **Providers** tab

### Step 2: Enable Google OAuth

1. Scroll down to **Google** provider
2. Toggle the switch to **Enabled**
3. You'll need:
   - **Client ID (for OAuth)** from Google Cloud Console
   - **Client Secret (for OAuth)** from Google Cloud Console
4. If you don't have these yet, see **Setting Up Google OAuth** below

### Step 3: Enable Discord OAuth

1. Scroll down to **Discord** provider
2. Toggle the switch to **Enabled**
3. You'll need:
   - **Client ID** from Discord Developer Portal
   - **Client Secret** from Discord Developer Portal
4. If you don't have these yet, see **Setting Up Discord OAuth** below

### Step 4: Enable Facebook OAuth

1. Scroll down to **Facebook** provider
2. Toggle the switch to **Enabled**
3. You'll need:
   - **Application ID** from Facebook Developers
   - **Application Secret** from Facebook Developers
4. If you don't have these yet, see **Setting Up Facebook OAuth** below

### Step 5: Configure Redirect URLs

For each provider, you'll need to add this redirect URL in their respective developer portals:

```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

Replace `[YOUR-PROJECT-REF]` with your Supabase project reference ID (found in your project URL).

---

## Setting Up Google OAuth

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name and click **Create**

### 2. Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen first:
   - Choose **External** user type
   - Fill in app name, user support email
   - Add your email in **Developer contact information**
   - Click **Save and Continue** through the steps
4. Back to credentials:
   - **Application type**: Web application
   - **Name**: Your app name
   - **Authorized redirect URIs**: Add:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     ```
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 4. Add to Supabase

1. In Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste **Client ID** and **Client Secret**
3. Toggle **Enabled** to ON
4. Click **Save**

---

## Setting Up Discord OAuth

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Enter application name and click **Create**

### 2. Configure OAuth2

1. In your application, go to **OAuth2** in the left sidebar
2. Under **Redirects**, click **Add Redirect**
3. Add this URL:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
4. Copy the **Client ID**
5. Click **Reset Secret** and copy the **Client Secret** (save it now, you won't see it again!)

### 3. Add to Supabase

1. In Supabase Dashboard → **Authentication** → **Providers** → **Discord**
2. Paste **Client ID** and **Client Secret**
3. Toggle **Enabled** to ON
4. Click **Save**

---

## Setting Up Facebook OAuth

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Choose **Consumer** app type
4. Fill in app details and click **Create App**

### 2. Add Facebook Login

1. In your app dashboard, find **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Skip the quick start

### 3. Configure Settings

1. Go to **Settings** → **Basic**
2. Copy **App ID** and **App Secret**
3. Add **App Domains** (if needed):
   ```
   [YOUR-PROJECT-REF].supabase.co
   ```
4. Under **Facebook Login** → **Settings**:
   - Add **Valid OAuth Redirect URIs**:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     ```

### 4. Add to Supabase

1. In Supabase Dashboard → **Authentication** → **Providers** → **Facebook**
2. Paste **App ID** and **App Secret**
3. Toggle **Enabled** to ON
4. Click **Save**

---

## Find Your Project Reference ID

Your Supabase project reference ID is in your project URL:
- Project URL looks like: `https://abcdefghijklmnop.supabase.co`
- Your project ref is: `abcdefghijklmnop`

Or find it in Supabase Dashboard → **Settings** → **General** → **Reference ID**

---

## Testing

After enabling providers:

1. Go to your app's sign-in page: `/signin`
2. Click on any OAuth provider button
3. You should be redirected to that provider's login page
4. After logging in, you'll be redirected back to your app

## Troubleshooting

### "Provider is not enabled" error
- Make sure you've toggled the provider to **Enabled** in Supabase
- Refresh the page and try again

### Redirect URI mismatch
- Ensure the redirect URI in the provider's settings matches exactly:
  ```
  https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
  ```
- Check for typos or extra spaces

### Credentials not working
- Verify you copied the correct Client ID and Secret
- Make sure secrets are current (not expired)
- Check that the OAuth consent screen is configured (for Google)

---

## Quick Enable (Without Full Setup)

If you want to test without full OAuth setup, you can still use email/password authentication. The OAuth buttons will show an error until providers are configured.

To temporarily hide OAuth buttons, edit `src/app/signin/page.tsx` and comment out the OAuth button section.

