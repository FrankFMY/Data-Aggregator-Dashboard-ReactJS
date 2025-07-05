export interface CurrencyRate {
    code: string;
    name: string;
    rate: number;
}

interface CurrencyListProps {
    rates: CurrencyRate[];
}

export function CurrencyList({ rates }: CurrencyListProps) {
    if (!rates.length) return null;
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {rates.map((r) => (
                <div
                    key={r.code}
                    className='bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-l-4 border-l-yellow-400 dark:border-l-yellow-500 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition flex flex-col gap-2'
                >
                    <div className='font-bold text-lg text-gray-900 dark:text-gray-100'>
                        {r.name} ({r.code})
                    </div>
                    <div className='text-2xl font-semibold text-blue-700 dark:text-yellow-300'>
                        {r.rate.toFixed(2)}
                    </div>
                    <div className='text-xs text-gray-400 dark:text-gray-300'>
                        за 1 {r.code} в RUB
                    </div>
                </div>
            ))}
        </div>
    );
}
