import { useState, useMemo, useCallback } from 'react';
import { fetchUsers, fetchPosts } from '../api/jsonplaceholder';
import { fetchWeather } from '../api/openweather';
import { fetchCurrency } from '../api/exchangerate';
import { ResultCard } from '../shared/ResultCard';
import type { ResultStatus } from '../shared/ResultCard';
import { Modal } from '../shared/Modal';
import { Skeleton } from '../shared/Skeleton';
import { ErrorBlock } from '../shared/ErrorBlock';
import {
    UserIcon,
    DocumentTextIcon,
    CloudIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { usePromiseManager } from '../hooks/usePromiseManager';
import type { PromiseMode } from '../hooks/usePromiseManager';
import { motion, AnimatePresence } from 'framer-motion';

const apiOptions = [
    {
        key: 'users',
        label: 'Пользователи',
        fetcher: fetchUsers,
        icon: <UserIcon className='w-5 h-5 text-blue-500' />,
    },
    {
        key: 'posts',
        label: 'Посты',
        fetcher: fetchPosts,
        icon: <DocumentTextIcon className='w-5 h-5 text-green-500' />,
    },
    {
        key: 'weather',
        label: 'Погода',
        fetcher: fetchWeather,
        icon: <CloudIcon className='w-5 h-5 text-cyan-500' />,
    },
    {
        key: 'currency',
        label: 'Курсы валют',
        fetcher: fetchCurrency,
        icon: <CurrencyDollarIcon className='w-5 h-5 text-yellow-500' />,
    },
];

type ApiKey = 'users' | 'posts' | 'weather' | 'currency';

const MODES: { value: PromiseMode; label: string; description: string }[] = [
    {
        value: 'parallel',
        label: 'Параллельно (Promise.all)',
        description:
            'Все запросы выполняются одновременно. Ошибка любого — ошибка всей группы.',
    },
    {
        value: 'sequential',
        label: 'Последовательно (цепочка)',
        description:
            'Запросы выполняются по очереди. Следующий стартует только после завершения предыдущего.',
    },
    {
        value: 'race',
        label: 'Race (первый ответ)',
        description:
            'Результат — первый успешно завершившийся запрос. Остальные отменяются.',
    },
    {
        value: 'allSettled',
        label: 'AllSettled (все статусы)',
        description:
            'Все запросы выполняются параллельно. Возвращаются статусы всех, независимо от ошибок.',
    },
];

// Вспомогательная функция для определения статуса
function getStatus(result: {
    loading: boolean;
    error: Error | null;
    data: unknown;
    aborted: boolean;
}): ResultStatus {
    if (result.loading) return 'loading';
    if (result.aborted) return 'aborted';
    if (result.error) return 'error';
    if (result.data) return 'success';
    return 'loading';
}

export const Dashboard = () => {
    const [selected, setSelected] = useState<ApiKey[]>([]);
    const [mode, setMode] = useState<PromiseMode>('parallel');
    const [modalIdx, setModalIdx] = useState<number | null>(null);

    const fetchers = useMemo(
        () =>
            apiOptions
                .filter((opt) => selected.includes(opt.key as ApiKey))
                .map((opt) => opt.fetcher),
        [selected]
    );

    const { results, run, cancel, progress, status } = usePromiseManager(
        fetchers,
        { mode, retry: 2, timeout: 7000 }
    );

    const handleSelect = useCallback((key: ApiKey) => {
        setSelected((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    }, []);

    const handleCardClick = useCallback((idx: number) => setModalIdx(idx), []);
    const handleModalClose = useCallback(() => setModalIdx(null), []);

    return (
        <div className='min-h-screen flex flex-col items-center justify-center py-12 px-2 bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-950 dark:to-gray-900'>
            <div className='w-full max-w-3xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-200 dark:border-gray-800 backdrop-blur-sm'>
                <div className='flex items-center justify-center gap-3 mb-8'>
                    <CloudIcon className='w-8 h-8 text-blue-400 shrink-0' />
                    <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight'>
                        Data Aggregator Dashboard
                    </h2>
                </div>
                <div className='mb-8'>
                    <div className='font-semibold mb-3 text-gray-700 dark:text-gray-200 text-lg text-center'>
                        Выберите источники данных:
                    </div>
                    <div className='flex flex-wrap gap-4 md:gap-6 justify-center'>
                        {apiOptions.map((opt) => (
                            <label
                                key={opt.key}
                                className={`flex items-center gap-2 cursor-pointer px-3 py-2 md:px-4 md:py-2 rounded-lg transition bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border border-transparent hover:border-blue-200 dark:hover:border-gray-600 shadow-sm ${
                                    selected.includes(opt.key as ApiKey)
                                        ? 'ring-2 ring-blue-300'
                                        : ''
                                }`}
                            >
                                <input
                                    type='checkbox'
                                    checked={selected.includes(
                                        opt.key as ApiKey
                                    )}
                                    onChange={() =>
                                        handleSelect(opt.key as ApiKey)
                                    }
                                    className='accent-blue-600 w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400'
                                />
                                {opt.icon}
                                <span className='font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base'>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className='mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-gray-700 dark:text-gray-200 font-medium text-sm'>
                                Режим:
                            </span>
                            <AnimatePresence
                                mode='wait'
                                initial={false}
                            >
                                {(() => {
                                    const selectedMode = MODES.find(
                                        (m) => m.value === mode
                                    )!;
                                    return (
                                        <motion.button
                                            key={selectedMode.value}
                                            layoutId='selected-mode'
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 30,
                                            }}
                                            className='px-3 py-1 rounded border text-xs md:text-sm font-medium transition bg-blue-600 text-white border-blue-700 cursor-default shadow-md scale-105'
                                            disabled
                                            title={selectedMode.description}
                                        >
                                            {selectedMode.label}
                                        </motion.button>
                                    );
                                })()}
                            </AnimatePresence>
                        </div>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            <AnimatePresence initial={false}>
                                {MODES.filter((m) => m.value !== mode).map(
                                    (m) => (
                                        <motion.button
                                            key={m.value}
                                            layoutId={m.value}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 30,
                                            }}
                                            onClick={() => setMode(m.value)}
                                            className='px-3 py-1 rounded border text-xs md:text-sm font-medium transition bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 shadow-sm'
                                            title={m.description}
                                        >
                                            {m.label}
                                        </motion.button>
                                    )
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={run}
                            disabled={
                                selected.length === 0 || status === 'loading'
                            }
                            className='px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 active:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 text-sm md:text-base border border-blue-700 dark:border-blue-600'
                        >
                            Загрузить всё
                        </button>
                        <button
                            onClick={cancel}
                            disabled={status !== 'loading'}
                            className='px-4 py-2 rounded bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 active:bg-yellow-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:active:bg-yellow-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 text-sm md:text-base border border-yellow-600 dark:border-yellow-500'
                        >
                            Отменить
                        </button>
                    </div>
                </div>
                {selected.length > 0 && (
                    <div className='mb-6 w-full'>
                        <div className='h-2 w-full bg-gray-200 dark:bg-gray-800 rounded'>
                            <div
                                className={`h-2 rounded transition-all duration-300 ${
                                    status === 'success'
                                        ? 'bg-green-500'
                                        : status === 'error'
                                        ? 'bg-red-500'
                                        : status === 'aborted'
                                        ? 'bg-yellow-500'
                                        : 'bg-blue-400'
                                }`}
                                style={{
                                    width: `${Math.round(progress * 100)}%`,
                                }}
                            />
                        </div>
                        <div className='flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400'>
                            <span>Статус: {status}</span>
                            <span>Прогресс: {Math.round(progress * 100)}%</span>
                        </div>
                    </div>
                )}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                    {selected.length === 0 && (
                        <div className='col-span-full text-center text-gray-400 py-16 text-xl'>
                            Выберите хотя бы один источник данных.
                        </div>
                    )}
                    {selected.map((key, idx) => {
                        const opt = apiOptions.find((o) => o.key === key)!;
                        const result = results[idx] || {
                            loading: false,
                            error: null,
                            data: null,
                            aborted: false,
                        };
                        return (
                            <ResultCard
                                key={key}
                                icon={opt.icon}
                                label={opt.label}
                                status={getStatus(result)}
                                onClick={() => handleCardClick(idx)}
                            />
                        );
                    })}
                </div>
                {/* Модальное окно с подробностями */}
                {modalIdx !== null && results[modalIdx] && (
                    <Modal
                        open={true}
                        onClose={handleModalClose}
                        title={(() => {
                            const idx = modalIdx;
                            const key = selected[idx];
                            const opt = apiOptions.find((o) => o.key === key);
                            return opt?.label || '';
                        })()}
                        copyContent={
                            results[modalIdx].data
                                ? JSON.stringify(
                                      results[modalIdx].data,
                                      null,
                                      2
                                  )
                                : undefined
                        }
                    >
                        {results[modalIdx].loading && (
                            <Skeleton height='2rem' />
                        )}
                        {results[modalIdx].error && (
                            <ErrorBlock error={results[modalIdx].error} />
                        )}
                        {results[modalIdx].data && (
                            <pre className='bg-gray-100 dark:bg-gray-800 rounded p-4 w-full text-xs text-gray-800 dark:text-gray-100 overflow-x-auto max-h-96 whitespace-pre-wrap'>
                                {JSON.stringify(
                                    results[modalIdx].data,
                                    null,
                                    2
                                )}
                            </pre>
                        )}
                        {results[modalIdx].aborted &&
                            !results[modalIdx].loading &&
                            !results[modalIdx].error && (
                                <div className='text-yellow-600 dark:text-yellow-400 font-semibold text-center py-4'>
                                    Запрос отменён
                                </div>
                            )}
                    </Modal>
                )}
            </div>
        </div>
    );
};
