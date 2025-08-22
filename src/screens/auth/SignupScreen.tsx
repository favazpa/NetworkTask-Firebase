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


import Ionicons from '@react-native-vector-icons/ionicons';
import { RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import colors from '../../shared/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const signup = useAuthStore(s => s.signup);
  const logout = useAuthStore(s => s.logout);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSignup = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await signup({ email, password });
      await logout();

      Alert.alert('Success', 'Account created. Please log in.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Signup failed', e?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="person-add-outline" size={28} color={colors.accent} />
          <Text style={styles.title}>signup</Text>
        </View>

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
            placeholder={'email'}
            placeholderTextColor={colors.sub}
            style={styles.input}
          />
        </View>

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
            secureTextEntry
            placeholder={'password'}
            placeholderTextColor={colors.sub}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          disabled={submitting}
          onPress={onSignup}
          style={[styles.btnPrimary, submitting && { opacity: 0.7 }]}
        >
          {submitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnPrimaryText}>{'signup'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace('Auth')}
          style={styles.btnGhost}
          disabled={submitting}
        >
          <Text style={styles.btnGhostText}>{'login'}</Text>
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

  btnPrimary: {
    backgroundColor: colors.accent,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnPrimaryText: { color: '#000', fontWeight: '700', fontSize: 16 },

  btnGhost: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    marginTop: 12,
  },
  btnGhostText: { color: colors.text, fontWeight: '600' },
});
