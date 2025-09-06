import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { useCartStore } from './cartStore';
import { useNotificationsStore } from './notificationsStore';
import { STORAGE_KEYS } from '../shared/constants';

export type AuthUser = {
  id: string;
  email: string | null;
  username: string | null;
};

export type SignupPayload = {
  email: string;
  username: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

type AuthState = {
  isLoggedIn: boolean;
  hasHydrated: boolean;
  user: AuthUser | null;
  isLoading: boolean;

  setLoggedIn: (val: boolean, user: AuthUser | null) => void;
  logout: () => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  loginWithPassword: (payload: LoginPayload) => Promise<void>;
  clearError: () => void;
};

function mapFirebaseUser(
  u: auth.FirebaseAuthTypes.User | null,
): AuthUser | null {
  if (!u) return null;
  
  return {
    id: u.uid,
    email: u.email ?? null,
    username: u.displayName ?? null,
  };
}

function mapFirebaseAuthError(codeOrMsg?: string) {
  const s = (codeOrMsg || '').toLowerCase();
  if (s.includes('invalid-email')) return 'Invalid email address.';
  if (s.includes('email-already-in-use'))
    return 'This email is already in use.';
  if (s.includes('user-not-found'))
    return 'No user found with these credentials.';
  if (s.includes('wrong-password')) return 'Incorrect password.';
  if (s.includes('too-many-requests'))
    return 'Too many attempts. Try again later.';
  if (s.includes('weak-password'))
    return 'Password should be at least 6 characters.';
  return 'Something went wrong. Please try again.';
}

let authUnsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      hasHydrated: false,
      user: null,
      isLoading: false,

      setLoggedIn: (val, user) => set({ isLoggedIn: val, user }),

      logout: async () => {
        await auth().signOut();
        // Clear cart and notifications on logout
        useCartStore.getState().clearCart();
        useNotificationsStore.getState().clearAllNotifications();
        set({ isLoggedIn: false, user: null });
      },

      signup: async ({ email, username, password }) => {
        const emailKey = (email || '').trim();
        const usernameKey = (username || '').trim();
        
        if (!emailKey || !password || !usernameKey) {
          throw new Error('Please fill all required fields.');
        }
        
        set({ isLoading: true });
        
        try {
          // Create Firebase user
          const cred = await auth().createUserWithEmailAndPassword(
            emailKey,
            password,
          );
          
          // Update user profile with displayName
          await cred.user.updateProfile({
            displayName: usernameKey,
          });
          
          // Create user object
          const user: AuthUser = {
            id: cred.user.uid,
            email: cred.user.email,
            username: usernameKey,
          };
          
          // Set user state
          set({ isLoggedIn: true, user, isLoading: false });
          
        } catch (e: any) {
          set({ isLoading: false });
          throw new Error(mapFirebaseAuthError(e?.code || e?.message));
        }
      },

      loginWithPassword: async ({ email, password }) => {
        const emailKey = (email || '').trim();
        
        if (!emailKey || !password) {
          throw new Error('Please enter email and password.');
        }
        
        set({ isLoading: true });
        
        try {
          const cred = await auth().signInWithEmailAndPassword(
            emailKey,
            password,
          );
          
          const user = mapFirebaseUser(cred.user);
          set({ isLoggedIn: true, user, isLoading: false });
        } catch (e: any) {
          set({ isLoading: false });
          throw new Error(mapFirebaseAuthError(e?.code || e?.message));
        }
      },

      clearError: () => set({ isLoading: false }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => {
        return state => {
          useAuthStore.setState({ hasHydrated: true });

          if (authUnsubscribe) {
            authUnsubscribe();
            authUnsubscribe = null;
          }

          authUnsubscribe = auth().onAuthStateChanged(firebaseUser => {
            const mapped = mapFirebaseUser(firebaseUser);
            useAuthStore.setState({
              isLoggedIn: !!mapped,
              user: mapped,
            });
          });
        };
      },
    },
  ),
);

export function detachAuthListener() {
  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }
}
