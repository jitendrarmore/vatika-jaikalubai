import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { getDbInstance } from './client';

export interface Plant {
  id?: string;
  name: string;
  marathiName: string;
  image: string;
  benefits: string[];
  description: string;
  growthTimeline: string;
  cost: number;
  category: string;
  createdAt?: Timestamp;
}

export async function getPlants(): Promise<Plant[]> {
  const snapshot = await getDocs(collection(getDbInstance(), 'plants'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Plant));
}

export async function addPlant(data: Omit<Plant, 'id' | 'createdAt'>) {
  await addDoc(collection(getDbInstance(), 'plants'), { ...data, createdAt: Timestamp.now() });
}

export async function updatePlant(plantId: string, data: Partial<Plant>) {
  await updateDoc(doc(getDbInstance(), 'plants', plantId), data);
}

export async function deletePlant(plantId: string) {
  await deleteDoc(doc(getDbInstance(), 'plants', plantId));
}
