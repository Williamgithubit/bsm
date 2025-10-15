const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

// Utility to create Firestore notification document
async function createNotificationDoc(payload) {
  const docRef = await db.collection('notifications').add({
    ...payload,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return docRef.id;
}

// Send FCM message to a topic or tokens
async function sendFcm(tokens, message) {
  if (!tokens || tokens.length === 0) return;
  const payload = {
    notification: {
      title: message.title,
      body: message.body
    },
    data: message.data || {}
  };
  try {
    const res = await messaging.sendToDevice(tokens, payload);
    console.log('FCM send result', res);
  } catch (err) {
    console.error('FCM send error', err);
  }
}

// Trigger: new athlete created
exports.onNewAthlete = functions.firestore.document('athletes/{athleteId}').onCreate(async (snap, context) => {
  const athlete = snap.data();
  const title = `New Athlete Registered: ${athlete.name}`;
  const body = `${athlete.position || 'Player'}, ${athlete.county || ''}`;

  // Create notification doc for admins/managers
  await createNotificationDoc({
    type: 'athlete',
    title,
    body,
    data: { athleteId: context.params.athleteId },
    recipientRole: 'admin'
  });

  // Optionally, send FCM to admin tokens stored in /fcmTokens collection
  const tokensSnap = await db.collection('fcmTokens').where('role', '==', 'admin').get();
  const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean);
  await sendFcm(tokens, { title, body, data: { athleteId: context.params.athleteId } });
});

// Trigger: new blog comment created
exports.onNewBlogComment = functions.firestore.document('blogComments/{commentId}').onCreate(async (snap, context) => {
  const comment = snap.data();
  const title = `New comment on ${comment.postTitle || 'a post'}`;
  const body = `${comment.authorName || 'Someone'}: ${comment.text ? comment.text.substring(0, 80) : ''}`;

  // Create Firestore notification
  await createNotificationDoc({
    type: 'blog',
    title,
    body,
    data: { postId: comment.postId, commentId: context.params.commentId },
    recipientRole: 'admin'
  });

  // Send FCM to admins and post author if tokens exist
  const tokensSnap = await db.collection('fcmTokens').where('role', 'in', ['admin','media']).get();
  const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean);
  await sendFcm(tokens, { title, body, data: { postId: comment.postId, commentId: context.params.commentId } });
});

