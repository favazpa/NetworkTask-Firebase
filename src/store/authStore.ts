import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

type AuthUser = {
  id: string;
  email: string | null;
};

type AppState = {
  isLoggedIn: boolean;
  hasHydrated: boolean;
  user: AuthUser | null;

  setLoggedIn: (val: boolean, user: AuthUser | null) => void;
  logout: () => Promise<void>;
  signup: (payload: { email: string; password: string }) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
};

function mapFirebaseUser(
  u: auth.FirebaseAuthTypes.User | null,
): AuthUser | null {
  if (!u) return null;
  return {
    id: u.uid,
    email: u.email ?? null,
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

export const useAuthStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      hasHydrated: false,
      user: null,

      setLoggedIn: (val, user) => set({ isLoggedIn: val, user }),

      logout: async () => {
        await auth().signOut();
        set({ isLoggedIn: false, user: null });
      },

      signup: async ({ email, password }) => {
        const emailKey = (email || '').trim();
        if (!emailKey || !password) {
          throw new Error('Please fill all required fields.');
        }
        try {
          const cred = await auth().createUserWithEmailAndPassword(
            emailKey,
            password,
          );
          set({ isLoggedIn: true, user: mapFirebaseUser(cred.user) });
        } catch (e: any) {
          throw new Error(mapFirebaseAuthError(e?.code || e?.message));
        }
      },

      loginWithPassword: async (email, password) => {
        const emailKey = (email || '').trim();
        if (!emailKey || !password) {
          throw new Error('Please enter email and password.');
        }
        try {
          const cred = await auth().signInWithEmailAndPassword(
            emailKey,
            password,
          );
          const local = emailKey.split('@')[0];
          if (cred.user && !cred.user.displayName) {
            await cred.user.updateProfile({ displayName: local });
          }
          set({ isLoggedIn: true, user: mapFirebaseUser(cred.user) });
        } catch (e: any) {
          throw new Error(mapFirebaseAuthError(e?.code || e?.message));
        }
      },
    }),
    {
      name: 'auth-storage',
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
