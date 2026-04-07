import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { getDbInstance } from './client';

export type UserRole = 'admin' | 'maintainer' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Timestamp;
}

export async function syncUserToFirestore(uid: string, email: string, name: string, photoURL?: string) {
  const docRef = doc(getDbInstance(), 'users', uid);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    // If it's the requested admin or in the static list, make them admin initially
    const isAdmin = ['admin@vatika.in', 'jitendrarmore@gmail.com', 'jeetu.more@gmail.com'].includes(email);

    const newUser: UserProfile = {
      uid,
      email,
      name,
      photoURL,
      role: isAdmin ? 'admin' : 'user',
      createdAt: Timestamp.now(),
    };
    await setDoc(docRef, newUser);
    return newUser;
  }

  // Update name/photo if they changed
  const existing = snapshot.data() as UserProfile;
  if (existing.name !== name || existing.photoURL !== photoURL) {
    await updateDoc(docRef, { name, photoURL });
  }

  return existing;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(getDbInstance(), 'users', uid);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const q = query(collection(getDbInstance(), 'users'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as UserProfile);
}

export async function getMaintainerUsers(): Promise<UserProfile[]> {
  const q = query(
    collection(getDbInstance(), 'users'),
    where('role', 'in', ['maintainer', 'admin'])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as UserProfile);
}

export async function updateUserRole(uid: string, role: UserRole) {
  const docRef = doc(getDbInstance(), 'users', uid);
  await updateDoc(docRef, { role });
}
