export type InAppNotice = {
  id?: string;
  title?: string;
  message: string;
  icon?: 'chat' | 'gift' | 'info';
  durationMs?: number;
  data?: Record<string, string>;      
  onPress?: () => void;
};

type Listener = (n: InAppNotice) => void;
let listeners: Listener[] = [];

export function showInAppNotification(n: InAppNotice) {
  listeners.forEach(l => l(n));
}

export function subscribeInApp(l: Listener) {
  listeners.push(l);
  return () => { listeners = listeners.filter(x => x !== l); };
}
