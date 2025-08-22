import { create } from 'zustand';

type AlertState = {
  unseenCount: number;
  latestTitle: string | null;
  latestBody: string | null;
  markAllSeen: () => void;
  receiveAlert: (title?: string | null, body?: string | null) => void;
};

export const useAlertStore = create<AlertState>(set => ({
  unseenCount: 0,
  latestTitle: null,
  latestBody: null,
  markAllSeen: () => set({ unseenCount: 0 }),
  receiveAlert: (title, body) =>
    set(s => ({
      unseenCount: s.unseenCount + 1,
      latestTitle: title ?? null,
      latestBody: body ?? null,
    })),
}));
