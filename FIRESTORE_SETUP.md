# Firestore Setup Instructions

## Deploying Security Rules

To fix the "PERMISSION_DENIED" error, you need to deploy the Firestore security rules to your Firebase project.

### Option 1: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project "cuisine-quest"
3. Go to **Firestore Database** → **Rules** tab
4. Copy the entire content from `firestore.rules` file in this repository
5. Paste it into the Firebase Console Rules editor
6. Click **Publish**

### Option 2: Using Firebase CLI

If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:rules
```

## Rule Explanation

The security rules in `firestore.rules` allow:
- Any authenticated user to create a new food blog
- Anyone to read all food blogs (public)
- Only the blog author to update or delete their own blog
- Authenticated users to manage follows

Once deployed, the blog creation should work without permission errors.
