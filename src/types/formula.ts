export interface Variable {
  id: string;
  name: string;
  type: 'number' | 'percentage';
  defaultValue?: number;
}

export interface FormulaElement {
  id: string;
  type: 'operator' | 'variable' | 'number' | 'parenthesis';
  value: string;
}

export interface Formula {
  elements: FormulaElement[];
}

export interface SavedFormula {
  id: string;
  name: string;
  description?: string;
  variables: Variable[];
  formula: Formula;
  createdAt: Date;
  updatedAt: Date;
}