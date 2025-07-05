import { useCallback, useRef, useState } from 'react';

interface AsyncState<T> {
    loading: boolean;
    error: Error | null;
    data: T | null;
}

export function useAsync<T, Args extends unknown[]>(
    asyncFn: (...args: Args) => Promise<T>
) {
    const [state, setState] = useState<AsyncState<T>>({
        loading: false,
        error: null,
        data: null,
    });
    const abortRef = useRef<AbortController | null>(null);

    const run = useCallback(
        async (...args: Args) => {
            setState({ loading: true, error: null, data: null });
            abortRef.current = new AbortController();
            try {
                const data = await asyncFn(...args);
                setState({ loading: false, error: null, data });
                return data;
            } catch (error) {
                setState({ loading: false, error: error as Error, data: null });
                throw error;
            }
        },
        [asyncFn]
    );

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setState((prev) => ({ ...prev, loading: false }));
    }, []);

    return { ...state, run, cancel };
}
