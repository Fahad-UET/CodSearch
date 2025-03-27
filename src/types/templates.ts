export interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  description?: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}