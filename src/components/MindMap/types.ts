export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  x?: number;
  y?: number;
  color?: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: Array<{
    source: string;
    target: string;
  }>;
}