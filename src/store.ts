import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Board, MonthlyCharge, ChargeCategory, Product, List } from './types';
import {
  getMonthlyCharges,
  getChargeCategories,
  deleteMonthlyCharge,
  updateMonthlyCharge,
  addChargeCategory,
  updateChargeCategory,
  deleteChargeCategory,
  addChargeSubcategory,
  updateChargeSubcategory,
  deleteChargeSubcategory,
  initializeDefaultCategories,
} from './services/firebase';
import { getUserProducts } from '@/services/firebase/products';

type currentPageType =
  | 'home'
  | 'boards'
  | 'cod-track'
  | 'manage'
  | 'MyAdLibrary'
  | 'cod-search'
  | 'my-page'
  | 'my-library'
  | 'ai-creator';
export type userPackageType = {
  plan: string;
  credits: string;
  price: string;
  type: string;
};

interface State {
  user: User | null;
  board: Board | null;
  products: Product[];
  lists: List[];
  days: any[];
  monthlyCharges: MonthlyCharge[];
  chargeCategories: ChargeCategory[];
  currentPage: currentPageType;
  userPackage: userPackageType;
  setCurrentPage: (page: currentPageType) => void;
  setPackage: (plan: string | null, credits: string) => void;
  setUser: (user: User | null) => void;
  setBoard: (board: Board | null) => void;
  setProducts: (products: Product[]) => void;
  setLists: (lists: List[]) => void;
  addList: (list: List) => void;
  setDays: (days: any[]) => void;
  updateList: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  reorderLists: (newLists: List[]) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStatus: (productId: string, newStatus: string, newOrder?: number) => void;
  reorderProducts: (listId: string, reorderedProducts: Product[]) => void;
  loadMonthlyCharges: () => Promise<void>;
  loadCategories: () => Promise<void>;
  getAllProducts: () => Product[];
  updateBoardStore: (board: any) => void;
  addMonthlyCharge: (charge: any) => void;
  deleteMonthlyCharge: (chargeId: string) => void;
  updateMonthlyCharge: (chargeId: string, updates: any) => void;
  addCategory: (category: any) => void;
  updateCategory: (categoryId: string, updates: any) => void;
  deleteCategory: (categoryId: string) => void;
  addSubcategory: (categoryId: string, data: any) => void;
  updateSubcategory: (categoryId: string, subcategoryId: string, updates: any) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  initializeDefaultCategories: () => void;

    //for now their implementation is empty in future implement it
  shareProduct: (productId: string, email: string, role: string) => void;
  removeShare: (productId: string, userId: string) => void,
  updateMemberRole: (productId: string, userId: string, newRole: string) => void
  loadUserProducts: (userId: string) => Promise<void>;
  // add testing
}

export const useProductStore = create<State>((set, get) => ({
  user: null,
  board: null,
  products: [],
  lists: [],
  days: [],
  monthlyCharges: [],
  chargeCategories: [],
  currentPage: 'home',
  userPackage: {
    plan: '',
    credits: '',
    price: '',
    type: '',
  },
  setPackage: (plan, credits) =>
    set(state => ({
      userPackage: {
        ...state.userPackage,
        plan: plan !== null ? plan : state.userPackage.plan,
        credits,
      },
    })),
  setUser: user => set({ user }),

  setCurrentPage: page => set({ currentPage: page }),

  setBoard: board => {
    if (board) {
      // Initialize default lists if none exist
      const defaultLists: List[] = board.lists || [];

      // Initialize products from board
      const boardProducts = board.products || [];
      const existingProducts = get().products;

      // Combine board products with existing products, prioritizing board versions
      const combinedProducts = [
        ...boardProducts,
        ...existingProducts.filter((p: any) => !boardProducts.find((bp: any) => bp.id === p.id)),
      ];

      set({
        board,
        lists: defaultLists,
        products: combinedProducts || [],
      });
    } else {
      // Keep existing products when clearing board
      const existingProducts = get().products;
      set({
        board: null,
        lists: [],
        products: existingProducts || [],
      });
    }
  },

  updateBoardStore: boardData => {
    set(state => ({
      board: boardData,
    }));
  },

  setProducts: products => set({ products }),
  setLists: lists => set({ lists }),

  addList: list =>
    set(state => ({
      lists: [...state.lists, list],
    })),

  updateList: (listId, title) =>
    set(state => ({
      lists: state.lists.map(list => (list.id === listId ? { ...list, title } : list)),
    })),

  deleteList: listId =>
    set(state => ({
      lists: state.lists.filter(list => list.id !== listId),
    })),

  reorderLists: newLists => set({ lists: newLists }),

  addProduct: product =>
    set(state => {
      const newProduct = {
        ...product,
        id: `product-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedProducts = [...state.products, newProduct];

      // Also update board products if board exists
      if (state.board) {
        const updatedBoard = {
          ...state.board,
          products: updatedProducts,
        };
        return {
          products: updatedProducts,
          board: updatedBoard,
        };
      }

      return { products: updatedProducts };
    }),

  updateProduct: (productId, updates) =>
    set(state => {
      const updatedProducts = state.products.map((product: any) =>
        product.id === productId ? { ...product, ...updates, updatedAt: new Date() } : product
      );

      // Also update board products if board exists
      if (state.board) {
        const updatedBoard = {
          ...state.board,
          products: updatedProducts,
        };
        return {
          products: updatedProducts,
          board: updatedBoard,
        };
      }

      return { products: updatedProducts };
    }),

  deleteProduct: productId =>
    set(state => {
      const updatedProducts = state.products.filter((product: any) => product.id !== productId);

      // Also update board products if board exists
      if (state.board) {
        const updatedBoard = {
          ...state.board,
          products: updatedProducts,
        };
        return {
          products: updatedProducts,
          board: updatedBoard,
        };
      }

      return { products: updatedProducts };
    }),

  updateProductStatus: (productId, newStatus, newOrder) =>
    set(state => {
      const updatedProducts = state.products.map((product: any) =>
        product.id === productId
          ? { ...product, status: newStatus, order: newOrder ?? product.order }
          : product
      );

      // Also update board products if board exists
      if (state.board) {
        const updatedBoard = {
          ...state.board,
          products: updatedProducts,
        };
        return {
          products: updatedProducts,
          board: updatedBoard,
        };
      }

      return { products: updatedProducts };
    }),

  reorderProducts: (listId, reorderedProducts: any) =>
    set(state => {
      const updatedProducts = state.products.map((product: any) => {
        const reorderedProduct = reorderedProducts.find((p: any) => p.id === product.id);
        if (reorderedProduct && product.status === listId) {
          return { ...product, order: reorderedProduct.order }; // Update order
        }
        return product;
      });

      // Also update board products if board exists
      if (state.board) {
        const updatedBoard = {
          ...state.board,
          products: updatedProducts,
        };

        return {
          products: updatedProducts,
          board: updatedBoard,
        };
      }

      return { products: updatedProducts };
    }),

  loadMonthlyCharges: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const charges = await getMonthlyCharges(user.uid);
      set({ monthlyCharges: charges });
    } catch (error) {
      console.error('Failed to load monthly charges:', error);
      throw error;
    }
  },

  deleteMonthlyCharge: async (chargeId: string) => {
    const { user, monthlyCharges } = get();
    if (!user) return;

    try {
      await deleteMonthlyCharge(user.uid, chargeId); // Call API to delete the charge
      const updatedCharges = monthlyCharges.filter(charge => charge.id !== chargeId);
      set({ monthlyCharges: updatedCharges });
    } catch (error) {
      console.error('Failed to delete charge:', error);
      throw error;
    }
  },

  updateMonthlyCharge: async (chargeId: string, updates: any) => {
    const { user } = get();
    try {
      await updateMonthlyCharge(user.uid, chargeId, updates);
      set(state => ({
        monthlyCharges: state.monthlyCharges.map(charge =>
          charge.id === chargeId ? { ...charge, ...updates } : charge
        ),
      }));
    } catch (error) {
      console.error('Failed to update monthly charge:', error);
      throw error;
    }
  },

  addMonthlyCharge: async (charge: any) => {
    set(state => ({
      monthlyCharges: [...state.monthlyCharges, charge], // Add the new charge to the store
    }));
  },

  loadCategories: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const categories = await getChargeCategories(user.uid);
      set({ chargeCategories: categories });
    } catch (error) {
      console.error('Failed to load categories:', error);
      throw error;
    }
  },
  addCategory: async (newCategoryData: any) => {
    const { user } = get();
    if (!user) return;

    try {
      const createdCategory = await addChargeCategory(user.uid, newCategoryData);

      // Update Zustand state
      set(state => ({ chargeCategories: [...state.chargeCategories, createdCategory] }));
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  },
  updateCategory: async (categoryId: string, updatedData: any) => {
    const { user, chargeCategories } = get();
    if (!user) return;

    try {
      // Update in backend
      await updateChargeCategory(user.uid, categoryId, updatedData);

      // Update in local state
      set({
        chargeCategories: chargeCategories.map(cat =>
          cat.id === categoryId ? { ...cat, ...updatedData } : cat
        ),
      });
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  },
  deleteCategory: async (categoryId: string) => {
    const { user, chargeCategories } = get();
    if (!user) return;

    try {
      // Delete in backend
      await deleteChargeCategory(user.uid, categoryId);

      // Remove from local state
      set({
        chargeCategories: chargeCategories.filter(cat => cat.id !== categoryId),
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  },

  addSubcategory: async (categoryId: string, data: any) => {
    const { user } = get();
    if (!user) return;
    try {
      const createdSubCategory = await addChargeSubcategory(user.uid, categoryId, data);

      set(state => ({
        chargeCategories: state.chargeCategories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              subcategories: [...(category.subcategories ?? []), createdSubCategory],
            };
          }
          return category;
        }),
      }));
    } catch (error) {
      console.error('Failed to add sub-category:', error);
      throw error;
    }
  },

  updateSubcategory: async (categoryId: string, subCategoryId: string, updatedData: any) => {
    const { user } = get();
    if (!user) return;

    try {
      await updateChargeSubcategory(user.uid, categoryId, subCategoryId, updatedData);
      set(state => ({
        chargeCategories: state.chargeCategories.map(cat => {
          if (cat.id !== categoryId) return cat;

          return {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id === subCategoryId ? { ...sub, ...updatedData } : sub
            ),
          };
        }),
      }));
    } catch (error) {
      console.error('Failed to update sub-category:', error);
      throw error;
    }
  },

  deleteSubcategory: async (categoryId: string, subCategoryId: string) => {
    const { user, chargeCategories } = get();
    if (!user) return;

    try {
      await deleteChargeSubcategory(user.uid, categoryId, subCategoryId);
      set({
        chargeCategories: chargeCategories.map((cat: any) => {
          if (cat.id !== categoryId) return cat;

          return {
            ...cat,
            subcategories: cat.subcategories.filter((sub: any) => sub.id !== subCategoryId),
          };
        }),
      });
    } catch (error) {
      console.error('Failed to delete sub-category:', error);
      throw error;
    }
  },

  initializeDefaultCategories: async () => {
    const { user, chargeCategories } = get();
    if (!user) return;
    try {
      await initializeDefaultCategories(user.uid);
    } catch (error) {
      console.error('Failed to initialize category:', error);
      throw error;
    }
  },
  getAllProducts: () => {
    const state = get();
    return state.products;
  },

  // add testing things
  setDays: days => set({ days }),
    //For now the function did nothing infuture implement it
  shareProduct: (productId: string, email: string, role: string) => {},
  removeShare: (productId: string, userId: string) => {},
  updateMemberRole: (productId: string, userId: string, newRole: string) => {},
  loadUserProducts: async (userId: string) => {
      try {
        const products = await getUserProducts(userId);
        set({ products });
      } catch (error) {
        console.error('Failed to load user products:', error);
        throw error;
      }
    },
}));
