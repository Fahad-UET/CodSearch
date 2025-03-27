import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export const creditsDeduction = {
  imageDownload: 1,
  saveKeyword: 1,
  textLibrary: 1,
  addImage: 1,
  addVideo: 1,
  addLandingPage: 1,
  scraping: 5,
  addReferenceSite: 1,
  videoDownload: 5,
  generateKeyword: 1,
  generateMarketingLists: 20,
  translateKeyword: 10,
  similarKeyword: 10,
  productSearchAssistant: 20,
  priceChanges: 50,
  generateAiText: 30,
  addBoardProduct: 100,
};

type creditType = keyof typeof creditsDeduction;

export const getCredits = async (userId: string, creditType: creditType, items: number = 1) => {
  try {
    if (!userId) throw new Error('userId is required');
    const credits: any = await getCurrentCredits(userId);
    return credits.credits >= Number(creditsDeduction[creditType]) * items ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateCredits = async (userId: string, creditType: creditType, items: number = 1) => {
  try {
    const credits: any = await getCurrentCredits(userId);
    if (credits) {
      const newCredits = credits.credits - Number(creditsDeduction[creditType]) * items;
      const result = await updateCurrentCredits(userId, newCredits);
      if (result) {
        return newCredits;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateCurrentCredits = async (userId: string, newCredits: number) => {
  try {
    if (!userId) {
      throw new Error('Invalid userId provided');
    }

    // Reference the user document
    const userDocRef = doc(db, 'users', userId);

    // Update the credits field
    await updateDoc(userDocRef, {
      credits: newCredits,
    });

    return true;
  } catch (error) {
    console.error('Failed to update credits:', error);
    throw error;
  }
};

export const getCurrentCredits = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('Invalid userId provided');
    }
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      console.warn(`No user found with ID: ${userId}`);
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Failed to get user:', error);
    throw error;
  }
};
