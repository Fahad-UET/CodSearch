import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './config';

export const createVariableDocument = async (productId, variables) => {
  try {
    const variablesCollectionRef = collection(db, 'variables');
    const variablesDocRef = doc(variablesCollectionRef, productId);

    const newDocData = {
      productId,
      variables,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(variablesDocRef, newDocData);

    return { id: variablesDocRef.id, ...newDocData };
  } catch (error) {
    console.error('Error creating variable document:', error);
    throw error;
  }
};

export const updateVariableDocument = async (productId, newVariables) => {
  try {
    const variablesDocRef = doc(db, 'variables', productId);

    await updateDoc(variablesDocRef, {
      variables: newVariables,
      updatedAt: serverTimestamp(),
    });

    return { productId, variables: newVariables };
  } catch (error) {
    console.error('Error updating variable document:', error);
    throw error;
  }
};

export const getVariableDocumentByProductId = async productId => {
  try {
    const variablesDocRef = doc(db, 'variables', productId);

    const docSnap = await getDoc(variablesDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return { success: false, message: 'No document found for the given productId' };
    }
  } catch (error) {
    console.error('Error retrieving variable document by productId:', error);
    throw error;
  }
};
