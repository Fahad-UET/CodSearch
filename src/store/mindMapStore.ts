import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MindMapNode } from '../components/MindMap/types';

interface MindMapState {
  nodes: MindMapNode[];
  selectedNodeId: string | null;
  addNode: (parentId: string | null, label: string) => void;
  updateNode: (id: string, updates: Partial<MindMapNode>) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  addLink: (sourceId: string, targetId: string) => void;
}

export const useMindMapStore = create<MindMapState>()(
  persist(
    (set) => ({
      nodes: [],
      selectedNodeId: null,

      addNode: (parentId, label) => set((state) => {
        const newNode: MindMapNode = {
          id: `node-${Date.now()}`,
          label,
          children: [],
          x: parentId ? undefined : 600, // Center first node
          y: parentId ? undefined : 400
        };

        if (!parentId) {
          return { nodes: [...state.nodes, newNode] };
        }

        const updateChildren = (node: MindMapNode): MindMapNode => {
          if (node.id === parentId) {
            // Position new node relative to parent
            newNode.x = (node.x || 0) + 200;
            newNode.y = (node.y || 0);
            return {
              ...node,
              children: [...(node.children || []), newNode]
            };
          }
          return {
            ...node,
            children: node.children?.map(updateChildren)
          };
        };

        return {
          nodes: state.nodes.map(updateChildren)
        };
      }),

      updateNode: (id, updates) => set((state) => {
        const updateNode = (node: MindMapNode): MindMapNode => {
          if (node.id === id) {
            return { ...node, ...updates };
          }
          return {
            ...node,
            children: node.children?.map(updateNode)
          };
        };

        return {
          nodes: state.nodes.map(updateNode)
        };
      }),

      updateNodePosition: (id, position) => set((state) => {
        const updatePosition = (node: MindMapNode): MindMapNode => {
          if (node.id === id) {
            return { ...node, ...position };
          }
          return {
            ...node,
            children: node.children?.map(updatePosition)
          };
        };

        return {
          nodes: state.nodes.map(updatePosition)
        };
      }),

      deleteNode: (id) => set((state) => {
        const deleteFromChildren = (node: MindMapNode): MindMapNode => ({
          ...node,
          children: node.children
            ?.filter(child => child.id !== id)
            .map(deleteFromChildren)
        });

        return {
          nodes: state.nodes
            .filter(node => node.id !== id)
            .map(deleteFromChildren)
        };
      }),

      setSelectedNode: (id) => set({ selectedNodeId: id }),

      addLink: (sourceId, targetId) => set((state) => {
        const findAndUpdateNode = (node: MindMapNode): MindMapNode => {
          if (node.id === sourceId) {
            const targetNode = state.nodes.find(n => n.id === targetId);
            if (targetNode && !node.children?.some(child => child.id === targetId)) {
              return {
                ...node,
                children: [...(node.children || []), targetNode]
              };
            }
          }
          return {
            ...node,
            children: node.children?.map(findAndUpdateNode)
          };
        };

        return {
          nodes: state.nodes.map(findAndUpdateNode)
        };
      })
    }),
    {
      name: 'mind-map-store',
      version: 1
    }
  )
);