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

export const getBoardProducts = async (boardId: string) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('boardId', '==', boardId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  try {
    // Add default tasks based on the list
    const defaultTasks = generateDefaultTasks(productData.status);

    const cleanedProductData = {
      ...productData,
      images: productData.images?.filter(Boolean) || [],
      videoLinks: productData.videoLinks?.filter(Boolean) || [],
      voiceRecordings: productData.voiceRecordings?.filter(Boolean) || [],
      descriptions: productData.descriptions?.filter(Boolean) || [],
      tasks: defaultTasks,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Create new document with auto-generated ID
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, cleanedProductData);

    // Get the created document
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() };
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId: string, updates: any) => {
  try {
    const productRef = doc(db, 'products', productId);

    // Check if document exists
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
      // Create document if it doesn't exist
      await setDoc(productRef, {
        ...updates,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update existing document
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    }

    // Get updated document
    const updatedSnap = await getDoc(productRef);
    return { id: productId, ...updatedSnap.data() };
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    throw error;
  }
};

export const getUserProducts = async (userId: string) => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

// add testing

// Function to get all days
export const getAllDays = async productId => {
  try {
    const daysRef = collection(db, 'days');

    // Query to fetch documents where productId matches the provided one
    const q = query(daysRef, where('productId', '==', productId));

    const querySnapshot = await getDocs(q);

    // Check if we have any documents in the collection
    if (querySnapshot.empty) {
      return [];
    }

    // Map the result to an array of days
    const days = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));


    return days;
  } catch (error) {
    console.error('Error fetching days:', error);
    throw error;
  }
};

export const createOrUpdateDay = async (productId, dayData) => {
  try {
    const { id } = dayData;

    // Reference to the Firestore 'days' collection
    const dayRef = doc(db, 'days', id); // Use 'id' to find the document

    // Include productId in the data
    const dayWithProductId = {
      ...dayData,
      productId: productId, // Adding productId
    };

    // Check if the day already exists in Firestore
    const docSnap = await getDoc(dayRef);

    if (docSnap.exists()) {
      await updateDoc(dayRef, {
        ...dayWithProductId,
        updatedAt: serverTimestamp(), //for convert
      });
    } else {
      const cleanedDayData = {
        ...dayWithProductId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(dayRef, cleanedDayData);
    }

    const daysRef = collection(db, 'days');
    const docSnapAfter = await getDocs(daysRef);
    const allDays = docSnapAfter.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter the days based on the productId to return only relevant days
    // @ts-ignore
    const filteredDays = allDays.filter(day => day.productId === productId);

    return filteredDays;
  } catch (error) {
    console.error('Error creating or updating day:', error);
    throw error;
  }
};
