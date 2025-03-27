import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

export const dataAccess = {
  // Récupérer un tableau
  async getBoard(boardId: string) {
    const boardRef = doc(db, 'boards', boardId);
    const boardSnap = await getDoc(boardRef);
    
    if (!boardSnap.exists()) {
      throw new Error('Tableau non trouvé');
    }
    
    // Récupérer les listes du tableau
    const listsRef = collection(boardRef, 'lists');
    const listsSnap = await getDocs(listsRef);
    const lists = listsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Récupérer les produits du tableau
    const productsRef = collection(boardRef, 'products');
    const productsSnap = await getDocs(productsRef);
    const products = productsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      ...boardSnap.data(),
      id: boardId,
      lists,
      products
    };
  },

  // Récupérer tous les tableaux d'un utilisateur
  async getUserBoards(userId: string) {
    const boardsRef = collection(db, 'boards');
    const q = query(boardsRef, where('ownerId', '==', userId));
    const snapshot = await getDocs(q);
    
    return Promise.all(snapshot.docs.map(async doc => {
      const board = await this.getBoard(doc.id);
      return board;
    }));
  },

  // Récupérer le profil utilisateur
  async getUserProfile(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('Utilisateur non trouvé');
    }
    
    return {
      id: userId,
      ...userSnap.data()
    };
  }
};