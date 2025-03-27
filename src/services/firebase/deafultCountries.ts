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

// Function to create or update a defaultPrice document
export const createOrUpdateDefaultPrice = async (data: {
  userId: string;
  country: string;
  defaultValues: { value: number }[];
}) => {
  try {
    const { userId, country, defaultValues } = data;

    // Reference to the 'defaultPrice' collection
    const defaultPriceCollectionRef = collection(db, 'defaultPrice');

    // Query to find if a document already exists with the same userId and country
    const q = query(
      defaultPriceCollectionRef,
      where('userId', '==', userId),
      where('country', '==', country)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If document exists, update it
      const docRef = querySnapshot.docs[0].ref; // Assuming only one match exists
      await updateDoc(docRef, {
        defaultValues,
        updatedAt: serverTimestamp(),
      });

      // Return the updated list of defaultValues
      return { defaultValues };
    } else {
      // If document does not exist, create a new one
      const newDocRef = doc(defaultPriceCollectionRef);
      await setDoc(newDocRef, {
        userId,
        country,
        defaultValues,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Return the newly created list of defaultValues
      return { defaultValues };
    }
  } catch (error) {
    console.error('Error creating or updating DefaultPrice document:', error);
    throw error;
  }
};

// Function to get a specific defaultPrice document by userId and country
export const getDefaultPriceByUserIdAndCountry = async (userId: string, country: string) => {
  try {
    // Reference to the 'defaultPrice' collection
    const defaultPriceCollectionRef = collection(db, 'defaultPrice');

    // Query to filter documents by userId and country
    const q = query(
      defaultPriceCollectionRef,
      where('userId', '==', userId),
      where('country', '==', country)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No DefaultPrice document found for the provided userId and country');
      return null;
    }

    // Return the first matching document (assuming only one match exists)
    const docData = querySnapshot.docs[0].data();
    return {
      id: querySnapshot.docs[0].id,
      ...docData,
    };
  } catch (error) {
    console.error('Error retrieving DefaultPrice document:', error);
    throw error;
  }
};
