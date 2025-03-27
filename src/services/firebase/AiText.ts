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

export const getAiText = async productId => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const productsRef = collection(db, 'aiText');
    const q = query(productsRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('No matching product found');
      return null;
    }

    const product = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
};

export const createAiText = async (productId, data) => {
  try {
    if (!productId || !data) {
      throw new Error('Product ID and data are required');
    }

    const productRef = doc(collection(db, 'aiText'));
    const productData = {
      ...data,
      productId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(productRef, productData);

    return { ...productData, id: productRef.id };
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

export const updateAiText = async (productId, updates) => {
  try {
    if (!productId || !updates || Object.keys(updates).length === 0) {
      throw new Error('Product ID and at least one update field are required');
    }

    const productsRef = collection(db, 'aiText');
    const q = query(productsRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('No product found to update');
    }

    const productDoc = snapshot.docs[0]; // Assume productId is unique and take the first match
    const productRef = doc(db, 'aiText', productDoc.id);
    const updatedData = { ...updates, updatedAt: serverTimestamp() };

    await updateDoc(productRef, updatedData);

    const updatedProductSnap = await getDoc(productRef);
    return { ...updatedProductSnap.data(), id: productDoc.id };
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};
