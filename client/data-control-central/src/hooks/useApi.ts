// src/hooks/useApi.ts
import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...params: P) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await apiFunction(...params);
        setState({ data: response, loading: false, error: null });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : "An error occurred";
        setState({ data: null, loading: false, error });
        throw err;
      }
    },
    [apiFunction]
  );

  return {
    ...state,
    execute,
  };
}
