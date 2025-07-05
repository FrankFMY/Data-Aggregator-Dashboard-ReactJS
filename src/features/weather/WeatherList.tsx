export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon?: string;
  humidity?: number;
  wind?: number;
  weathercode?: number;
  winddirection?: number;
  is_day?: number;
  time?: string;
  timezone_abbreviation?: string;
  elevation?: number;
  latitude?: number;
  longitude?: number;
  utc_offset_seconds?: number;
  timezone?: string;
}

const weatherCodeMap: Record<number, { emoji: string; desc: string }> = {
  0: { emoji: '☀️', desc: 'Ясно' },
  1: { emoji: '🌤️', desc: 'Преимущественно ясно' },
  2: { emoji: '⛅', desc: 'Переменная облачность' },
  3: { emoji: '☁️', desc: 'Пасмурно' },
  45: { emoji: '🌫️', desc: 'Туман' },
  48: { emoji: '🌫️', desc: 'Туман, иней' },
  51: { emoji: '🌦️', desc: 'Морось слабая' },
  53: { emoji: '🌦️', desc: 'Морось' },
  55: { emoji: '🌦️', desc: 'Морось сильная' },
  61: { emoji: '🌧️', desc: 'Дождь слабый' },
  63: { emoji: '🌧️', desc: 'Дождь' },
  65: { emoji: '🌧️', desc: 'Дождь сильный' },
  71: { emoji: '🌨️', desc: 'Снег слабый' },
  73: { emoji: '🌨️', desc: 'Снег' },
  75: { emoji: '🌨️', desc: 'Снег сильный' },
  80: { emoji: '🌦️', desc: 'Ливень' },
  81: { emoji: '🌦️', desc: 'Ливень сильный' },
  82: { emoji: '🌦️', desc: 'Ливень очень сильный' },
  95: { emoji: '⛈️', desc: 'Гроза' },
  96: { emoji: '⛈️', desc: 'Гроза с градом' },
  99: { emoji: '⛈️', desc: 'Гроза с сильным градом' },
};

interface WeatherListProps {
  weather: WeatherData[];
}

export function WeatherList({ weather }: WeatherListProps) {
  if (!weather.length) return null;
  function windDirArrow(deg?: number) {
    if (deg === undefined) return '';
    // 8 направлений
    const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    return arrows[Math.round((deg % 360) / 45) % 8];
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {weather.map((w, i) => {
        let code = w.weathercode;
        if (code === undefined && w.description) {
          const match = w.description.match(/код (\d+)/);
          if (match) code = Number(match[1]);
        }
        const info = code !== undefined ? weatherCodeMap[code] : undefined;
        return (
          <div
            key={w.city || `weather-${i}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-l-4 border-l-cyan-400 dark:border-l-cyan-600 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition flex flex-col gap-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">{info?.emoji ?? '❓'}</div>
              <div className="font-bold text-lg truncate text-gray-900 dark:text-gray-100">
                {w.city}
              </div>
              {typeof w.is_day === 'number' && (
                <span title={w.is_day ? 'День' : 'Ночь'} className="ml-2 text-xl">
                  {w.is_day ? '🌞' : '🌙'}
                </span>
              )}
            </div>
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-1">
              {info?.desc ?? w.description}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-blue-700 dark:text-cyan-300">
                {w.temperature}°C
              </div>
              {w.time && (
                <span className="text-xs text-gray-400 dark:text-gray-300">
                  (
                  {new Date(w.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  )
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-400 dark:text-gray-300 mt-2 items-center">
              {w.wind !== undefined && <span title="Скорость ветра">💨 {w.wind} м/с</span>}
              {w.winddirection !== undefined && (
                <span title="Направление ветра">
                  {windDirArrow(w.winddirection)} {w.winddirection}°
                </span>
              )}
              {w.humidity !== undefined && <span>💧 {w.humidity}%</span>}
              {w.elevation !== undefined && <span title="Высота">⛰️ {w.elevation} м</span>}
              {w.latitude !== undefined && w.longitude !== undefined && (
                <span title="Координаты">
                  📍 {w.latitude.toFixed(2)}, {w.longitude.toFixed(2)}
                </span>
              )}
              {(w.timezone_abbreviation || w.utc_offset_seconds) && (
                <span title="Часовой пояс">
                  🕒
                  {w.timezone_abbreviation}
                  {typeof w.utc_offset_seconds === 'number' && (
                    <>
                      {w.utc_offset_seconds === 0 ? '' : w.utc_offset_seconds > 0 ? '+' : '-'}
                      {Math.abs(w.utc_offset_seconds / 3600)}
                    </>
                  )}
                  {w.time && typeof w.utc_offset_seconds === 'number' && (
                    <>
                      {' '}
                      {(() => {
                        const utc = new Date(w.time + 'Z');
                        const local = new Date(utc.getTime() + w.utc_offset_seconds * 1000);
                        return local.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                      })()}
                    </>
                  )}
                </span>
              )}
              {w.weathercode !== undefined && <span title="Код погоды">#{w.weathercode}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
