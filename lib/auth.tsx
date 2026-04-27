'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getAuthInstance } from '@/lib/firebase/client';
import { syncUserToFirestore } from '@/lib/firebase/users';
import {
  signInWithPopup,
  GoogleAuthProvider,
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
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signUpGuest: (email: string, password: string, name: string, mobile: string) => Promise<User>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isMaintainer: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAILS = ['admin@vatika.in', 'jitendrarmore@gmail.com', 'jeetu.more@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMaintainer, setIsMaintainer] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), async (u) => {
      if (u) {
        try {
          const profile = await syncUserToFirestore(u.uid, u.email || '', u.displayName || 'User', u.photoURL || undefined);
          setUser(u);
          setIsAdmin(profile.role === 'admin' || ADMIN_EMAILS.includes(u.email || ''));
          setIsMaintainer(profile.role === 'maintainer' || profile.role === 'admin' || ADMIN_EMAILS.includes(u.email || ''));
        } catch (e) {
          console.error("Failed to sync user", e);
          setUser(u);
          setIsAdmin(ADMIN_EMAILS.includes(u.email || ''));
          setIsMaintainer(ADMIN_EMAILS.includes(u.email || ''));
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsMaintainer(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuthInstance(), provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(getAuthInstance(), email, password);
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const { user: newUser } = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
    await updateProfile(newUser, { displayName: name });
  };

  /**
   * Creates a Firebase account for a guest who just donated.
   * Saves mobile number to their Firestore profile so it's linked from day one.
   * Returns the new User so the caller can immediately attach the donation to their UID.
   */
  const signUpGuest = async (
    email: string,
    password: string,
    name: string,
    mobile: string
  ): Promise<User> => {
    const { user: newUser } = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
    await updateProfile(newUser, { displayName: name });
    // Persist mobile alongside profile — this also creates the Firestore users doc
    await syncUserToFirestore(newUser.uid, email, name, undefined, mobile);
    return newUser;
  };

  const signOut = async () => {
    await firebaseSignOut(getAuthInstance());
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signUpGuest, signOut, isAdmin, isMaintainer }}
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
