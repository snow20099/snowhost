# SnowHost Setup Guide

## Quick Fix for Dashboard Issues

The dashboard data loading failure is caused by missing environment variables. Follow these steps to fix it:

### 1. Create Environment File

Copy the `env.example` file to `.env.local` in your project root:

```bash
cp env.example .env.local
```

### 2. Configure Required Environment Variables

Edit `.env.local` and set these **required** variables:

```env
# NextAuth Configuration (REQUIRED)
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/snowhost
```

### 3. Optional Environment Variables

These are optional but recommended for full functionality:

```env
# Google OAuth (for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Discord OAuth (for Discord login)
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Restart Your Development Server

After creating `.env.local`, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## What Was Fixed

1. **Duplicate Schema Indexes**: Removed duplicate Mongoose index definitions that were causing warnings
2. **Environment Variable Handling**: Added graceful fallbacks for missing environment variables
3. **Better Error Messages**: Improved error handling with Arabic and English messages
4. **TypeScript Errors**: Fixed null/undefined object access issues
5. **Authentication Flow**: Enhanced NextAuth configuration with better error handling

## Troubleshooting

### If you still get "Failed to load dashboard data":

1. Check that `.env.local` exists and has the correct values
2. Ensure MongoDB is running locally (or update MONGODB_URI to your actual database)
3. Check the browser console and server logs for detailed error messages
4. Try logging out and logging back in

### MongoDB Connection Issues:

- Make sure MongoDB is running on your system
- Check that the connection string in MONGODB_URI is correct
- For local development: `mongodb://localhost:27017/snowhost`
- For cloud databases: `mongodb+srv://username:password@cluster.mongodb.net/database`

## Development Notes

- The application now uses fallback values for missing environment variables
- Authentication will work with the fallback secret (change in production!)
- MongoDB will attempt to connect to localhost if no URI is provided
- All OAuth providers are optional and will be disabled if credentials are missing 