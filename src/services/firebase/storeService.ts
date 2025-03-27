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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// Create a new store document with userId and product information
export const createStore = async (userId, productData) => {
  try {
    const storeRef = doc(collection(db, 'storeData')); // Generate a new document ID

    const newStoreData = {
      ...productData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save the document to Firestore
    await setDoc(storeRef, newStoreData);

    return { id: storeRef.id, ...newStoreData };
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};

// Update an existing store document by ID
// Update an existing store document by ID
export const updateStore = async (storeId, updatedFields) => {
  try {
    const storeRef = doc(db, 'storeData', storeId);
    const docSnap = await getDoc(storeRef);

    if (!docSnap.exists()) {
      throw new Error(`Store document with ID ${storeId} not found`);
    }

    await updateDoc(storeRef, {
      ...updatedFields,
      updatedAt: serverTimestamp(),
    });

    return { id: storeId, ...updatedFields, updatedAt: new Date() };
  } catch (error) {
    console.error('Error updating store:', error.message); // Log the full error message
    throw error;
  }
};

// Delete a store document by its ID
export const deleteStore = async storeId => {
  try {
    const storeRef = doc(db, 'storeData', storeId);

    const docSnap = await getDoc(storeRef);

    if (docSnap.exists()) {
      await deleteDoc(storeRef);
      return { success: true, message: 'Store deleted successfully' };
    } else {
      return { success: false, message: 'No store found to delete' };
    }
  } catch (error) {
    console.error('Error deleting store:', error);
    throw error;
  }
};

// Get all store documents matching a specific userId
export const getStoresByUserId = async userId => {
  try {
    const storeCollectionRef = collection(db, 'storeData');

    const q = query(storeCollectionRef, where('userId', '==', userId));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const stores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return stores;
  } catch (error) {
    console.error('Error retrieving stores by userId:', error);
    throw error;
  }
};
