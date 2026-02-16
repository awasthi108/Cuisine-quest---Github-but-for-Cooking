# Firestore Security Rules Deployment Guide

## Problem
If you see the error: **"Missing or insufficient permissions"** (code: `permission-denied`), it means Firestore security rules have not been deployed.

## Solution: Deploy Rules in Firebase Console

Follow these exact steps:

### Step 1: Open Firebase Console
- Visit https://console.firebase.google.com
- Sign in with your Google account
- Select your "cuisine-quest" project

### Step 2: Navigate to Firestore Rules
- Click **Firestore Database** (in left sidebar)
- Click the **Rules** tab (at the top)

### Step 3: Update Rules
You should see a rules editor. **Clear all existing content** and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own user documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow authenticated users to create food blogs
    match /foodBlogs/{document=**} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if true;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    // Allow authenticated users to manage follows
    match /follows/{document=**} {
      allow create, read, write: if request.auth != null;
    }
  }
}
```

### Step 4: Publish Rules
- Click the **Publish** button (bottom right)
- Wait for confirmation message

### Step 5: Test
- Refresh your browser (Ctrl+R or Cmd+R)
- Try creating a food blog again
- The permission error should be gone!

## What These Rules Allow

- **Food Blogs**: Anyone can read all blogs. Logged-in users can create blogs (must own them to edit/delete)
- **Follows**: Logged-in users can follow/unfollow other users
- **User Profiles**: Users can only read/write their own profile data

## Still Not Working?

1. **Hard refresh browser**: Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Check you're logged in**: Make sure you're authenticated with email/password or Google
3. **Verify project ID**: Go to Firebase project settings and confirm `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in Vercel matches
4. **Wait 30 seconds**: Rules can take time to propagate

## Need Help?

See [Firebase Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
