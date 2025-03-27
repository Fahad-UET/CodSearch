import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from './config';

interface Data {
  id: string;
  audio: string;
  userId: string;
  response: string;
  genType: string;
  refImg?: string;
}

export const addAudioToolRes = async (data: Data) => {
  try {
    const ref = await doc(db, 'AudioCreatedData', data.id);
    const newData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    setDoc(ref, newData);
    return newData;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

export const getAudioToolResByGenType = async (genType: string) => {
  try {
    const ref = collection(db, 'AudioCreatedData');

    const q = query(ref, where('genType', '==', genType));

    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    return snapshot.docs;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const updateAudioToolRes = async (id: string, data: Data) => {
  try {
    const ref = collection(db, 'AudioCreatedData');
    const q = query(ref, and(where('id', '==', id), where('userId', '==', data.userId)));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return {
        success: false,
        message: 'No document found to update or user dont have permission',
      };
    }

    const docRef = doc(db, 'AudioCreatedData', id);

    const newData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    setDoc(docRef, newData);
    return newData;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

export const deleteAudioToolRes = async (id: string, userId: string) => {
  try {
    const ref = collection(db, 'AudioCreatedData');
    const q = query(ref, and(where('id', '==', id), where('userId', '==', userId)));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return {
        success: false,
        message: 'No document found to delete or user dont have permission',
      };
    }

    const docRef = doc(db, 'AudioCreatedData', id);
    await deleteDoc(docRef);
    return { success: true, message: 'Document deleted successfully' };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
