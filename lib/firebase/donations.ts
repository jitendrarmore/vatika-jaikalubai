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
  mobile?: string;
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
  maintainerEmail?: string;
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
    where('uid', '==', uid)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Donation));
  return data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
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

export async function getAllDonations(): Promise<Donation[]> {
  const q = query(collection(getDbInstance(), 'donations'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Donation));
}

export async function assignMaintainer(donationId: string, maintainerEmail: string) {
  await updateDoc(doc(getDbInstance(), 'donations', donationId), { maintainerEmail });
}

export async function getDonationsByMaintainer(maintainerEmail: string): Promise<Donation[]> {
  const q = query(collection(getDbInstance(), 'donations'), where('maintainerEmail', '==', maintainerEmail));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Donation));
  return data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export interface TreeProgress {
  id?: string;
  donationId: string;
  date: string;
  status: string;
  note: string;
  imageUrl?: string;
  videoUrl?: string;
  actionType?: 'purchased' | 'planted' | 'tagged' | 'watered' | 'general';
  geoLocation?: { lat: number; lng: number };
}

export async function getTreeProgress(donationId: string): Promise<TreeProgress[]> {
  const q = query(
    collection(getDbInstance(), 'treeProgress'),
    where('donationId', '==', donationId)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TreeProgress));
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addTreeProgress(data: Omit<TreeProgress, 'id'>) {
  await addDoc(collection(getDbInstance(), 'treeProgress'), data);
}
