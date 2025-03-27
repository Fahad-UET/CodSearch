import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'saved_pages';

// Fetch pages by userId
export const getSavedPages = async userId => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const pagesRef = collection(db, COLLECTION_NAME);
    const q = query(pagesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('No saved pages found');
      return [];
    }

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error('Failed to fetch saved pages:', error);
    throw error;
  }
};

// Create a new saved page
export const createSavedPage = async (userId, data) => {
  try {
    const uniqueId = `search-${crypto.randomUUID()}`;
    if (!userId || !data) {
      throw new Error('User ID and data are required');
    }

    const pageRef = doc(collection(db, COLLECTION_NAME));
    const pageData = {
      ...data,
      userId,
      id: uniqueId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(pageRef, pageData);
    return { ...pageData, id: pageRef.id };
  } catch (error) {
    console.error('Failed to create saved page:', error);
    throw error;
  }
};

// Update an existing saved page
export const updateSavedPage = async (id, updates) => {
  try {
    if (!id || !updates || Object.keys(updates).length === 0) {
      throw new Error('Document ID and at least one update field are required');
    }

    const pageRef = doc(db, COLLECTION_NAME, id);
    const updatedData = { ...updates, updatedAt: serverTimestamp() };

    await updateDoc(pageRef, updatedData);
    const updatedPageSnap = await getDoc(pageRef);
    return { ...updatedPageSnap.data(), id };
  } catch (error) {
    console.error('Failed to update saved page:', error);
    throw error;
  }
};

// Delete a saved page
export const deleteSavedPage = async id => {
  try {
    if (!id) {
      throw new Error('Document ID is required');
    }

    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true, id };
  } catch (error) {
    console.error('Failed to delete saved page:', error);
    throw error;
  }
};
7;
