import { Skeleton } from '../../shared/Skeleton';
import { Error as ErrorComponent } from '../../shared/Error';
import { CurrencyList } from './CurrencyList';
import type { CurrencyRate } from './CurrencyList';
import { usePersistentResource } from '../../hooks/usePersistentResource';

const STORAGE_KEY = 'currency';
const CODES = [
  { code: 'USD', name: 'Доллар США' },
  { code: 'EUR', name: 'Евро' },
  { code: 'GBP', name: 'Фунт стерлингов' },
  { code: 'CNY', name: 'Китайский юань' },
  { code: 'JPY', name: 'Японская иена' },
];

async function fetchRates(): Promise<CurrencyRate[]> {
  const res = await fetch('https://open.er-api.com/v6/latest/RUB');
  if (!res.ok) throw new Error('Ошибка загрузки курсов');
  const data = await res.json();
  return CODES.map(({ code, name }) => ({
    code,
    name,
    rate: data.rates[code] ? 1 / data.rates[code] : NaN,
  })).filter((r) => !isNaN(r.rate));
}

const CurrencyPage = () => {
  const {
    data: rates,
    loading,
    error,
    load: loadRates,
    clear: handleClear,
  } = usePersistentResource<CurrencyRate[]>({
    storageKey: STORAGE_KEY,
    fetcher: fetchRates,
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-bold">Курсы валют</h1>
        <div className="flex gap-2">
          <button
            onClick={loadRates}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Загрузить курсы
          </button>
          <button
            onClick={handleClear}
            disabled={loading || !rates}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Очистить
          </button>
        </div>
      </div>
      {loading && <Skeleton height="2rem" />}
      {error && <ErrorComponent error={error} />}
      {rates && <CurrencyList rates={rates} />}
      {!rates && !loading && (
        <div className="text-gray-400 text-center mt-8">Нет данных. Нажмите «Загрузить курсы».</div>
      )}
    </div>
  );
};

export default CurrencyPage;
