import Config from 'react-native-config';

export async function notifyTopic(params: {
  title: string;
  body: string;
  type: 'text' | 'gift';
  senderId: string;
}) {
  try {
    await fetch(Config.NOTIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-key': Config.APP_KEY,
      },
      body: JSON.stringify(params),
    });
  } catch (e) {
    console.log('notify error', e);
  }
}
