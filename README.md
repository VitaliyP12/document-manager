# DocManager — Веб-система керування особистими документами

Веб-застосунок для зберігання, організації та пошуку особистих документів з функціями тегування, фільтрації та статистики.

## Можливості

- Реєстрація та вхід (JWT-автентифікація)
- Завантаження файлів різних форматів: документи, таблиці, презентації, зображення, відео, аудіо, архіви
- Drag-and-drop завантаження
- Перегляд та скачування файлів
- Створення, редагування, видалення документів
- Управління тегами та прив'язка їх до документів
- Серверний пошук за назвою, описом, ім'ям файлу
- Фільтрація за тегами та сортування
- Сторінка статистики з графіками
- Toast-повідомлення про дії

## Підтримувані формати

**Документи:** PDF, DOC, DOCX, TXT, HTML, JSON
**Таблиці:** XLS, XLSX, CSV
**Презентації:** PPT, PPTX
**Зображення:** JPG, PNG, GIF, WEBP, SVG
**Відео:** MP4, WEBM, MOV, AVI
**Аудіо:** MP3, WAV, OGG, M4A
**Архіви:** ZIP, RAR, 7Z

Максимальний розмір файлу — 50MB.

## Технологічний стек

**Бекенд:**
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT для автентифікації
- Multer для завантаження файлів
- bcryptjs для хешування паролів

**Фронтенд:**
- React 18 + Vite
- React Router
- Zustand (state management)
- Tailwind CSS
- Axios
- react-hot-toast

## Структура проекту
document-manager/
├── server/                  Бекенд
│   ├── src/
│   │   ├── config/         Конфіг БД
│   │   ├── controllers/    Логіка ендпоінтів
│   │   ├── middleware/     Auth, upload
│   │   ├── models/         Sequelize моделі
│   │   ├── routes/         Маршрути API
│   │   ├── app.js
│   │   └── server.js
│   └── uploads/            Завантажені файли
│
└── client/                  Фронтенд
└── src/
├── api/            Запити до бекенду
├── components/     UI-компоненти
├── pages/          Сторінки
├── store/          Zustand сторі
├── App.jsx
└── main.jsx

## Встановлення

### Передумови
- Node.js 18+
- PostgreSQL 14+
- pgAdmin 

### 1. Налаштування бази даних
У pgAdmin створіть базу даних з назвою `document_manager`.

### 2. Бекенд
```bash
cd server
npm install
```

Створіть файл `.env` у папці `server/`:
PORT=5000
JWT_SECRET=your_super_secret_key_123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=document_manager
DB_USER=postgres
DB_PASSWORD=postgres

Запустіть сервер:
```bash
npm start
```

### 3. Фронтенд
У новому терміналі:
```bash
cd client
npm install
npm run dev
```

Відкрийте `http://localhost:5173` у браузері.

## API ендпоінти

### Автентифікація
- `POST /api/auth/register` — реєстрація
- `POST /api/auth/login` — вхід
- `GET /api/auth/me` — поточний користувач

### Документи
- `GET /api/documents` — список документів
- `GET /api/documents/:id` — один документ
- `POST /api/documents` — створити (multipart/form-data)
- `PUT /api/documents/:id` — оновити
- `DELETE /api/documents/:id` — видалити
- `GET /api/documents/:id/download` — скачати файл

### Теги
- `GET /api/tags` — список тегів
- `POST /api/tags` — створити
- `PUT /api/tags/:id` — оновити
- `DELETE /api/tags/:id` — видалити
- `POST /api/tags/document/:documentId/tag/:tagId` — додати тег
- `DELETE /api/tags/document/:documentId/tag/:tagId` — прибрати тег

### Пошук та статистика
- `GET /api/search` — пошук (параметри: `q`, `tag`, `type`, `sort`, `order`)
- `GET /api/search/stats` — статистика користувача
