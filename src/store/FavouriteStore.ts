import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoritesList, CreateListDto, FavoriteItem } from '../types';
import type { AdCreative } from '../types';

// Define the Zustand store type for managing favorites
interface FavoritesStore {
  lists: FavoritesList[];
  createList: (data: CreateListDto) => void;
  updateList: (id: string, data: Partial<FavoritesList>) => void;
  deleteList: (id: string) => void;
  addToList: (listId: string, ad: AdCreative) => void;
  removeFromList: (listId: string, adId: string) => void;
  reorderItems: (listId: string, sourceIndex: number, destinationIndex: number) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    set => ({
      lists: [],
      createList: (data: CreateListDto) =>
        set(state => {
          const newList: FavoritesList = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name,
            description: data.description,
            isPublic: data.isPublic ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: 'current-user', // Replace with actual user ID
            items: [],
          };
          return { lists: [...state.lists, newList] };
        }),

      // Update an existing list
      updateList: (id: string, data: Partial<FavoritesList>) =>
        set(state => ({
          lists: state.lists.map(list =>
            list.id === id ? { ...list, ...data, updatedAt: new Date() } : list
          ),
        })),

      // Delete a list
      deleteList: (id: string) =>
        set(state => ({
          lists: state.lists.filter(list => list.id !== id),
        })),

      // Add an ad to a list
      addToList: (listId: string, ad: AdCreative) =>
        set(state => ({
          lists: state.lists.map(list => {
            if (list.id !== listId) return list;
            const newItem: FavoriteItem = {
              id: Math.random().toString(36).substr(2, 9),
              listId,
              adId: ad.id,
              position: list.items.length,
              addedAt: new Date(),
            };
            return { ...list, items: [...list.items, newItem], updatedAt: new Date() };
          }),
        })),

      // Remove an ad from a list
      removeFromList: (listId: string, adId: string) =>
        set(state => ({
          lists: state.lists.map(list => {
            if (list.id !== listId) return list;
            return {
              ...list,
              items: list.items.filter(item => item.adId !== adId),
              updatedAt: new Date(),
            };
          }),
        })),

      // Reorder items within a list
      reorderItems: (listId: string, sourceIndex: number, destinationIndex: number) =>
        set(state => ({
          lists: state.lists.map(list => {
            if (list.id !== listId) return list;
            const newItems = [...list.items];
            const [removed] = newItems.splice(sourceIndex, 1);
            newItems.splice(destinationIndex, 0, removed);

            const updatedItems = newItems.map((item, index) => ({
              ...item,
              position: index,
            }));
            return { ...list, items: updatedItems, updatedAt: new Date() };
          }),
        })),
    }),
    {
      name: 'favorites-store', // Persisted storage key
      version: 1,
    }
  )
);
