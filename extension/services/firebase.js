import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const db = getFirestore();

export async function saveScrapedData(boardId, data) {
  try {
    const productsRef = collection(db, 'boards', boardId, 'products');
    const productData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: 'extension'
    };

    const docRef = await addDoc(productsRef, productData);
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to save data: ${error.message}`);
  }
}