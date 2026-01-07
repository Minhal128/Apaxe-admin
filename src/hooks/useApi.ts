import { useState, useEffect } from 'react';
import { type AxiosResponse } from 'axios';

interface UseApiState<T> {
  data: T | null;
  meta?: any;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  revalidateOnFocus?: boolean;
  onSuccess?: (data: any, meta?: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T>(
  apiCall: () => Promise<AxiosResponse<any>>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      const data = response.data?.data || response.data;
      const meta = response.data?.meta;

      setState({
        data,
        meta,
        loading: false,
        error: null,
      });

      if (onSuccess) {
        onSuccess(data, meta);
      }

      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      if (onError) {
        onError(error);
      }

      throw error;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

export function useApiMutation<T>(
  apiCall: (...args: any[]) => Promise<AxiosResponse<any>>,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall(...args);
      const data = response.data?.data || response.data;

      setState({
        data,
        loading: false,
        error: null,
      });

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      if (onError) {
        onError(error);
      }

      throw error;
    }
  };

  return {
    ...state,
    mutate,
  };
}