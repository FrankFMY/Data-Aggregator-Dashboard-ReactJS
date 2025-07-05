import { useCallback, useRef, useState } from 'react';

interface FetchState<T> {
    loading: boolean;
    error: Error | null;
    data: T | null;
}

export function useFetch<T = unknown>() {
    const [state, setState] = useState<FetchState<T>>({
        loading: false,
        error: null,
        data: null,
    });
    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(
        async (url: string, options?: RequestInit & { timeout?: number }) => {
            setState({ loading: true, error: null, data: null });
            abortRef.current = new AbortController();
            const { timeout, ...rest } = options || {};
            const controller = abortRef.current;
            let timer: ReturnType<typeof setTimeout> | null = null;
            if (timeout) {
                timer = setTimeout(() => controller.abort(), timeout);
            }
            try {
                const response = await fetch(url, {
                    ...rest,
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(response.statusText);
                const data = (await response.json()) as T;
                setState({ loading: false, error: null, data });
                return data;
            } catch (error) {
                setState({ loading: false, error: error as Error, data: null });
                throw error;
            } finally {
                if (timer) clearTimeout(timer);
            }
        },
        []
    );

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setState((prev) => ({ ...prev, loading: false }));
    }, []);

    return { ...state, fetchData, cancel };
}
