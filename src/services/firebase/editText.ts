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

export const createTextEdit = async (userId, data) => {
  try {
    const textEditRef = doc(db, 'storeData', data.storeId); // Using storeId as the document ID

    const newTextData = {
      ...data,
      userId: userId, // Store userId as foreign key
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(textEditRef, newTextData);

    // Return the created document
    return newTextData;
  } catch (error) {
    console.error('Error creating text edit:', error);
    throw error;
  }
};

export const updateTextEdit = async (storeId, updatedFields) => {
  try {
    const textEditRef = doc(db, 'storeData', storeId); // Reference to the specific document using storeId
    // Update the document with the new fields (preserves other fields)
    await updateDoc(textEditRef, updatedFields);

    // Return the updated document data
    return { storeId, ...updatedFields };
  } catch (error) {
    console.error('Error updating text edit:', error);
    throw error;
  }
};

export const getTextEditsByUserId = async userId => {
  try {
    const textEditCollectionRef = collection(db, 'storeData');

    // Create a query to filter documents by userId
    const q = query(textEditCollectionRef, where('userId', '==', userId));

    // Execute the query and get the document snapshot
    const querySnapshot = await getDocs(q);

    // Check if any documents match the query
    if (querySnapshot.empty) {
      return [];
    }

    // Map over the querySnapshot to return the data as an array
    const textEdits = querySnapshot.docs.map(doc => ({
      storeId: doc.id, // Using storeId as document ID
      ...doc.data(),
    }));

    // Return the text edits
    return textEdits;
  } catch (error) {
    console.error('Error retrieving text edits by userId:', error);
    throw error;
  }
};

export const deleteTextEdit = async storeId => {
  try {
    // Reference to the Firestore document to be deleted
    const textEditRef = doc(db, 'storeData', storeId);

    // Check if the document exists
    const docSnap = await getDoc(textEditRef);

    if (docSnap.exists()) {
      // If document exists, delete it
      await deleteDoc(textEditRef);

      // Return a confirmation message or updated data if needed
      return { success: true, message: 'Text edit deleted successfully' };
    } else {
      return { success: false, message: 'No document found to delete' };
    }
  } catch (error) {
    console.error('Error deleting text edit:', error);
    throw error;
  }
};
