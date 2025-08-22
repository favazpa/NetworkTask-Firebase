import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { notifyTopic } from '../../../services/notifications/notify';

const MESSAGES = firestore()
  .collection('rooms')
  .doc('global')
  .collection('messages');

export async function sendMessage(text: string) {
  const u = auth().currentUser;
  if (!u) return;
  const clean = text.trim();
  if (!clean) return;

  // 1) write to Firestore
  await MESSAGES.add({
    text: clean,
    type: 'text',
    senderId: u.uid,
    senderEmail: u.email || '',
    senderName: u.displayName || null,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  // 2) fire-and-forget push to topic (don’t await for UI responsiveness)
  notifyTopic({
    title: 'New Message',
    body: clean,
    type: 'text',
    senderId: u.uid,
  });
}

export async function sendGift() {
  const u = auth().currentUser;
  if (!u) return;

  await MESSAGES.add({
    text: 'sent a gift 🎁',
    type: 'gift',
    senderId: u.uid,
    senderEmail: u.email || '',
    senderName: u.displayName || null,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  notifyTopic({
    title: '🎁 Gift received',
    body: `${u.email || 'Someone'} sent a gift`,
    type: 'gift',
    senderId: u.uid,
  });
}
