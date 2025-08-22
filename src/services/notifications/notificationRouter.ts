import { goToChat } from '../../navigation/navigationRef';

type NotiData = {
  roomId?: string;
  screen?: string;
  type?: string;
};

export function routeFromNotificationData(data?: NotiData | null) {
  if (!data) return;

  if (data.screen === 'Chat') {
    return goToChat();
  }

  if (
    data.roomId === 'global' ||
    data.type === 'text' ||
    data.type === 'gift'
  ) {
    return goToChat();
  }
}
