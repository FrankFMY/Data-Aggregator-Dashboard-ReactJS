import React, { useState } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    copyContent?: string; // JSON для копирования
}

export const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    copyContent,
}) => {
    const [copied, setCopied] = useState(false);
    if (!open) return null;

    const handleCopy = async () => {
        if (!copyContent) return;
        try {
            await navigator.clipboard.writeText(copyContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // intentionally ignored: ошибка копирования не критична
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm'>
            <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-lg w-full relative animate-fade-in'>
                <button
                    onClick={onClose}
                    className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none'
                    aria-label='Закрыть'
                >
                    ×
                </button>
                {title && (
                    <div className='mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100'>
                        {title}
                    </div>
                )}
                {copyContent && (
                    <div className='mb-2 flex justify-end'>
                        <button
                            onClick={handleCopy}
                            className='px-3 py-1 rounded bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 text-xs font-medium hover:bg-blue-200 dark:hover:bg-gray-700 transition border border-blue-200 dark:border-gray-700'
                        >
                            {copied ? 'Скопировано!' : 'Скопировать JSON'}
                        </button>
                    </div>
                )}
                <div className='max-h-[60vh] overflow-auto text-gray-800 dark:text-gray-100'>
                    {children}
                </div>
            </div>
        </div>
    );
};

// Анимация fade-in (Tailwind, если нет — добавить в global.css):
// .animate-fade-in { animation: fadeIn 0.2s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
