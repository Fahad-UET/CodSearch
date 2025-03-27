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

export const createAiText = async data => {
  try {
    // Create a reference to the Firestore document in the 'aiText' collection
    const editorAiTextRef = doc(db, 'aiChatGPTText', data.id);

    // Prepare the new text data, including productId, type, createdAt, and updatedAt
    const newTextData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save the document in Firestore
    await setDoc(editorAiTextRef, newTextData);

    // Fetch the updated collection matching the productId
    const updatedCollection = await getAiTextByProductId(data.productId);
    return updatedCollection;
  } catch (error) {
    console.error('Error creating editor AI text:', error);
    throw error;
  }
};

export const getEditorAiTextByProductIdAndType = async (productId, type) => {
  try {
    const editorAiTextCollectionRef = collection(db, 'aiChatGPTText'); // Using 'aiText' collection i chnage aitext

    // Create a query to filter documents by both productId and type
    const q = query(
      editorAiTextCollectionRef,
      where('productId', '==', productId),
      where('type', '==', type)
    );

    // Execute the query and get the document snapshot
    const querySnapshot = await getDocs(q);

    // Check if any documents match the query
    if (querySnapshot.empty) {
      console.log('No editor AI texts found for the provided productId and type');
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
    console.error('Error retrieving editor AI text by productId and type:', error);
    throw error;
  }
};

export const getAiTextByProductId = async productId => {
  try {
    const editorAiTextCollectionRef = collection(db, 'aiChatGPTText'); // Reference to the 'aiText' collection

    // Create a query to filter documents by productId
    const q = query(editorAiTextCollectionRef, where('productId', '==', productId));

    // Execute the query and get the document snapshot
    const querySnapshot = await getDocs(q);

    // Check if any documents match the query
    if (querySnapshot.empty) {
      return [];
    }

    // Map over the querySnapshot to return the data as an array
    const aiTexts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the list of matching AI texts
    return aiTexts;
  } catch (error) {
    console.error('Error retrieving AI texts by productId:', error);
    throw error;
  }
};
