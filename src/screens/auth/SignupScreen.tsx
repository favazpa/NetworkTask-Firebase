import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Ionicons from '@react-native-vector-icons/ionicons';
import { RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';
import colors from '../../shared/theme/colors';
import { VALIDATION } from '../../shared/constants';
import { Button, Input } from '../../shared/components';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { signup, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function isValidEmail(email: string): boolean {
    const trimmed = email.trim();
    return VALIDATION.EMAIL_REGEX.test(trimmed);
  }

  const onSignup = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      !username.trim()
    ) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      await signup({ email, username, password });
    } catch (e: any) {
      Alert.alert('Signup failed', e?.message ?? 'Please try again.');
    }
  };


  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="person-add-outline" size={28} color={colors.accent} />
          <Text style={styles.title}>signup</Text>
        </View>

        <Input
          value={username}
          onChangeText={setUsername}
          placeholder={t('auth.username')}
          type="text"
          icon="person-outline"
        />

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.email')}
          type="email"
          icon="mail-outline"
        />

        <Input
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.password')}
          type="password"
          icon="lock-closed-outline"
        />

        <Button
          title={t('auth.signup')}
          onPress={onSignup}
          loading={isLoading}
          disabled={isLoading}
        />

        <Button
          title={t('auth.login')}
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
          disabled={isLoading}
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
});
