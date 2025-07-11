import { Skeleton } from '../../shared/Skeleton';
import { Error as ErrorComponent } from '../../shared/Error';
import { WeatherList } from './WeatherList';
import type { WeatherData } from './WeatherList';
import { usePersistentResource } from '../../hooks/usePersistentResource';

const STORAGE_KEY = 'weather';

// Массив городов с координатами
const CITIES = [
  { name: 'Москва', lat: 55.75, lon: 37.62 },
  { name: 'Санкт-Петербург', lat: 59.94, lon: 30.31 },
  { name: 'Новосибирск', lat: 55.03, lon: 82.92 },
  { name: 'Екатеринбург', lat: 56.85, lon: 60.6 },
  { name: 'Казань', lat: 55.79, lon: 49.12 },
  { name: 'Нижний Новгород', lat: 56.32, lon: 44.0 },
  { name: 'Челябинск', lat: 55.16, lon: 61.4 },
  { name: 'Самара', lat: 53.2, lon: 50.15 },
  { name: 'Омск', lat: 54.99, lon: 73.37 },
  { name: 'Ростов-на-Дону', lat: 47.23, lon: 39.72 },
];

async function fetchWeatherAll(): Promise<WeatherData[]> {
  const results = await Promise.all(
    CITIES.map(async (city) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.current_weather) return null;
      const w: WeatherData = {
        city: city.name,
        temperature: data.current_weather.temperature,
        description: `Погода: код ${data.current_weather.weathercode}`,
        icon: undefined,
        humidity: undefined,
        wind: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        winddirection: data.current_weather.winddirection,
        is_day: data.current_weather.is_day,
        time: data.current_weather.time,
        timezone_abbreviation: data.timezone_abbreviation,
        elevation: data.elevation,
        latitude: data.latitude,
        longitude: data.longitude,
        utc_offset_seconds: data.utc_offset_seconds,
        timezone: data.timezone,
      };
      return w;
    }),
  );
  return results.filter(Boolean) as WeatherData[];
}

const WeatherPage = () => {
  const {
    data: weather,
    loading,
    error,
    load: loadWeather,
    clear: handleClear,
  } = usePersistentResource<WeatherData[]>({
    storageKey: STORAGE_KEY,
    fetcher: fetchWeatherAll,
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-bold">Погода</h1>
        <div className="flex gap-2">
          <button
            onClick={loadWeather}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Загрузить погоду
          </button>
          <button
            onClick={handleClear}
            disabled={loading || !weather}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Очистить
          </button>
        </div>
      </div>
      {loading && <Skeleton height="2rem" />}
      {error && <ErrorComponent error={error} />}
      {weather && <WeatherList weather={weather} />}
      {!weather && !loading && (
        <div className="text-gray-400 text-center mt-8">
          Нет данных. Нажмите «Загрузить погоду».
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
