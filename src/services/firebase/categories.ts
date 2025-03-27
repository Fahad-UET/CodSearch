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
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { ChargeCategory, ChargeSubcategory } from '@/types';

// Default categories configuration
const DEFAULT_CATEGORIES = [
  {
    label: 'Fixed Charges',
    isActive: true,
    subcategories: [
      { label: 'Store', isActive: true },
      { label: 'Software Subscriptions', isActive: true },
      { label: 'Teams', isActive: true },
      { label: 'Banking', isActive: true },
      { label: 'Company', isActive: true },
    ],
  },
  {
    label: 'Variable Charges',
    isActive: true,
    subcategories: [
      { label: 'Ad Accounts', isActive: true },
      { label: 'Testing ads', isActive: true },
    ],
  },
];

// Default charges configuration
const DEFAULT_CHARGES = [
  // Store charges
  {
    name: 'YouCan Hosting',
    amount: 27,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Store',
    isActive: false,
  },
  {
    name: 'Domain Name',
    amount: 20,
    period: 'yearly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Store',
    isActive: true,
  },
  // Software Subscription charges
  {
    name: 'Video Editing',
    amount: 19,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Software Subscriptions',
    isActive: false,
  },
  {
    name: 'ChatGPT',
    amount: 20,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Software Subscriptions',
    isActive: true,
  },
  {
    name: 'Voiceover',
    amount: 5,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Software Subscriptions',
    isActive: true,
  },
  {
    name: 'Spy Tool Mania',
    amount: 50,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Software Subscriptions',
    isActive: false,
  },
  {
    name: 'Anti-detect Browser',
    amount: 10,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Software Subscriptions',
    isActive: false,
  },
  {
    name: 'VPN / Proxy',
    amount: 5,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Software Subscriptions',
    isActive: false,
  },
  {
    name: 'Tracking App',
    amount: 10,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Software Subscriptions',
    isActive: false,
  },
  // Teams charges
  {
    name: 'Employees',
    amount: 300,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Teams',
    isActive: false,
  },
  {
    name: 'Freelancers',
    amount: 100,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Teams',
    isActive: false,
  },
  // Banking charges
  {
    name: 'Bank Account',
    amount: 10,
    period: 'monthly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Banking',
    isActive: true,
  },
  {
    name: 'Bank Card',
    amount: 30,
    period: 'yearly',
    categoryLabel: 'Fixed Charges',
    subcategoryLabel: 'Banking',
    isActive: true,
  },
  // Variable charges
  {
    name: 'Facebook Ad Accounts',
    amount: 50,
    period: 'monthly',
    categoryLabel: 'Variable Charges',
    subcategoryLabel: 'Ad Accounts',
    isActive: true,
  },
  {
    name: 'TikTok Ad Accounts',
    amount: 50,
    period: 'monthly',
    categoryLabel: 'Variable Charges',
    subcategoryLabel: 'Ad Accounts',
    isActive: false,
  },
  {
    name: 'Snapchat Ad Accounts',
    amount: 50,
    period: 'monthly',
    categoryLabel: 'Variable Charges',
    subcategoryLabel: 'Ad Accounts',
    isActive: false,
  },
  {
    name: 'Testing ads',
    amount: 10,
    period: 'daily',
    categoryLabel: 'Variable Charges',
    subcategoryLabel: 'Testing ads',
    isActive: true,
  },
];

export const getChargeCategories = async (userId: string) => {
  try {
    const categoriesRef = collection(db, 'users', userId, 'chargeCategories');
    const snapshot = await getDocs(categoriesRef);

    const categories = await Promise.all(
      snapshot.docs.map(async doc => {
        const subcategoriesRef = collection(doc.ref, 'subcategories');
        const subcategoriesSnap = await getDocs(subcategoriesRef);

        const subcategories = subcategoriesSnap.docs.map(subDoc => ({
          id: subDoc.id,
          ...subDoc.data(),
        })) as ChargeSubcategory[];

        return {
          id: doc.id,
          ...doc.data(),
          subcategories,
        } as ChargeCategory;
      })
    );

    if (categories.length === 0) {
      await initializeDefaultCategories(userId);
      return getChargeCategories(userId);
    }

    return categories;
  } catch (error) {
    console.error('Failed to get categories:', error);
    throw error;
  }
};

export const addChargeCategory = async (userId: string, data: Partial<ChargeCategory>) => {
  try {
    const categoryRef = doc(collection(db, 'users', userId, 'chargeCategories'));
    const categoryData = {
      ...data,
      isActive: true,
      id: categoryRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(categoryRef, categoryData);
    return categoryData;
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
};

export const addChargeSubcategory = async (
  userId: string,
  categoryId: string,
  data: Partial<ChargeSubcategory>
) => {
  try {
    const categoryRef = doc(db, 'users', userId, 'chargeCategories', categoryId);
    const subcategoryRef = doc(collection(categoryRef, 'subcategories'));
    const subcategoryData = {
      ...data,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(subcategoryRef, subcategoryData);
    return { ...subcategoryData, id: subcategoryRef.id };
  } catch (error) {
    console.error('Failed to add subcategory:', error);
    throw error;
  }
};

export const updateChargeCategory = async (
  userId: string,
  categoryId: string,
  updates: Partial<ChargeCategory>
) => {
  try {
    const categoryRef = doc(db, 'users', userId, 'chargeCategories', categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
};

export const updateChargeSubcategory = async (
  userId: string,
  categoryId: string,
  subcategoryId: string,
  updates: Partial<ChargeSubcategory>
) => {
  try {
    const categoryRef = doc(db, 'users', userId, 'chargeCategories', categoryId);
    const subcategoryRef = doc(collection(categoryRef, 'subcategories'), subcategoryId);
    await updateDoc(subcategoryRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to update subcategory:', error);
    throw error;
  }
};

export const deleteChargeCategory = async (userId: string, categoryId: string) => {
  try {
    const categoryRef = doc(db, 'users', userId, 'chargeCategories', categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
};

export const deleteChargeSubcategory = async (
  userId: string,
  categoryId: string,
  subcategoryId: string
) => {
  try {
    const categoryRef = doc(db, 'users', userId, 'chargeCategories', categoryId);
    const subcategoryRef = doc(collection(categoryRef, 'subcategories'), subcategoryId);
    await deleteDoc(subcategoryRef);
  } catch (error) {
    console.error('Failed to delete subcategory:', error);
    throw error;
  }
};

export const initializeDefaultCategories = async (userId: string) => {
  try {
    // Delete existing categories first
    const existingCategoriesRef = collection(db, 'users', userId, 'chargeCategories');
    const existingCategoriesSnap = await getDocs(existingCategoriesRef);

    const batch = writeBatch(db);
    existingCategoriesSnap.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Create new categories with subcategories
    const categoryMap = new Map();

    for (const category of DEFAULT_CATEGORIES) {
      const categoryRef = doc(collection(db, 'users', userId, 'chargeCategories'));
      batch.set(categoryRef, {
        label: category.label,
        isActive: category.isActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const subcategoryMap = new Map();

      // Create subcategories
      for (const subcategory of category.subcategories) {
        const subcategoryRef = doc(collection(categoryRef, 'subcategories'));
        batch.set(subcategoryRef, {
          label: subcategory.label,
          isActive: subcategory.isActive,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        subcategoryMap.set(subcategory.label, subcategoryRef);
      }

      categoryMap.set(category.label, { ref: categoryRef, subcategories: subcategoryMap });
    }

    await batch.commit();

    // Add default charges
    const chargesRef = collection(db, 'users', userId, 'monthlyCharges');
    const chargesBatch = writeBatch(db);

    // Clear existing charges first
    const existingChargesSnap = await getDocs(chargesRef);
    existingChargesSnap.docs.forEach(doc => {
      chargesBatch.delete(doc.ref);
    });

    // Add new default charges
    for (const charge of DEFAULT_CHARGES) {
      const category = categoryMap.get(charge.categoryLabel);
      if (category) {
        const subcategoryRef = category.subcategories.get(charge.subcategoryLabel);
        if (subcategoryRef) {
          const chargeRef = doc(chargesRef);
          chargesBatch.set(chargeRef, {
            name: charge.name,
            amount: charge.amount,
            period: charge.period,
            categoryId: category.ref.id,
            subcategoryId: subcategoryRef.id,
            isActive: charge.isActive,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }
    }

    await chargesBatch.commit();
  } catch (error) {
    console.error('Failed to initialize default categories:', error);
    throw error;
  }
};
