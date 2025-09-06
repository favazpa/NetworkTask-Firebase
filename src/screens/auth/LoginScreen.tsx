import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import colors from '../../shared/theme/colors';
import { useAuthStore } from '../../store/authStore';
import type { RootStackParamList } from '../../navigation/types';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SCREEN_NAMES } from '../../navigation/routes';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const loginWithPassword = useAuthStore(s => s.loginWithPassword);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setSubmitting(true);
    try {
      // Call Firebase-backed login from Zustand store
      await loginWithPassword(email, password);

      // Navigate to app
      // navigation.replace(SCREEN_NAMES.Home);
    } catch (e: any) {
      Alert.alert('Login failed', e?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="sparkles" size={28} color={colors.accent} />
          <Text style={styles.title}>Network International</Text>
          <Text style={styles.subtitle}>Login</Text>
        </View>

        {/* Email */}
        <View style={styles.inputWrap}>
          <Ionicons
            name="mail-outline"
            size={18}
            color={colors.sub}
            style={styles.inputIcon}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={'Email'}
            placeholderTextColor={colors.sub}
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrap}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.sub}
            style={styles.inputIcon}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder={'Password'}
            placeholderTextColor={colors.sub}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(s => !s)}
            style={styles.trailing}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.sub}
            />
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity
          disabled={submitting}
          onPress={onLogin}
          style={[styles.btnPrimary, submitting && { opacity: 0.7 }]}
        >
          {submitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnPrimaryText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.hr} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.hr} />
        </View>

        {/* Signup button */}
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREEN_NAMES.Signup)}
          style={styles.btnGhost}
        >
          <Text style={styles.btnGhostText}>Signup</Text>
        </TouchableOpacity>
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
  header: { alignItems: 'center', marginBottom: 16 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 4 },
  subtitle: { color: colors.sub, fontSize: 14, marginTop: 2 },

  inputWrap: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: colors.text },
  trailing: { paddingLeft: 8 },

  btnPrimary: {
    backgroundColor: colors.accent,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnPrimaryText: { color: '#000', fontWeight: '700', fontSize: 16 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  hr: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.sub, marginHorizontal: 8 },

  btnGhost: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
  },
  btnGhostText: { color: colors.text, fontWeight: '600' },

  hint: { color: colors.sub, textAlign: 'center', marginTop: 12 },
});
