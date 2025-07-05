import { useCallback, useRef, useState } from 'react';

export type PromiseMode = 'parallel' | 'sequential' | 'race' | 'allSettled';

interface UsePromiseManagerOptions {
  mode: PromiseMode;
  retry?: number;
  timeout?: number;
}

interface PromiseResult<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
  aborted: boolean;
}

interface UsePromiseManagerReturn<T> {
  results: PromiseResult<T>[];
  run: () => void;
  cancel: () => void;
  progress: number; // 0..1
  status: 'idle' | 'loading' | 'success' | 'error' | 'aborted';
}

/**
 * Универсальный хук для управления массивом асинхронных функций с поддержкой разных режимов.
 * @param fetchers Массив функций, возвращающих Promise
 * @param options Режим работы, retry, timeout
 */
export function usePromiseManager<T>(
  fetchers: (() => Promise<T>)[],
  options: UsePromiseManagerOptions,
): UsePromiseManagerReturn<T> {
  const { mode, retry = 1, timeout } = options;
  const [results, setResults] = useState<PromiseResult<T>[]>(
    fetchers.map(() => ({
      loading: false,
      error: null,
      data: null,
      aborted: false,
    })),
  );
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'aborted'>(
    'idle',
  );
  const [progress, setProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Вспомогательная функция для запуска с retry и timeout
  const runWithRetry = useCallback(
    async (fn: () => Promise<T>, maxAttempts: number, timeoutMs?: number, signal?: AbortSignal) => {
      let attempt = 0;
      let lastError: Error | null = null;
      while (attempt < maxAttempts) {
        try {
          if (timeoutMs) {
            return await Promise.race([
              fn(),
              new Promise<T>((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), timeoutMs),
              ),
            ]);
          } else {
            return await fn();
          }
        } catch (err) {
          if (signal?.aborted) throw new Error('Aborted');
          lastError = err as Error;
          attempt++;
        }
      }
      throw lastError;
    },
    [],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus('aborted');
    setResults((prev) => prev.map((r) => ({ ...r, loading: false, aborted: true })));
  }, []);

  const run = useCallback(() => {
    setStatus('loading');
    setProgress(0);
    setResults(
      fetchers.map(() => ({
        loading: true,
        error: null,
        data: null,
        aborted: false,
      })),
    );
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const updateResult = (idx: number, partial: Partial<PromiseResult<T>>) => {
      setResults((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], ...partial };
        return next;
      });
    };

    const handleProgress = (done: number) => {
      setProgress(done / fetchers.length);
    };

    const runParallel = async () => {
      let done = 0;
      await Promise.all(
        fetchers.map((fetcher, idx) =>
          runWithRetry(fetcher, retry, timeout, signal)
            .then((data) => {
              updateResult(idx, {
                loading: false,
                data,
                error: null,
              });
            })
            .catch((error) => {
              updateResult(idx, {
                loading: false,
                error: error as Error,
              });
            })
            .finally(() => {
              done++;
              handleProgress(done);
            }),
        ),
      );
    };

    const runSequential = async () => {
      let done = 0;
      for (let i = 0; i < fetchers.length; i++) {
        try {
          const data = await runWithRetry(fetchers[i], retry, timeout, signal);
          updateResult(i, { loading: false, data, error: null });
        } catch (error) {
          updateResult(i, { loading: false, error: error as Error });
          break; // Останавливаем цепочку при ошибке
        } finally {
          done++;
          handleProgress(done);
        }
      }
    };

    const runRace = async () => {
      let settled = false;
      await Promise.race(
        fetchers.map((fetcher, idx) =>
          runWithRetry(fetcher, retry, timeout, signal)
            .then((data) => {
              if (!settled) {
                settled = true;
                updateResult(idx, {
                  loading: false,
                  data,
                  error: null,
                });
                setResults((prev) =>
                  prev.map((r, i) =>
                    i !== idx
                      ? {
                          ...r,
                          loading: false,
                          aborted: true,
                        }
                      : r,
                  ),
                );
              }
            })
            .catch((error) => {
              if (!settled) {
                settled = true;
                updateResult(idx, {
                  loading: false,
                  error: error as Error,
                });
                setResults((prev) =>
                  prev.map((r, i) =>
                    i !== idx
                      ? {
                          ...r,
                          loading: false,
                          aborted: true,
                        }
                      : r,
                  ),
                );
              }
            }),
        ),
      );
      setProgress(1);
    };

    const runAllSettled = async () => {
      let done = 0;
      await Promise.all(
        fetchers.map((fetcher, idx) =>
          runWithRetry(fetcher, retry, timeout, signal)
            .then((data) => {
              updateResult(idx, {
                loading: false,
                data,
                error: null,
              });
            })
            .catch((error) => {
              updateResult(idx, {
                loading: false,
                error: error as Error,
              });
            })
            .finally(() => {
              done++;
              handleProgress(done);
            }),
        ),
      );
    };

    (async () => {
      try {
        switch (mode) {
          case 'parallel':
            await runParallel();
            break;
          case 'sequential':
            await runSequential();
            break;
          case 'race':
            await runRace();
            break;
          case 'allSettled':
            await runAllSettled();
            break;
        }
        setStatus('success');
      } catch {
        if (signal.aborted) {
          setStatus('aborted');
        } else {
          setStatus('error');
        }
      }
    })();
  }, [fetchers, mode, retry, timeout, runWithRetry]);

  return {
    results,
    run,
    cancel,
    progress,
    status,
  };
}

// Пример использования:
// const { results, run, cancel, progress, status } = usePromiseManager([fetch1, fetch2], { mode: 'parallel', retry: 2, timeout: 5000 });
