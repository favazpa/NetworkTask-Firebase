import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import messaging from '@react-native-firebase/messaging';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alerts';
import { requestUserPermission } from '../../shared/utils/common';

type Nav = ReturnType<typeof useNavigation>;

export default function HomeScreen() {
  const navigation = useNavigation() as Nav;

  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const unseenCount = useAlertStore(s => s.unseenCount);
  const latestTitle = useAlertStore(s => s.latestTitle);
  const latestBody = useAlertStore(s => s.latestBody);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setNotification('🎉 Welcome back!');
      setTimeout(() => setNotification(null), 2500);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (!enabled) requestUserPermission();
      });
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const openChat = () => {
    navigation.navigate('Chat' as never);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Ionicons name="person-circle-outline" size={64} color="#009BFF" />
        <Text style={styles.title}>Network International</Text>
        <Text style={styles.subtitle}>Welcome</Text>

        <View style={styles.userInfo}>
          <Text style={styles.label}>Logged in as</Text>
          <Text style={styles.email}>{user?.email ?? '-'}</Text>
        </View>

        {/* ---- Chat entry ---- */}
        <TouchableOpacity
          onPress={openChat}
          activeOpacity={0.9}
          style={styles.chatTile}
        >
          <View style={styles.chatLeft}>
            <View style={styles.chatIconWrap}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#009BFF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatTitle}>Open Global Chat</Text>
              <Text numberOfLines={1} style={styles.chatSubtitle}>
                {latestTitle || latestBody
                  ? `${latestTitle ?? ''} ${latestBody ?? ''}`.trim()
                  : 'No new messages'}
              </Text>
            </View>
          </View>

          <View style={styles.chatRight}>
            {unseenCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unseenCount}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color="#9aa3a7" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color="#000" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {notification && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{notification}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#141414',
    padding: 24,
    borderRadius: 16,
    borderColor: '#1e1e1e',
    borderWidth: 1,
    alignItems: 'center',
    gap: 14,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 2 },

  userInfo: { marginTop: 6, alignItems: 'center' },
  label: { color: '#999', fontSize: 13 },
  email: { color: '#eee', fontSize: 16, fontWeight: '600', marginTop: 2 },

  // Chat entry tile
  chatTile: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#101214',
    borderColor: '#1c2b36',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  chatIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    backgroundColor: '#0E0E0E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  chatSubtitle: { color: '#9aa3a7', fontSize: 12, marginTop: 2 },

  chatRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    backgroundColor: '#009BFF',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#000', fontSize: 12, fontWeight: '800' },

  logoutBtn: {
    marginTop: 8,
    backgroundColor: '#009BFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: { color: '#000', fontWeight: '600', fontSize: 15 },

  toast: {
    position: 'absolute',
    bottom: Platform.select({ ios: 40, android: 20 }),
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  toastText: { color: '#fff', fontSize: 14 },
});
