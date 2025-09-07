import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useNotificationsStore } from '../../store/notificationsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettingsStore } from '../../store/settingsStore';
import { sendTestNotification } from '../../services/notifications/testNotifications';
import colors from '../../shared/theme/colors';

export default function SettingsScreen() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const clearCart = useCartStore(s => s.clearCart);
  const clearAllNotifications = useNotificationsStore(s => s.clearAllNotifications);
  const { t, toggleLanguage, isRTL, currentLanguage } = useTranslation();
  const { pushNotificationsEnabled, setPushNotificationsEnabled } = useSettingsStore();

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirmation'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: () => {
            clearCart();
            clearAllNotifications();
            logout();
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      t('settings.clearAllData'),
      t('settings.clearDataConfirmation'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCart();
            clearAllNotifications();
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleTestNotification = () => {
    if (!pushNotificationsEnabled) {
      Alert.alert('Notifications Disabled', 'Please enable push notifications first to send test notifications.');
      return;
    }
    
    sendTestNotification();
  };


  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightComponent,
    showArrow = true,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color={colors.accent} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={16} color={colors.sub} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      {/* Header */}

      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
        
        <View style={styles.userCard}>
          <View style={styles.userIcon}>
            <Ionicons name="person-circle-outline" size={48} color={colors.accent} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.username || 'User'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
        
        <SettingItem
          icon="notifications-outline"
          title={t('settings.pushNotifications')}
          subtitle={t('settings.pushNotificationsDescription')}
          rightComponent={
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={pushNotificationsEnabled ? '#fff' : colors.sub}
            />
          }
          showArrow={false}
        />
        
        <SettingItem
          icon="language-outline"
          title={t('settings.languageDirection')}
          subtitle={t('settings.languageDescription')}
          rightComponent={
            <Switch
              value={currentLanguage === 'ar'}
              onValueChange={toggleLanguage}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={currentLanguage === 'ar' ? '#fff' : colors.sub}
            />
          }
          showArrow={false}
        />
      </View>

      {/* App Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.app')}</Text>
        
        <SettingItem
          icon="information-circle-outline"
          title={t('settings.about')}
          subtitle="App version and information"
          onPress={() => Alert.alert('About', 'NetworkTask E-commerce App\nVersion 1.0.0')}
        />
        
        <SettingItem
          icon="help-circle-outline"
          title={t('settings.helpSupport')}
          subtitle="Get help and contact support"
          onPress={() => Alert.alert('Help', 'For support, please contact us at support@networktask.com')}
        />
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.dataManagement')}</Text>
        
        <SettingItem
          icon="notifications-outline"
          title="Test Notification"
          subtitle="Send a test notification to verify the system"
          onPress={handleTestNotification}
        />
        
        <SettingItem
          icon="trash-outline"
          title={t('settings.clearAllData')}
          subtitle={t('settings.clearAllDataDescription')}
          onPress={handleClearData}
        />
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>{t('settings.logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 60, android: 20 }),
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userIcon: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: colors.sub,
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: colors.sub,
    fontSize: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
