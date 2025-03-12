"use client"
import { useCallback, useEffect, useState } from "react"
import { ApiError } from "../types/api"

interface UseFetchOptions<T> {
  initialData?: T
  dependencies?: any[]
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
}

export const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) => {
  const { initialData, dependencies = [], onSuccess, onError } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      if (onError) onError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, onSuccess, onError]);
  
  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);
  
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);
  
  return { data, isLoading, error, refetch };
};

