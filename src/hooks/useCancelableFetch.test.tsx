import { renderHook, act } from '@testing-library/react';
import { useCancelableFetch } from './useCancelableFetch';

describe('useCancelableFetch', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('успешно загружает данные', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ foo: 'bar' }),
        }) as unknown as typeof fetch;

        const { result } = renderHook(() =>
            useCancelableFetch<{ foo: string }>()
        );
        await act(async () => {
            const data = await result.current.fetchData('/api/test');
            expect(data).toEqual({ foo: 'bar' });
        });
        expect(result.current.data).toEqual({ foo: 'bar' });
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.aborted).toBe(false);
    });

    it('обрабатывает ошибку ответа', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            statusText: 'Not Found',
        }) as unknown as typeof fetch;

        const { result } = renderHook(() => useCancelableFetch());
        await act(async () => {
            await expect(
                result.current.fetchData('/api/error')
            ).rejects.toThrow('Not Found');
        });
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.aborted).toBe(false);
    });

    it('отменяет запрос', async () => {
        const abortSpy = jest.fn();
        const controller: AbortController = {
            abort: abortSpy,
            signal: {} as AbortSignal,
        };
        jest.spyOn(window, 'AbortController').mockImplementation(
            () => controller
        );
        global.fetch = jest.fn(
            () =>
                new Promise((_, reject) => {
                    setTimeout(() => {
                        const error = new Error('Aborted');
                        (error as Error).name = 'AbortError';
                        reject(error);
                    }, 10);
                })
        ) as unknown as typeof fetch;

        const { result } = renderHook(() => useCancelableFetch());
        let fetchPromise: Promise<unknown>;
        await act(async () => {
            fetchPromise = result.current.fetchData('/api/long');
            result.current.cancel();
            try {
                await fetchPromise;
            } catch (e: unknown) {
                if (!(e instanceof Error) || e.name !== 'AbortError') throw e;
                // Ожидаем AbortError, не считаем ошибкой теста
            }
        });
        expect(abortSpy).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.aborted).toBe(true);
    });
});
