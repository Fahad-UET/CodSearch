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

const COLLECTION_NAME = 'saved_images';

// Fetch images by userId
export const getSavedImages = async userId => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const imagesRef = collection(db, COLLECTION_NAME);
    const q = query(imagesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('No saved images found');
      return [];
    }

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error('Failed to fetch saved images:', error);
    throw error;
  }
};

// Create a new saved image
export const createSavedImage = async (userId, data) => {
  try {
    const uniqueId = `search-${crypto.randomUUID()}`;
    if (!userId || !data) {
      throw new Error('User ID and data are required');
    }

    const imageRef = doc(collection(db, COLLECTION_NAME));
    const imageData = {
      ...data,
      userId,
      id: uniqueId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(imageRef, imageData);
    return { ...imageData, id: imageRef.id };
  } catch (error) {
    console.error('Failed to create saved image:', error);
    throw error;
  }
};

// Update an existing saved image
export const updateSavedImage = async (id, updates) => {
  try {
    if (!id || !updates || Object.keys(updates).length === 0) {
      throw new Error('Document ID and at least one update field are required');
    }

    const imageRef = doc(db, COLLECTION_NAME, id);
    const updatedData = { ...updates, updatedAt: serverTimestamp() };

    await updateDoc(imageRef, updatedData);
    const updatedImageSnap = await getDoc(imageRef);
    return { ...updatedImageSnap.data(), id };
  } catch (error) {
    console.error('Failed to update saved image:', error);
    throw error;
  }
};

// Delete a saved image
export const deleteSavedImage = async id => {
  try {
    if (!id) {
      throw new Error('Document ID is required');
    }

    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true, id };
  } catch (error) {
    console.error('Failed to delete saved image:', error);
    throw error;
  }
};
