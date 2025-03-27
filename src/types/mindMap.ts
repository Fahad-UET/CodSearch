export interface MindMapNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  children?: { id: string }[];
}

export interface Position {
  x: number;
  y: number;
}