export interface Variable {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'currency';
  description?: string;
}

export interface CreateVariableDto {
  name: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'currency';
  description?: string;
}
