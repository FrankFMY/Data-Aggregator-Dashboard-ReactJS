import React from 'react';

export type ResultStatus = 'success' | 'error' | 'loading' | 'aborted';

interface ResultCardProps {
    icon: React.ReactNode;
    label: string;
    status: ResultStatus;
    onClick: () => void;
}

const statusMap: Record<ResultStatus, { text: string; color: string }> = {
    success: { text: 'Готово', color: 'bg-green-500 text-white' },
    error: { text: 'Ошибка', color: 'bg-red-500 text-white' },
    loading: {
        text: 'Загрузка',
        color: 'bg-blue-500 text-white animate-pulse',
    },
    aborted: { text: 'Отменено', color: 'bg-yellow-500 text-gray-900' },
};

const ResultCardComponent: React.FC<ResultCardProps> = ({
    icon,
    label,
    status,
    onClick,
}) => {
    const { text, color } = statusMap[status];
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-xl shadow-md p-6 flex flex-col items-center gap-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 group`}
            tabIndex={0}
            aria-label={`Подробнее о "${label}"`}
        >
            <div className='flex items-center gap-2 mb-2'>
                <span className='text-2xl'>{icon}</span>
                <span className='font-semibold text-lg text-gray-900 dark:text-gray-100'>
                    {label}
                </span>
            </div>
            <div
                className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}
            >
                {text}
            </div>
            <div className='mt-2 text-xs text-blue-600 dark:text-blue-300 opacity-80 group-hover:underline'>
                Подробнее
            </div>
        </button>
    );
};

export const ResultCard = React.memo(ResultCardComponent);
