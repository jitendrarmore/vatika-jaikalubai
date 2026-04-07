import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorageInstance } from './client';

export async function uploadMedia(file: File, path: string): Promise<string> {
  const storageRef = ref(getStorageInstance(), path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
