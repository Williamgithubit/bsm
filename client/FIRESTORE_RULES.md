# Firestore Security Rules for Notifications

Below is an example Firestore rules snippet to protect the `notifications` collection and restrict access by user role.

Rules (add to your Firestore rules in the Firebase console):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /notifications/{notifId} {
      allow create: if request.auth != null && (
        // any authenticated user can create notifications (or limit by role)
        request.auth.token.role in ['admin','manager','media']
      );

      allow read: if request.auth != null && (
        // admins can read all
        request.auth.token.role == 'admin' ||
        // managers & media can read types relevant to them
        (
          request.auth.token.role == 'manager' && resource.data.recipientRole in ['manager','admin','all']
        ) ||
        (
          request.auth.token.role == 'media' && resource.data.recipientRole in ['media','admin','all']
        )
      );

      allow update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }

    // other rules ...
  }
}
```

Notes:

- This relies on custom claims set in Firebase Authentication (e.g., role claim). Set claims on the server (admin SDK) when creating/updating users.
- Adjust rules to your exact role and recipientRole naming.
