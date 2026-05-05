// Lightweight compile-time shims for this restricted environment. A normal
// `npm install` supplies the full React/Vite types used by the app.
declare module 'react' {
  export const StrictMode: (props: { children?: unknown }) => unknown;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useState<T>(initial: T): [T, (value: T | ((current: T) => T)) => void];
  export type Dispatch<T> = (value: T) => void;
  export type SetStateAction<T> = T | ((previous: T) => T);
}

declare module 'react-dom/client' {
  export function createRoot(element: Element): { render(children: unknown): void };
}

declare module 'react/jsx-runtime' {
  export const jsx: unknown;
  export const jsxs: unknown;
  export const Fragment: unknown;
}

declare namespace React {
  type Dispatch<T> = (value: T) => void;
  type SetStateAction<T> = T | ((previous: T) => T);
}

declare namespace JSX {
  interface IntrinsicAttributes { key?: string | number; }
  interface IntrinsicElements { [elementName: string]: any; }
}
