import { collection, query, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase.js';

export const productService = {
  async getProducts(userId, limitCount = 5) {
    try {
      const productsRef = collection(db, 'users', userId, 'products');
      const q = query(productsRef, limit(limitCount));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      throw error;
    }
  },

  async addImageToProduct(userId, productId, imageUrl) {
    try {
      const productRef = doc(db, 'users', userId, 'products', productId);
      const productDoc = await getDocs(productRef);
      
      if (productDoc.exists()) {
        const product = productDoc.data();
        const images = [...(product.images || []), imageUrl];
        await updateDoc(productRef, { images });
        return { success: true };
      }
      return { success: false, error: 'Produit non trouvé' };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image:', error);
      throw error;
    }
  }
};