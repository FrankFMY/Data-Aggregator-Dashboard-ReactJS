import { useCallback, useRef, useState } from 'react';

interface AsyncState<T> {
    loading: boolean;
    error: Error | null;
    data: T | null;
    attempts: number;
}

export function useAsync<T, Args extends unknown[]>(
    asyncFn: (...args: Args) => Promise<T>,
    maxAttempts = 1,
    baseDelay = 500
) {
    const [state, setState] = useState<AsyncState<T>>({
        loading: false,
        error: null,
        data: null,
        attempts: 0,
    });
    const abortRef = useRef<AbortController | null>(null);
    const isMounted = useRef(true);

    const run = useCallback(
        async (...args: Args) => {
            setState({ loading: true, error: null, data: null, attempts: 0 });
            abortRef.current = new AbortController();
            let attempt = 0;
            let lastError: Error | null = null;
            while (attempt < maxAttempts) {
                try {
                    const data = await asyncFn(...args);
                    if (isMounted.current)
                        setState({
                            loading: false,
                            error: null,
                            data,
                            attempts: attempt + 1,
                        });
                    return data;
                } catch (error) {
                    lastError = error as Error;
                    attempt++;
                    if (attempt < maxAttempts) {
                        await new Promise((res) =>
                            setTimeout(
                                res,
                                baseDelay * Math.pow(2, attempt - 1)
                            )
                        );
                    }
                }
            }
            if (isMounted.current)
                setState({
                    loading: false,
                    error: lastError,
                    data: null,
                    attempts: attempt,
                });
            throw lastError;
        },
        [asyncFn, maxAttempts, baseDelay]
    );

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setState((prev) => ({ ...prev, loading: false }));
    }, []);

    // Очищаем флаг при размонтировании
    useState(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    });

    return { ...state, run, cancel };
}
