import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import colors from '../../shared/theme/colors';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';
import type { RootStackParamList } from '../../navigation/types';
import { Button, Input } from '../../shared/components';
import Ionicons from '@react-native-vector-icons/ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { loginWithPassword, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(t('auth.pleaseFillFields'), t('auth.pleaseFillFields'));
      return;
    }
    
    try {
      await loginWithPassword({ email, password });
    } catch (e: any) {
      Alert.alert(t('auth.loginFailed'), e?.message ?? t('auth.loginFailed'));
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="sparkles" size={28} color={colors.accent} />
          <Text style={styles.title}>Network International</Text>
          <Text style={styles.subtitle}>{t('auth.login')}</Text>
        </View>

        {/* Email */}
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.email')}
          type="email"
          icon="mail-outline"
        />

        {/* Password */}
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.password')}
          type="password"
          icon="lock-closed-outline"
        />

        {/* Login button */}
        <Button
          title={t('auth.login')}
          onPress={onLogin}
          loading={isLoading}
          disabled={isLoading}
        />

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.hr} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.hr} />
        </View>

        {/* Signup button */}
        <Button
          title={t('auth.signup')}
          onPress={() => navigation.navigate('Signup')}
          variant="ghost"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 16 
  },
  title: { 
    color: colors.text, 
    fontSize: 20, 
    fontWeight: '700', 
    marginTop: 4 
  },
  subtitle: { 
    color: colors.sub, 
    fontSize: 14, 
    marginTop: 2 
  },
  divider: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 14 
  },
  hr: { 
    flex: 1, 
    height: 1, 
    backgroundColor: colors.border 
  },
  dividerText: { 
    color: colors.sub, 
    marginHorizontal: 8 
  },
});
