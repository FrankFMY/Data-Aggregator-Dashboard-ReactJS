import { renderHook, act } from '@testing-library/react';
import { useRetry } from './useRetry';

describe('useRetry', () => {
    it('успешно возвращает данные с первого раза', async () => {
        const asyncFn = jest.fn().mockResolvedValue('ok');
        const { result } = renderHook(() => useRetry(asyncFn));
        await act(async () => {
            const data = await result.current.run();
            expect(data).toBe('ok');
        });
        expect(asyncFn).toHaveBeenCalledTimes(1);
        expect(result.current.data).toBe('ok');
        expect(result.current.error).toBeNull();
        expect(result.current.attempts).toBe(1);
    });

    it('делает повторные попытки при ошибке и возвращает данные', async () => {
        const asyncFn = jest
            .fn()
            .mockRejectedValueOnce(new Error('fail'))
            .mockResolvedValueOnce('ok');
        const { result } = renderHook(() => useRetry(asyncFn, 2, 10));
        await act(async () => {
            const data = await result.current.run();
            expect(data).toBe('ok');
        });
        expect(asyncFn).toHaveBeenCalledTimes(2);
        expect(result.current.data).toBe('ok');
        expect(result.current.error).toBeNull();
        expect(result.current.attempts).toBe(2);
    });

    it('ограничивает число попыток и возвращает ошибку', async () => {
        const asyncFn = jest.fn().mockRejectedValue(new Error('fail'));
        const { result } = renderHook(() => useRetry(asyncFn, 3, 10));
        await act(async () => {
            await expect(result.current.run()).rejects.toThrow('fail');
        });
        expect(asyncFn).toHaveBeenCalledTimes(3);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.attempts).toBe(3);
    });
});
