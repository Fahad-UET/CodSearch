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
import { db, auth } from './config';
import { getBoardProducts } from './products';
import { useLanguageStore } from '../../store/languageStore';

export const getUserBoards = async (userId: string, email: string | null | undefined) => {
  try {
    if (!email) {
      console.warn('No email available, returning empty boards list');
      return [];
    }

    const boardsRef = collection(db, 'boards');
    const q = query(boardsRef, where('boardMembers', 'array-contains', email));
    const snapshot = await getDocs(q);

    const boards = await Promise.all(
      snapshot.docs.map(async doc => {
        const products = await getBoardProducts(doc.id);
        return { ...doc.data(), id: doc.id, products };
      })
    );

    return boards;
  } catch (error) {
    console.error('Failed to fetch user boards:', error);
    return [];
  }
};

export const createBoard = async (userId: string, name: string) => {
  try {
    const boardRef = doc(collection(db, 'boards'));
    const userEmail = auth.currentUser?.email;

    if (!userEmail) {
      throw new Error('User email not found');
    }

    const boardData = {
      name,
      ownerId: userId,
      members: [
        {
          email: userEmail,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      boardMembers: [userEmail],
      lists: [],
      products: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(boardRef, boardData);
    return {
      ...boardData,
      id: boardRef.id,
      lists: [],
      products: [],
    };
  } catch (error) {
    console.error('Failed to create board:', error);
    throw error;
  }
};

export const createDefaultBoard = async (userId: string) => {
  try {
    // First check if user already has a default board
    const boardsRef = collection(db, 'boards');
    const q = query(boardsRef, where('ownerId', '==', userId), where('boardType', '==', 'default'));
    const snapshot = await getDocs(q);

    // If default board exists, return it
    if (!snapshot.empty) {
      const existingBoard = snapshot.docs[0];
      const products = await getBoardProducts(existingBoard.id);
      return { ...existingBoard.data(), id: existingBoard.id, products };
    }

    // If no default board exists, create one
    const boardRef = doc(collection(db, 'boards'));
    const { language } = useLanguageStore.getState();

    const DEFAULT_LISTS = [
      {
        id: 'products',
        title: language === 'ar' ? 'المنتجات' : 'Products',
        order: 1,
        description: 'Track product ideas and research.',
        canDelete: true,
      },
      {
        id: 'to_test',
        title: language === 'ar' ? 'للاختبار' : 'Qualify Product',
        order: 2,
        description: 'Identify items or features that need testing.',
        canDelete: true,
      },
      {
        id: 'content_creation',
        title: language === 'ar' ? 'إنشاء المحتوى' : 'Content Creation',
        order: 3,
        description: 'Plan and manage content creation tasks.',
        canDelete: true,
      },
      {
        id: 'test_in_progress',
        title: language === 'ar' ? 'جاري الاختبار' : 'Test In Progress',
        order: 4,
        description: 'Track items that are currently being tested.',
        canDelete: true,
      },
      {
        id: 'to_order',
        title: language === 'ar' ? 'للطلب' : 'To Order',
        order: 5,
        description: 'Maintain a list of items that need to be ordered.',
        canDelete: true,
      },
      {
        id: 'to_archive',
        title: language === 'ar' ? 'للأرشفة' : 'To Archive',
        order: 6,
        description: 'Organize completed tasks or items to archive.',
        canDelete: true,
      },
    ];

    const boardData = {
      name: language === 'ar' ? 'إدارة سير العمل' : 'Workflow Manager',
      boardType: 'default',
      ownerId: userId,
      members: [
        {
          email: auth.currentUser?.email,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      boardMembers: [auth.currentUser?.email],
      lists: DEFAULT_LISTS,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(boardRef, boardData);
    return { ...boardData, id: boardRef.id };
  } catch (error) {
    console.error('Failed to create default board:', error);
    throw error;
  }
};

export const getOrCreateDefaultBoard = async (userId: string) => {
  try {
    // First try to find an existing default board
    const boardsRef = collection(db, 'boards');
    const q = query(boardsRef, where('ownerId', '==', userId), where('boardType', '==', 'default'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Return the existing default board
      const boardDoc = snapshot.docs[0];
      const products = await getBoardProducts(boardDoc.id);
      return { ...boardDoc.data(), id: boardDoc.id, products };
    }

    // If no default board exists, create one
    return createDefaultBoard(userId);
  } catch (error) {
    console.error('Failed to get or create default board:', error);
    throw error;
  }
};

export const updateBoard = async (boardId: string, updates: any) => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const updatedData = { ...updates, updatedAt: serverTimestamp() };
    await updateDoc(boardRef, updatedData);

    const boardSnap = await getDoc(boardRef);
    if (!boardSnap.exists()) {
      throw new Error('Board not found after update');
    }

    const products = await getBoardProducts(boardId);
    return { ...boardSnap.data(), id: boardId, products };
  } catch (error) {
    console.error('Failed to update board:', error);
    throw error;
  }
};

export const deleteBoard = async (boardId: string) => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    await deleteDoc(boardRef);
  } catch (error) {
    console.error('Failed to delete board:', error);
    throw error;
  }
};
