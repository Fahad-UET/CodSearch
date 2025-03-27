# Coding Best Practices

## File Organization

### 1. Small and Focused Files
- Each file should have a single responsibility
- Keep files under 200 lines of code when possible
- Split large components into smaller sub-components

### 2. Component Structure
```
src/
  ├── components/
  │   ├── ComponentName/
  │   │   ├── index.tsx              # Main component
  │   │   ├── SubComponent.tsx       # Related sub-components
  │   │   ├── hooks/                 # Component-specific hooks
  │   │   ├── utils/                 # Component-specific utilities
  │   │   └── types.ts              # Component-specific types
  │   └── ...
  ├── hooks/                         # Shared hooks
  ├── utils/                         # Shared utilities
  ├── services/                      # API and external services
  ├── store/                         # State management
  └── types/                         # Shared types
```

### 3. Code Organization
- Group related code together
- Extract reusable logic into hooks
- Keep business logic separate from UI components
- Use TypeScript interfaces for prop types

### 4. Naming Conventions
- Use PascalCase for components: `ProductCard.tsx`
- Use camelCase for utilities: `formatCurrency.ts`
- Use kebab-case for CSS classes: `product-card`
- Use descriptive names that indicate purpose

### 5. Component Guidelines
- Break down complex components
- Extract reusable UI elements
- Keep components pure when possible
- Use composition over inheritance

### 6. State Management
- Keep state as local as possible
- Use context for shared state
- Document state updates
- Handle loading and error states

### 7. Performance
- Memoize expensive calculations
- Use React.memo for pure components
- Lazy load routes and large components
- Optimize re-renders

### 8. Testing
- Write unit tests for utilities
- Test component behavior
- Mock external dependencies
- Use meaningful test descriptions

### 9. Documentation
- Document complex logic
- Add JSDoc comments for functions
- Include usage examples
- Keep documentation up-to-date

### 10. Error Handling
- Use try/catch blocks
- Display user-friendly error messages
- Log errors appropriately
- Handle edge cases