import { create } from 'zustand';
import { ProductCardRelationship } from '@/types/card-relationships';

interface CardRelationshipState {
  relationships: Record<string, ProductCardRelationship>;
  addRelationship: (relationship: ProductCardRelationship) => void;
  updateRelationship: (id: string, updates: Partial<ProductCardRelationship>) => void;
  getChildCards: (parentId: string) => string[];
  getParentCard: (childId: string) => string | null;
  syncCardChanges: (parentId: string, changes: Record<string, any>) => void;
}

export const useCardRelationshipStore = create<CardRelationshipState>((set, get) => ({
  relationships: {},

  addRelationship: (relationship) => {
    set(state => ({
      relationships: {
        ...state.relationships,
        [relationship.id]: relationship
      }
    }));
  },

  updateRelationship: (id, updates) => {
    set(state => ({
      relationships: {
        ...state.relationships,
        [id]: {
          ...state.relationships[id],
          ...updates,
          updatedAt: new Date()
        }
      }
    }));
  },

  getChildCards: (parentId) => {
    const relationship = Object.values(get().relationships)
      .find(r => r.id === parentId);
    return relationship?.childIds || [];
  },

  getParentCard: (childId) => {
    const relationship = Object.values(get().relationships)
      .find(r => r.childIds.includes(childId));
    return relationship?.id || null;
  },

  syncCardChanges: (parentId, changes) => {
    const relationship = get().relationships[parentId];
    if (!relationship) return;

    // Update all child cards with inherited changes
    relationship.childIds.forEach(childId => {
      const childRelationship = get().relationships[childId];
      if (!childRelationship) return;

      const inheritedChanges = Object.keys(changes)
        .filter(key => childRelationship.inheritedFields.includes(key))
        .reduce((acc, key) => ({
          ...acc,
          [key]: changes[key]
        }), {});

      get().updateRelationship(childId, {
        ...inheritedChanges,
        syncStatus: 'synced'
      });
    });
  }
}));