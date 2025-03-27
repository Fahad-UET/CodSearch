export interface Tag {
  id: string;
  name: string;
  prompt: string;
}

export interface Category {
  id: string;
  name: string;
  tags: Tag[];
}

export interface ApiKeyFormData {
  apiKey: string;
}