import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';

export type ChatMsg = {
  id: string;
  text: string;
  type: 'text' | 'gift';
  senderId: string;
  senderEmail: string;
  senderName?: string | null;
  createdAt?: FirebaseFirestoreTypes.Timestamp | null;
};

const COL = firestore()
  .collection('rooms')
  .doc('global')
  .collection('messages');

export default function useGlobalMessages(pageSize = 40) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const lastDocRef =
    useRef<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);

  // Realtime head (latest page)
  useEffect(() => {
    //q represents query
    const q = COL.orderBy('createdAt', 'desc').limit(pageSize);
    const unsub = q.onSnapshot(snap => {
      const docs = snap.docs;
      if (docs.length > 0) lastDocRef.current = docs[docs.length - 1];
      setMsgs(docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      setLoading(false);
    });
    return unsub;
  }, [pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || reachedEnd || !lastDocRef.current) return;
    setLoadingMore(true);
    try {
      const q = COL.orderBy('createdAt', 'desc')
        .startAfter(lastDocRef.current)
        .limit(pageSize);

      const snap = await q.get();
      if (snap.empty) {
        setReachedEnd(true);
      } else {
        const more = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        // append to the **end** because list is inverted
        setMsgs(prev => [...prev, ...more]);
        lastDocRef.current = snap.docs[snap.docs.length - 1];
      }
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, reachedEnd]);

  return { msgs, loading, loadMore, loadingMore, reachedEnd };
}
