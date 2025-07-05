import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import UsersPage from './features/users/UsersPage';
import PostsPage from './features/posts/PostsPage';
import WeatherPage from './features/weather/WeatherPage';
import CurrencyPage from './features/currency/CurrencyPage';

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="ml-4 px-3 py-2 rounded transition font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
      aria-label="Переключить тему"
    >
      {dark ? '🌙 Тёмная' : '☀️ Светлая'}
    </button>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="w-full flex flex-wrap justify-center items-center gap-4 py-4 bg-white dark:bg-gray-900 shadow-sm mb-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-800'
            }`
          }
        >
          Главная
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-800'
            }`
          }
        >
          Пользователи
        </NavLink>
        <NavLink
          to="/posts"
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-800'
            }`
          }
        >
          Посты
        </NavLink>
        <NavLink
          to="/weather"
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-800'
            }`
          }
        >
          Погода
        </NavLink>
        <NavLink
          to="/currency"
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-800'
            }`
          }
        >
          Курсы валют
        </NavLink>
        <ThemeToggle />
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/currency" element={<CurrencyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
