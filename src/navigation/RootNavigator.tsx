import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { useAuthStore } from '../store/authStore';
import {
  commonHeaderOptions,
  largeTitleOptions,
} from '../shared/utils/navigation/headerOptions';
import { navigationRef } from './navigationRef';
import LandingScreen from '../screens/app/LandingScreen';
import CartScreen from '../screens/app/CartScreen';
import NotificationsScreen from '../screens/app/NotificationsScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
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
              name="Landing"
              component={LandingScreen}
              options={{ title: 'Products' }}
            />
            <RootStack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: 'Shopping Cart' }}
            />
            <RootStack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ title: 'Notifications' }}
            />
            <RootStack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </>
        ) : (
          <>
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
            <RootStack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: 'Sign Up' }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
