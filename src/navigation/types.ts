export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Landing: undefined;
  Cart: undefined;
  Notifications: undefined;
  Settings: undefined;
};

// Helper type for navigation props
export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: {
    navigate: (screen: T, params?: RootStackParamList[T]) => void;
    replace: (screen: T, params?: RootStackParamList[T]) => void;
    goBack: () => void;
  };
};