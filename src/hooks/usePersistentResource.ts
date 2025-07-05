import { useCallback, useEffect, useState } from 'react';

interface PersistentResourceOptions<T> {
    storageKey: string;
    fetcher: () => Promise<T>;
    parse?: (raw: string) => T | null;
    serialize?: (data: T) => string;
}

export function usePersistentResource<T>({
    storageKey,
    fetcher,
    parse = JSON.parse,
    serialize = JSON.stringify,
}: PersistentResourceOptions<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Загрузка из localStorage при инициализации
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                setData(parse(saved));
            } catch {
                // ignore некорректные данные
            }
        }
    }, [storageKey, parse]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
            localStorage.setItem(storageKey, serialize(result));
        } catch (e: unknown) {
            setError(
                e instanceof Error ? e : new Error('Ошибка загрузки данных')
            );
        } finally {
            setLoading(false);
        }
    }, [fetcher, storageKey, serialize]);

    const clear = useCallback(() => {
        setData(null);
        localStorage.removeItem(storageKey);
    }, [storageKey]);

    return { data, loading, error, load, clear };
}
