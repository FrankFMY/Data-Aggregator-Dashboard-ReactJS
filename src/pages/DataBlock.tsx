import { Error } from '../shared/Error';
import { Skeleton } from '../shared/Skeleton';
import { useAsync } from '../hooks/useAsync';

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  address?: { city?: string } | string;
  company?: { name?: string } | string;
}

interface Post {
  id: number;
  title: string;
  body?: string;
  userId?: number;
}

interface Weather {
  current_weather?: { temperature?: number };
  timezone_abbreviation?: string;
}

interface CurrencyRates {
  [code: string]: number;
}

interface DataBlockProps<T> {
  label: string;
  fetcher: () => Promise<T>;
}

// Вспомогательные компоненты для форматирования
function UsersList({ users }: { users: User[] }) {
  return (
    <ul className="space-y-1 text-xs">
      {users.map((u) => (
        <li key={u.id} className="border-b last:border-b-0 py-1 flex flex-col">
          <span className="font-semibold">
            {u.firstName || u.name} {u.lastName || ''}
          </span>
          <span className="text-gray-500">{u.email}</span>
          {u.address && (
            <span className="text-gray-400">
              {typeof u.address === 'string' ? u.address : u.address.city}
            </span>
          )}
          {u.company && (
            <span className="text-gray-400">
              {typeof u.company === 'string' ? u.company : u.company.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function PostsList({ posts }: { posts: Post[] }) {
  return (
    <ul className="space-y-1 text-xs">
      {posts.map((p) => (
        <li key={p.id} className="border-b last:border-b-0 py-1">
          <span className="font-semibold">{p.title}</span>
          <span className="text-gray-500 block truncate">{p.body?.slice(0, 60)}...</span>
          {p.userId && <span className="text-gray-400">userId: {p.userId}</span>}
        </li>
      ))}
    </ul>
  );
}

function CurrencyTable({ rates }: { rates: CurrencyRates }) {
  const main = ['USD', 'EUR', 'RUB', 'CNY', 'GBP', 'JPY'];
  return (
    <table className="w-full text-xs">
      <thead>
        <tr>
          <th className="text-left">Валюта</th>
          <th className="text-right">Курс</th>
        </tr>
      </thead>
      <tbody>
        {main.map((code) => (
          <tr key={code}>
            <td>{code}</td>
            <td className="text-right">{rates[code] ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function WeatherSummary({ weather }: { weather: Weather }) {
  const temp = weather?.current_weather?.temperature;
  const city = weather?.timezone_abbreviation || '—';
  return (
    <div className="text-xs">
      <div>
        Температура: <span className="font-semibold">{temp ?? '—'}°C</span>
      </div>
      <div>
        Локация: <span className="text-gray-500">{city}</span>
      </div>
    </div>
  );
}

export function DataBlock<T = unknown>({ label, fetcher }: DataBlockProps<T>) {
  const { loading, error, data, run, cancel } = useAsync<T, []>(fetcher);

  const handleFetch = () => run();

  // Форматирование данных по типу
  function renderData() {
    if (!data) return null;
    if (label === 'Пользователи' && Array.isArray(data)) {
      return <UsersList users={data as User[]} />;
    }
    if (label === 'Посты' && Array.isArray(data)) {
      return <PostsList posts={data as Post[]} />;
    }
    if (label === 'Курсы валют' && data && typeof data === 'object') {
      return <CurrencyTable rates={data as CurrencyRates} />;
    }
    if (label === 'Погода' && data && typeof data === 'object') {
      return <WeatherSummary weather={data as Weather} />;
    }
    // fallback
    return (
      <pre className="bg-gray-50 rounded p-2 w-full text-xs text-gray-700 overflow-x-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-semibold text-gray-800">{label}</span>
        {loading && <span className="ml-2 text-xs text-blue-500 animate-pulse">Загрузка...</span>}
      </div>
      <div className="min-h-[64px] flex items-center justify-center w-full">
        {loading && <Skeleton height="2rem" />}
        {error && <Error error={error} />}
        {renderData()}
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-2 w-full">
        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-4 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Загрузить
        </button>
        <button
          onClick={cancel}
          disabled={!loading}
          className="px-4 py-1 rounded bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Отменить
        </button>
      </div>
    </div>
  );
}
