// Example: request FCM permission, get token, and save to Firestore under `fcmTokens/{uid}`
import { getMessaging, getToken, onMessage, MessagePayload } from "firebase/messaging";
import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function registerFcmToken(
  uid: string,
  vapidKey: string,
  role = "user"
) {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey });
    if (!token) return null;
    await setDoc(doc(db, "fcmTokens", token), {
      uid,
      token,
      role,
      createdAt: serverTimestamp(),
    });
    return token;
  } catch (err) {
    console.error("registerFcmToken error", err);
    return null;
  }
}

export function onForegroundMessage(handler: (payload: MessagePayload) => void) {
  const messaging = getMessaging();
  onMessage(messaging, (payload) => {
    handler(payload);
  });
}
