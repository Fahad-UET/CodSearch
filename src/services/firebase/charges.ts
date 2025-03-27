import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { MonthlyCharge } from '../../types';

export const createMonthlyCharge = async (
  userId: string,
  charge: Omit<MonthlyCharge, 'id' | 'createdAt' | 'updatedAt'>
) => {
  try {
    const chargeRef = doc(collection(db, 'users', userId, 'monthlyCharges'));
    const chargeData = {
      ...charge,
      id: chargeRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(chargeRef, chargeData);
    return chargeData;
  } catch (error) {
    console.error('Failed to add charge:', error);
    throw error;
  }
};

export const updateMonthlyCharge = async (
  userId: string,
  chargeId: string,
  updates: Partial<MonthlyCharge>
) => {
  try {
    const chargeRef = doc(db, 'users', userId, 'monthlyCharges', chargeId);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(chargeRef, updatedData);
    return updatedData;
  } catch (error) {
    console.error('Failed to update charge:', error);
    throw error;
  }
};

export const deleteMonthlyCharge = async (userId: string, chargeId: string) => {
  try {
    const chargeRef = doc(db, 'users', userId, 'monthlyCharges', chargeId);
    await deleteDoc(chargeRef);
  } catch (error) {
    console.error('Failed to delete charge:', error);
    throw error;
  }
};

export const getMonthlyCharges = async (userId: string) => {
  try {
    const chargesRef = collection(db, 'users', userId, 'monthlyCharges');
    const snapshot = await getDocs(chargesRef);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as MonthlyCharge[];
  } catch (error) {
    console.error('Failed to get charges:', error);
    throw error;
  }
};

export const clearAllCharges = async (userId: string) => {
  try {
    const batch = writeBatch(db);
    const chargesRef = collection(db, 'users', userId, 'monthlyCharges');
    const snapshot = await getDocs(chargesRef);

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error('Failed to clear charges:', error);
    throw error;
  }
};
