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
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { List } from '../../types';

export const createList = async (boardId: string, list: Omit<List, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const listRef = doc(collection(db, 'boards', boardId, 'lists'));
    const listData = {
      ...list,
      id: listRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(listRef, listData);
    return listData;
  } catch (error) {
    console.error('Failed to create list:', error);
    throw error;
  }
};

export const updateList = async (boardId: string, listId: string, updates: Partial<List>) => {
  try {
    const listRef = doc(db, 'boards', boardId, 'lists', listId);
    await updateDoc(listRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to update list:', error);
    throw error;
  }
};

export const deleteList = async (boardId: string, listId: string) => {
  try {
    const listRef = doc(db, 'boards', boardId, 'lists', listId);
    await deleteDoc(listRef);
  } catch (error) {
    console.error('Failed to delete list:', error);
    throw error;
  }
};

export const getBoardLists = async (boardId: string) => {
  try {
    const listsRef = collection(db, 'boards', boardId, 'lists');
    const snapshot = await getDocs(listsRef);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as List[];
  } catch (error) {
    console.error('Failed to get board lists:', error);
    throw error;
  }
};

export const reorderLists = async (boardId: string, lists: List[]) => {
  try {
    const batch = writeBatch(db);
    
    lists.forEach((list, index) => {
      const listRef = doc(db, 'boards', boardId, 'lists', list.id);
      batch.update(listRef, {
        order: index,
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Failed to reorder lists:', error);
    throw error;
  }
};