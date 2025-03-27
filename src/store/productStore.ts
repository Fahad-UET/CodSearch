import { create } from 'zustand';
import { Product } from '../types';
import { createProduct, getUserProducts } from '../services/firebase/products';
import { updateProduct as updateProductService, deleteProduct as deleteProductService, } from '@/services/firebase';

interface ProductState {
  products: Product[];
  loadUserProducts: (userId: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getAllProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],

  loadUserProducts: async (userId: string) => {
    try {
      const products = await getUserProducts(userId);
      set({ products });
    } catch (error) {
      console.error('Failed to load user products:', error);
      throw error;
    }
  },

  addProduct: async (product) => {
    try {
      // Create in Firebase first
      const userId = 'current-user-id'; // Replace with actual user ID
      const newProduct = await createProduct(product);

      // Update local state after successful creation
      set(state => ({
        products: [...state.products, newProduct]
      }));

    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },

  updateProduct: async (productId, updates) => {
    try {
      // Update in Firebase first
      const userId = 'current-user-id'; // Replace with actual user ID
      const updatedProduct = await updateProductService( productId, updates);

      // Update local state after successful save
      set(state => ({
        products: state.products.map(product =>
          product.id === productId ? updatedProduct : product
        )
      }));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      // Delete from Firebase first
      const userId = 'current-user-id'; // Replace with actual user ID
      await deleteProductService(productId);

      // Update local state after successful deletion
      set(state => ({
        products: state.products.filter(product => product.id !== productId)
      }));

    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  getAllProducts: () => {
    return get().products;
  }
}));