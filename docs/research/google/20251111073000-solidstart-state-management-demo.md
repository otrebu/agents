# Research: SolidStart state management

**Date**: 2025-11-11 08:51:52
**Mode**: code
**Queries**: 4 queries executed
**Sources**: 6 sources found

---

## Summary

SolidStart's state management relies on three core concepts from SolidJS. For simple, individual pieces of state, createSignal is the go-to primitive. For more complex data structures like objects and arrays, createStore provides fine-grained reactivity, allowing updates to nested properties without recreating the entire state. Finally, to share state across the component tree and avoid prop-drilling, the Context API is used by creating a Provider and consuming its value with the useContext hook.

---

## Sources

1. **[SolidJS Docs - createSignal](https://www.solidjs.com/docs/latest/api#createsignal)**
1. **[SolidJS Docs - createStore](https://www.solidjs.com/docs/latest/api#createstore)**
1. **[SolidJS Docs - createContext](https://www.solidjs.com/docs/latest/api#createcontext)**
1. **[Understanding SolidJS Reactivity: Signals vs. Stores](https://karimould.dev/blog/solidjs-signals-vs-stores)**
1. **[How to manage global state in a SolidJS application](https://raqueeb.com/how-to-manage-global-state-in-a-solidjs-application/)**
1. **[SolidJS Tutorial - 06 - Stores](https://www.youtube.com/watch?v=Jz_e1L_d2cQ)**

---

## Code Examples

### A simple counter using createSignal for basic reactive state. The count is a getter function, and setCount is the setter.

**Source**: https://www.solidjs.com/docs/latest/api#createsignal

```typescript
import { createSignal } from 'solid-js';

export default function Counter() {
  const [count, setCount] = createSignal(0);

  const increment = () => {
    setCount(count() + 1);
  };

  return (
    <div>
      <h1>Counter: {count()}</h1>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### A todo list using createStore to manage an array of objects. It demonstrates updating a nested property ('completed') for a specific item in the array without replacing the whole array.

**Source**: https://www.solidjs.com/docs/latest/api#createstore

```typescript
import { createStore } from 'solid-js/store';
import { For } from 'solid-js';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = createStore<Todo[]>([]);

  const toggleTodo = (id: number) => {
    setTodos(
      (todo) => todo.id === id,
      'completed',
      (completed) => !completed
    );
  };

  return (
    <ul>
      <For each={todos}>
        {(todo) => (
          <li onClick={() => toggleTodo(todo.id)}>
            {todo.text}
          </li>
        )}
      </For>
    </ul>
  );
}
```

### Demonstrates sharing state across components using the Context API. A ThemeProvider component creates a signal and provides its value and a toggle function to all children. The useTheme custom hook simplifies consuming the context.

**Source**: https://www.solidjs.com/docs/latest/api#createcontext

```typescript
import { createContext, useContext, createSignal, Accessor } from 'solid-js';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Accessor<Theme>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>();

export function ThemeProvider(props) {
  const [theme, setTheme] = createSignal<Theme>('light');
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
```

---

## Patterns & Best Practices

- Use createSignal for simple, primitive, or top-level state (strings, numbers, booleans).
- Use createStore for complex, nested state like objects and arrays to enable fine-grained updates to their properties.
- Wrap parts of the application in a Provider component to share state via the Context API, avoiding prop-drilling.
- Create custom hooks (e.g., useMyContext) to abstract away useContext and provide a clean, reusable API for accessing shared state.
- For global state that doesn't need to be scoped, signals or stores can be defined in an external file and imported directly into components.

---

## Recommended Libraries

- **solid-js (Provides core reactivity primitives like createSignal, createContext, and useContext).**
- **solid-js/store (Provides the createStore primitive for managing complex, nested state).**

---

## Gotchas & Solutions

**Issue**: Trying to read a signal's value directly.  
**Solution**: Always access a signal's value by calling it as a function (e.g., mySignal()).

**Issue**: Using createSignal for a large, nested object and updating one property.  
**Solution**: This forces a re-render of everything depending on the signal. Use createStore instead, which allows for granular updates to nested properties without re-rendering the entire component.

**Issue**: Calling useContext in a component that is not a descendant of the corresponding Provider.  
**Solution**: Ensure the component is wrapped by the Provider in the component tree. It's a good practice to add a check in the custom useContext hook to throw an error if the context is undefined.

**Issue**: Updating a store with the spread operator like in React (setStore({...store, prop: newValue})).  
**Solution**: This is an anti-pattern in Solid as it replaces the entire store, losing the benefits of fine-grained reactivity. Instead, use the store's setter function with path syntax: setStore('prop', newValue).

---

## Claude's Analysis

_This section will be populated by Claude after analyzing the research findings._

