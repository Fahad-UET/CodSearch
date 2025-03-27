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
import { generateDefaultTasks } from '../../utils/defaultTasks';

export const createEditorAiText = async data => {
  try {
    const editorAiTextRef = doc(db, 'TextCreatedData', data.id);

    const newTextData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(editorAiTextRef, newTextData);

    // Return the created document
    return newTextData;
  } catch (error) {
    console.error('Error creating editor AI text:', error);
    throw error;
  }
};

export const updateEditorAiText = async (id, updatedFields) => {
  try {
    const editorAiTextRef = doc(db, 'TextCreatedData', id); // Reference to the specific document

    // Update the document with the new fields (preserves other fields)
    await updateDoc(editorAiTextRef, updatedFields);

    // Return the updated document data
    return { id, ...updatedFields };
  } catch (error) {
    console.error('Error updating editor AI text:', error);
    throw error;
  }
};

export const getEditorAiTextByProductId = async productId => {
  try {
    const editorAiTextCollectionRef = collection(db, 'TextCreatedData');

    // Create a query to filter documents by the productId
    const q = query(editorAiTextCollectionRef, where('productId', '==', productId));

    // Execute the query and get the document snapshot
    const querySnapshot = await getDocs(q);

    // Check if any documents match the query
    if (querySnapshot.empty) {
      return [];
    }

    // Map over the querySnapshot to return the data as an array
    const editorAiTexts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the editor AI texts
    return editorAiTexts;
  } catch (error) {
    console.error('Error retrieving editor AI text by productId:', error);
    throw error;
  }
};

export const deleteEditorAiText = async productId => {
  try {
    // Reference to the Firestore document to be deleted
    const editorAiTextRef = doc(db, 'TextCreatedData', productId);

    // Check if the document exists
    const docSnap = await getDoc(editorAiTextRef);

    if (docSnap.exists()) {
      // If document exists, delete it
      await deleteDoc(editorAiTextRef);

      // Return a confirmation message or updated data if needed
      return { success: true, message: 'Editor AI text deleted successfully' };
    } else {
      return { success: false, message: 'No document found to delete' };
    }
  } catch (error) {
    console.error('Error deleting editor AI text:', error);
    throw error;
  }
};
