import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { useAuthStore } from '../store/authStore';
import { SCREEN_NAMES } from './routes';
import ChatScreen from '../screens/app/ChatScreen';
import {
  commonHeaderOptions,
  largeTitleOptions,
} from '../shared/utils/navigation/headerOptions';
import { navigationRef } from './navigationRef';
import HomeScreen from '../screens/app/HomeScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isLoggedIn, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          ...commonHeaderOptions,
          ...largeTitleOptions,
        }}
      >
        {isLoggedIn ? (
          <>
            <RootStack.Screen
              name={SCREEN_NAMES.Home}
              component={HomeScreen}
              options={{ title: 'Home' }}
            />
            <RootStack.Screen
              name={SCREEN_NAMES.Chat}
              component={ChatScreen}
              options={{ title: 'Global Chat' }}
            />
          </>
        ) : (
          <>
            <RootStack.Screen
              name={SCREEN_NAMES.Login}
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
            <RootStack.Screen
              name={SCREEN_NAMES.Signup}
              component={SignupScreen}
              options={{ title: 'Sign Up' }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
