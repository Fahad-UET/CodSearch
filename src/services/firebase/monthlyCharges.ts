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
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// Fetch all monthly charges
export const getAllMonthlyCharges = async (userId: string) => {
  try {
    const chargesRef = collection(db, 'monthlyCharges');
    const q = query(chargesRef, where('userId', '==', userId)); // Filter by userId
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No charges found for this user');
    }

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching monthly charges:', error);
    throw error;
  }
};

// Create a new monthly charge
export const createOrUpdateMonthlyCharges = async (userId, chargePerProduct) => {
  try {
    const chargesRef = collection(db, 'monthlyCharges');
    const q = query(chargesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // If the document exists, update it
      const docRef = doc(db, 'monthlyCharges', snapshot.docs[0].id);
      await updateDoc(docRef, {
        chargePerProduct,
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, userId, chargePerProduct };
    } else {
      // If the document does not exist, create a new one
      const newDocRef = await addDoc(chargesRef, {
        userId,
        chargePerProduct,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: newDocRef.id, userId, chargePerProduct };
    }
  } catch (error) {
    console.error('Error creating/updating monthly product charges:', error);
    throw error;
  }
};

// Update an existing monthly charge
export const updateMonthlyChargeAPI = async (chargeId: string, updates: any) => {
  try {
    // Reference the document with the given chargeId
    const chargeRef = doc(db, 'monthlyCharges', chargeId);

    // Get the existing document
    const docSnap = await getDoc(chargeRef);

    if (!docSnap.exists()) {
      // If the document doesn't exist, create it with the provided data
      await setDoc(chargeRef, {
        ...updates,
        createdAt: serverTimestamp(), // Set createdAt for new document
        updatedAt: serverTimestamp(), // Set updatedAt when creating
      });
    } else {
      // If the document exists, update the document with the new data
      const existingData = docSnap.data();

      // Merge existing data with updates, ensuring updatedAt is set
      const mergedData = {
        ...existingData, // Keep existing fields
        ...updates, // Overwrite with the new updates
        updatedAt: serverTimestamp(), // Always update the timestamp
      };


      // Update the existing document with merged data
      await updateDoc(chargeRef, mergedData);
    }

    // Get the updated document and return the data
    const updatedSnap = await getDoc(chargeRef);
    return { id: chargeId, ...updatedSnap.data() }; // Return the updated data
  } catch (error) {
    console.error('Error updating monthly charge:', error);
    throw error;
  }
};

// Delete a monthly charge
export const deleteMonthlyChargeAPI = async (chargeId: string) => {
  try {
    const chargeRef = doc(db, 'monthlyCharges', chargeId);
    await deleteDoc(chargeRef);
  } catch (error) {
    throw error;
  }
};

export const getUserMonthlyCharges = async (userId: string) => {
  try {
    const chargesRef = collection(db, 'monthlyCharges');
    const q = query(chargesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};
