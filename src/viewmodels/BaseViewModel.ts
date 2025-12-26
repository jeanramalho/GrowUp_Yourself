/**
 * Base ViewModel pattern using Zustand
 * Provides a template for creating typed, reactive state management
 */

import { create, StateCreator } from 'zustand';

/**
 * Generic ViewModel state interface
 * All ViewModels should extend this
 */
export interface ViewModelState {
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

/**
 * Helper function to create a typed ViewModel store
 * Automatically includes loading and error state management
 *
 * @example
 * ```ts
 * interface MetaViewModelState extends ViewModelState {
 *   metas: Meta[];
 *   addMeta: (meta: Meta) => void;
 * }
 *
 * export const useMetaViewModel = createViewModel<MetaViewModelState>(
 *   'MetaViewModel',
 *   (set) => ({
 *     metas: [],
 *     isLoading: false,
 *     error: null,
 *     addMeta: (meta) =>
 *       set((state) => ({ metas: [...state.metas, meta] })),
 *     setError: (error) => set({ error }),
 *     setLoading: (isLoading) => set({ isLoading }),
 *     reset: () => set({ metas: [], isLoading: false, error: null }),
 *   })
 * );
 * ```
 */
export function createViewModel<T extends ViewModelState>(
  name: string,
  stateCreator: StateCreator<T>
) {
  return create<T>(stateCreator);
}

/**
 * Base ViewModel class for more complex state management
 * Provides lifecycle hooks and common patterns
 */
export abstract class BaseViewModel<T extends ViewModelState> {
  protected store: T;
  protected name: string;

  constructor(name: string, store: T) {
    this.name = name;
    this.store = store;
  }

  /**
   * Execute an async operation with automatic error and loading handling
   */
  protected async withLoading<R>(
    operation: () => Promise<R>,
    errorHandler?: (error: unknown) => string
  ): Promise<R | null> {
    try {
      this.store.setLoading(true);
      this.store.setError(null);
      const result = await operation();
      this.store.setLoading(false);
      return result;
    } catch (error) {
      const errorMessage = errorHandler
        ? errorHandler(error)
        : error instanceof Error
          ? error.message
          : 'Unknown error occurred';
      this.store.setError(errorMessage);
      this.store.setLoading(false);
      console.error(`[${this.name}] Error:`, errorMessage);
      return null;
    }
  }

  /**
   * Get the current store state
   */
  getState(): T {
    return this.store;
  }

  /**
   * Reset the view model to initial state
   */
  reset(): void {
    this.store.reset();
  }
}

/**
 * Hook composition helper
 * Allows creating custom hooks that select specific parts of the state
 *
 * @example
 * ```ts
 * const useMetas = () => useMetaViewModel((state) => state.metas);
 * const useIsLoading = () => useMetaViewModel((state) => state.isLoading);
 * ```
 */
export type ViewModelHook<T extends ViewModelState, S extends keyof T = keyof T> = (
  selector?: (state: T) => T[S]
) => T[S];
