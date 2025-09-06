import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import colors from '../theme/colors';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide: () => void;
  type?: 'success' | 'error' | 'info';
}

export default function Toast({
  message,
  visible,
  duration = 2500,
  onHide,
  type = 'info',
}: ToastProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  const toastStyle = [
    styles.toast,
    styles[type],
  ];

  return (
    <Animated.View style={[toastStyle, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: Platform.select({ ios: 40, android: 20 }),
    left: 16,
    right: 16,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    borderColor: '#4CAF50',
  },
  error: {
    borderColor: '#FF6B6B',
  },
  info: {
    borderColor: colors.border,
  },
  text: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
