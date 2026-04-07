import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDbInstance } from './client';

export interface Donation {
  id?: string;
  uid: string;
  userEmail: string;
  userName: string;
  plantId: string;
  plantName: string;
  occasion: string;
  treeName: string;
  dedication: string;
  plantationDate: string;
  trackingId: string;
  status: 'scheduled' | 'planted' | 'growing' | 'thriving';
  location?: { lat: number; lng: number; address: string };
  cost: number;
  createdAt: Timestamp;
}

export async function createDonation(data: Omit<Donation, 'id' | 'createdAt'>) {
  const donationsRef = collection(getDbInstance(), 'donations');
  const docRef = await addDoc(donationsRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getDonationsByUser(uid: string): Promise<Donation[]> {
  const q = query(
    collection(getDbInstance(), 'donations'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Donation));
}

export async function getTreeByTrackingId(trackingId: string): Promise<Donation | null> {
  const q = query(collection(getDbInstance(), 'donations'), where('trackingId', '==', trackingId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Donation;
}

export async function updateDonationStatus(
  donationId: string,
  status: Donation['status']
) {
  await updateDoc(doc(getDbInstance(), 'donations', donationId), { status });
}

export interface TreeProgress {
  id?: string;
  donationId: string;
  date: string;
  status: string;
  note: string;
  imageUrl?: string;
}

export async function getTreeProgress(donationId: string): Promise<TreeProgress[]> {
  const q = query(
    collection(getDbInstance(), 'treeProgress'),
    where('donationId', '==', donationId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TreeProgress));
}

export async function addTreeProgress(data: Omit<TreeProgress, 'id'>) {
  await addDoc(collection(getDbInstance(), 'treeProgress'), data);
}
