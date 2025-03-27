import { doc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { User } from '@/types';

export async function updateProfile(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  
  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  await updateDoc(userRef, updateData);
  return updateData;
}