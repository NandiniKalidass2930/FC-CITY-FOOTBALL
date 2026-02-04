# Contact Form Setup Guide

## ⚠️ IMPORTANT: If you see "Server configuration error"

This means `SANITY_API_WRITE_TOKEN` is not configured. Follow these steps:

### Quick Fix (3 Steps):

1. **Open `.env.local` file** in your project root (same folder as `package.json`)
2. **Add this line** (replace with your actual token):
   ```
   SANITY_API_WRITE_TOKEN=sk_your_actual_token_here
   ```
3. **Restart your development server**:
   - Press `Ctrl+C` to stop
   - Run `npm run dev` again

### Verify Setup:
Visit: `http://localhost:3000/api/contact/test` to check if token is configured.

---

## Step-by-Step Instructions to Enable Contact Form Storage in Sanity

### Step 1: Get Your Sanity Write Token

1. Go to [https://sanity.io/manage](https://sanity.io/manage)
2. Log in to your Sanity account
3. Select your project (the one with project ID: `vumt2wwt`)
4. Navigate to **API** → **Tokens** in the left sidebar
5. Click **"Add API token"** or **"Create token"**
6. Configure the token:
   - **Name**: "Contact Form Write Token" (or any name you prefer)
   - **Permissions**: Select **"Editor"** (this allows creating documents)
   - Click **"Save"**
7. **Copy the token immediately** - you won't be able to see it again!

### Step 2: Create Environment Variable File

1. In your project root directory (same level as `package.json`), create a file named `.env.local`
2. Add the following line to the file:
   ```
   SANITY_API_WRITE_TOKEN=your_token_here
   ```
   Replace `your_token_here` with the token you copied in Step 1.

   Example:
   ```
   SANITY_API_WRITE_TOKEN=skAbCdEf1234567890...
   ```

### Step 3: Restart Development Server

**IMPORTANT**: After creating/updating `.env.local`, you MUST restart your development server:

1. Stop the current server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Verify Setup

1. Fill out the contact form on your website
2. Click "Send Message"
3. You should see a success message (green box)
4. Go to Sanity Studio
5. Navigate to **"Contact Message"** in the left sidebar
6. You should see your submitted message there!

## Troubleshooting

### Still seeing "Server configuration error"?

1. **Check file name**: Make sure it's exactly `.env.local` (not `.env` or `.env.local.txt`)
2. **Check file location**: The file must be in the project root (same folder as `package.json`)
3. **Check token format**: The token should start with `sk` and be a long string
4. **Restart server**: After any changes to `.env.local`, always restart the dev server
5. **Check terminal**: Look for any error messages in your terminal

### Token not working?

1. Verify the token has "Editor" permissions in Sanity
2. Make sure you copied the entire token (they're usually very long)
3. Check there are no extra spaces or quotes around the token in `.env.local`
4. Try creating a new token if the old one doesn't work

### Form submits but nothing appears in Sanity?

1. Check Sanity Studio - make sure you're looking at the correct dataset (`production`)
2. Refresh Sanity Studio
3. Check the browser console for any errors
4. Check the terminal/console where your Next.js server is running for error messages

## Security Notes

- **Never commit `.env.local` to Git** - it's already in `.gitignore`
- **Never share your write token** - it gives full access to create/update documents
- **Use different tokens for development and production** if needed

## Production Deployment

When deploying to production (Vercel, etc.):

1. Go to your hosting platform's environment variables settings
2. Add `SANITY_API_WRITE_TOKEN` with your token value
3. Redeploy your application

For Vercel:
- Go to Project Settings → Environment Variables
- Add `SANITY_API_WRITE_TOKEN`
- Redeploy
