import { Parser } from 'expr-eval';
import { Formula } from '../types/formula';

export function evaluateFormula(formula: Formula, variables: Record<string, number>): number {
  try {
    // Handle empty formula
    if (formula.elements.length === 0) {
      return 0;
    }

    const parser = new Parser();

    // Convert formula elements to expression string
    const expression = formula.elements
      .map(element => {
        if (element.type === 'variable') {
          // Get variable value, default to 0 if undefined
          const value = variables[element.value];
          return value !== undefined ? `(${value})` : '0';
        } else if (element.type === 'operator') {
          // Handle multiplication operator
          return element.value === '×' ? '*' : element.value;
        }
        return element.value;
      })
      .join(' ');

    // Handle empty expression
    if (!expression.trim()) {
      return 0;
    }

    try {
      // Parse and evaluate
      const parsedExpression = parser.parse(expression);
      const result = parsedExpression.evaluate({});

      // Validate result
      if (typeof result !== 'number' || !isFinite(result)) {
        console.warn('Invalid formula result:', result);
        return 0;
      }

      return result;
    } catch (parseError) {
      console.warn('Failed to parse expression:', expression, parseError);
      return 0;
    }
  } catch (error) {
    console.error('Failed to evaluate formula:', error);
    return 0;
  }
}

export function validateFormula(formula: Formula): boolean {
  try {
    if (formula.elements.length === 0) {
      return true;
    }

    const parser = new Parser();
    
    // Convert formula to expression using dummy values
    const expression = formula.elements
      .map(element => {
        if (element.type === 'variable') {
          return '1';
        } else if (element.type === 'operator') {
          return element.value === '×' ? '*' : element.value;
        }
        return element.value;
      })
      .join(' ');

    if (!expression.trim()) {
      return true;
    }

    // Try parsing with dummy variables
    parser.parse(expression);

    // Check for basic formula validity
    const hasOperator = formula.elements.some(el => el.type === 'operator');
    const hasVariable = formula.elements.some(el => el.type === 'variable');
    
    // Formula should have at least one operator and one variable/number
    return hasOperator && hasVariable;
  } catch (error) {
    console.warn('Formula validation failed:', error);
    return false;
  }
}

export function formatFormula(formula: Formula): string {
  return formula.elements
    .map(element => {
      if (element.type === 'operator') {
        return ` ${element.value} `;
      }
      return element.value;
    })
    .join('')
    .trim();
}