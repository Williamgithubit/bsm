How to wire Notifications component into Admin Header

1. Import and render the notifications component in your admin Header (Material UI AppBar):

```tsx
import Notifications from "@/components/admin/Notifications";

function AdminHeader() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* other items */}
        <Notifications />
      </Toolbar>
    </AppBar>
  );
}
```

2. Enable FCM in your Firebase project and provide the VAPID key to the client. Use `requestFcmToken` from `src/services/fcm.ts` to register tokens with your backend and store them with user profiles.

3. Set up server-side logic (Cloud Functions) to send notifications to Firestore and FCM when events occur (likes, comments, new athlete registrations, RSVPs, contact submissions). Each notification document should include `type`, `title`, `body`, `data`, `recipientRole`.

4. Add Firestore security rules from `FIRESTORE_RULES.md` and set custom claims for users.

5. For export and pagination, the component uses `NotificationService.getNotificationsPaginated` and `exportNotificationsCSV`.
