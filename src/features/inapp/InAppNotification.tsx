import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { InAppNotice, subscribeInApp } from './notifyCentre';
import Ionicons from '@react-native-vector-icons/ionicons';
import { routeFromNotificationData } from '../../services/notifications/notificationRouter';

export default function InAppNotification() {
  const [notice, setNotice] = useState<InAppNotice | null>(null);
  const y = useRef(new Animated.Value(-80)).current;
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub = subscribeInApp(n => {
      setNotice(n);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      Animated.timing(y, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      hideTimer.current = setTimeout(hide, n.durationMs ?? 3000);
    });
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      unsub();
    };
  }, [y]);

  const hide = () => {
    Animated.timing(y, {
      toValue: -80,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setNotice(null));
  };

  const handlePress = () => {
    if (!notice) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hide();

    if (notice.onPress) {
      notice.onPress();
    } else if (notice.data) {
      routeFromNotificationData(notice.data as any);
    }
  };

  if (!notice) return null;

  const icon =
    notice.icon === 'gift'
      ? 'gift-outline'
      : notice.icon === 'chat'
      ? 'chatbubble-ellipses-outline'
      : 'notifications-outline';

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY: y }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.card}
      >
        <Ionicons
          name={icon}
          size={18}
          color="#0BA5EC"
          style={{ marginRight: 8 }}
        />
        <View style={{ flex: 1 }}>
          {!!notice.title && <Text style={styles.title}>{notice.title}</Text>}
          <Text style={styles.msg} numberOfLines={2}>
            {notice.message}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: Platform.select({ ios: 64, android: 24 }),
    left: 12,
    right: 12,
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { color: '#E5E7EB', fontWeight: '700', marginBottom: 2, fontSize: 13 },
  msg: { color: '#C7CDD6', fontSize: 13 },
});
