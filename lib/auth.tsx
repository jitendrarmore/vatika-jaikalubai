'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getAuthInstance } from '@/lib/firebase/client';
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAILS = ['admin@vatika.in', 'jitendrarmore@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), (u) => {
      setUser(u);
      setIsAdmin(u ? ADMIN_EMAILS.includes(u.email || '') : false);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuthInstance(), provider);
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(getAuthInstance(), provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(getAuthInstance(), email, password);
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const { user: newUser } = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
    await updateProfile(newUser, { displayName: name });
  };

  const signOut = async () => {
    await firebaseSignOut(getAuthInstance());
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, signOut, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
