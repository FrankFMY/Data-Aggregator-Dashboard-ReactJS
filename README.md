# 🚀 Data Aggregator Dashboard

![dashboard-preview](public/vite.svg)

**Data Aggregator Dashboard** — это современный, многостраничный, модульный React-проект для агрегации и визуализации данных из различных публичных API. Проект реализован с максимальным вниманием к архитектуре, UX/UI, качеству кода, тестам и автоматизации.

---

## 🌟 Ключевые возможности

- **Агрегация данных** из разных источников: пользователи, посты, погода, курсы валют
- **Многостраничный интерфейс** с современным роутингом
- **Режимы загрузки**: параллельно, последовательно, race, allSettled — с анимированным выбором и подсказками
- **Адаптивный дизайн** и поддержка тёмной темы
- **Информативные карточки** с цветовой индикацией статуса, модальными окнами и копированием JSON
- **Централизованный прогресс-бар** и статус загрузки
- **Полное покрытие тестами** (Jest, Testing Library)
- **CI/CD-ready**: чистый код, строгий линтинг, актуальная документация
- **MIT License** — свободное использование и развитие

---

## ✨ Demo

> _Скриншот или GIF с демонстрацией интерфейса_

---

## 📦 Быстрый старт

```bash
# Клонируйте репозиторий
 git clone https://github.com/FrankFMY/Data-Aggregator-Dashboard-ReactJS.git
 cd Data-Aggregator-Dashboard-ReactJS

# Установите зависимости
 npm install

# Запустите проект
 npm run dev

# Запустите тесты и линтер
 npm run lint
 npm test
```

---

## 🛠️ Архитектура и структура

- **src/pages/** — страницы (Dashboard, Users, Posts, Weather, Currency)
- **src/features/** — бизнес-логика по фичам
- **src/shared/** — переиспользуемые компоненты (Modal, Loader, ErrorBlock, Notification, Skeleton, ResultCard)
- **src/hooks/** — кастомные хуки (useAsync, useFetch, useCancelableFetch, useRetry, usePromiseManager)
- **src/api/** — работа с внешними API
- **src/types/** — типы и интерфейсы
- **src/utils/** — утилиты

> **KISS, DRY, SOLID, YAGNI** — архитектурные принципы строго соблюдаются

---

## ⚡ Уникальный UX

- **Анимированный выбор режима** — выбранный режим всегда наверху, смена сопровождается плавной анимацией
- **Всплывающие подсказки** — при наведении на режим появляется краткое описание
- **Модальные окна** — подробности по каждому источнику, копирование JSON, цветовая индикация ошибок
- **Тёмная/светлая тема** — мгновенное переключение, идеальная контрастность
- **Адаптивность** — удобно на любом устройстве

---

## 🔄 Режимы загрузки данных

| Режим                | Описание                                                                 |
|----------------------|--------------------------------------------------------------------------|
| Параллельно          | Все запросы одновременно. Ошибка любого — ошибка всей группы              |
| Последовательно      | Запросы по очереди, следующий стартует после завершения предыдущего       |
| Race                 | Результат — первый успешно завершившийся запрос, остальные отменяются     |
| AllSettled           | Все запросы параллельно, возвращаются статусы всех, независимо от ошибок  |

---

## 🧪 Тесты и качество

- Покрытие тестами всех хуков, компонентов, страниц
- Строгий ESLint, no warnings, no unused code
- Проверка на CI/CD: тесты, линтер, сборка
- Документация всегда актуальна

---

## 🧑‍💻 Вклад и стиль

- Pull requests приветствуются!
- Соблюдайте архитектурные принципы и стиль кода (camelCase, PascalCase, KISS, DRY)
- Не забывайте про тесты и документацию

---

## 📄 Лицензия

MIT License. Свободно для любых целей. См. LICENSE.

---

## 🌍 English version

# 🚀 Data Aggregator Dashboard

**Data Aggregator Dashboard** is a modern, modular, multi-page React project for aggregating and visualizing data from various public APIs. Built with maximum attention to architecture, UX/UI, code quality, testing, and automation.

### Features
- Data aggregation from multiple sources: users, posts, weather, currency rates
- Multi-page interface with modern routing
- Loading modes: parallel, sequential, race, allSettled — with animated selection and tooltips
- Responsive design and dark mode support
- Informative cards with color status, modals, and JSON copy
- Centralized progress bar and loading status
- Full test coverage (Jest, Testing Library)
- CI/CD-ready: clean code, strict linting, up-to-date docs
- MIT License — free to use and develop

### Quick start
```bash
 git clone https://github.com/FrankFMY/Data-Aggregator-Dashboard-ReactJS.git
 cd Data-Aggregator-Dashboard-ReactJS
 npm install
 npm run dev
```

### Architecture
- `src/pages/` — pages (Dashboard, Users, Posts, Weather, Currency)
- `src/features/` — business logic by feature
- `src/shared/` — reusable components (Modal, Loader, ErrorBlock, Notification, Skeleton, ResultCard)
- `src/hooks/` — custom hooks (useAsync, useFetch, useCancelableFetch, useRetry, usePromiseManager)
- `src/api/` — API logic
- `src/types/` — types and interfaces
- `src/utils/` — utilities

### Data loading modes
| Mode         | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| Parallel     | All requests at once. Any error fails the group                              |
| Sequential   | Requests one by one, next starts after previous finishes                     |
| Race         | Result is the first successful request, others are cancelled                 |
| AllSettled   | All requests in parallel, returns all statuses regardless of errors          |

### License
MIT License. See LICENSE.

---

> Made with ❤️ by FrankFMY and contributors
