import { UniqueIdentifier } from '@dnd-kit/core';
export interface Sortable {
    id: UniqueIdentifier;
    position: number;
  }

// Simple pass-through function with no sorting
export const getProducts = (products) => products;
export function updatePositions<T extends Sortable>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    position: index,
  }));
}
export function moveItem<T extends Sortable>(
    items: T[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier
  ): T[] {
    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);
  
    if (oldIndex === -1 || newIndex === -1) {
      return items;
    }
  
    const result = [...items];
    const [movedItem] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, movedItem);
  
    return updatePositions(result);
  }