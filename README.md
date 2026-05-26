# ЛР 6. Заявки колл-центра. Промисы, fetch и сборка через Vite

**Цель** данной лабораторной работы — замена XMLHttpRequest и коллбеков на промисы и `fetch`, сборка фронтенда через бандлер Vite и развёртывание bundle на сервере с API (ЛР №4).

***Тема:*** Заявки от коллцентра мелкого бизнеса.

## Архитектура приложения

По сравнению с ЛР №5 структура не изменилась — добавился конфигурационный файл Vite и собранный `dist`:

```
lab6-front/
├── components/
│   ├── ProductCardComponent.js   # Компонент карточки заявки
│   └── BackButtonComponent.js    # Компонент кнопки "Назад"
├── modules/
│   ├── ajax.js                   # fetch-обёртка (вместо XHR)
│   └── stockUrls.js              # URL-адреса эндпоинтов API
├── pages/
│   ├── mainPage.js               # Главная страница со списком заявок
│   ├── cardPage.js               # Страница просмотра заявки
│   └── editPage.js               # Страница создания/редактирования заявки
├── fonts/
│   └── SNPro-BlackItalic.woff2
├── dist/                         # Собранный bundle (генерируется Vite)
│   ├── index.html
│   └── assets/
│       └── ...
├── index.html
├── main.js
├── vite.config.js                # Конфигурация Vite
└── package.json
```

## Оглавление

1. [Архитектура приложения](#архитектура-приложения)
2. [Используемые технологии](#используемые-технологии)
3. [Ключевое отличие от ЛР №5: замена XHR на fetch](#ключевое-отличие-от-лр-5-замена-xhr-на-fetch)
4. [Ключевые компоненты](#ключевые-компоненты)
   - [fetch-обёртка — modules/ajax.js](#1-fetch-обёртка--modulesajaxjs)
   - [URL-адреса API — modules/stockUrls.js](#2-url-адреса-api--modulesstockurlsjs)
   - [Главная страница — pages/mainPage.js](#3-главная-страница--pagesmainpagejs)
   - [Страница редактирования — pages/editPage.js](#4-страница-редактирования--pageseditpagejs)
5. [Сборка через Vite](#сборка-через-vite)
6. [Деплой на сервер и устранение CORS](#деплой-на-сервер-и-устранение-cors)
7. [Демонстрация работы](#демонстрация-работы)
8. [Инструкция по запуску](#инструкция-по-запуску)

---

## Используемые технологии

- **Vanilla JS (ES6 Modules)** — модульная архитектура без фреймворков
- **fetch + async/await** — выполнение HTTP-запросов (вместо XHR)
- **Vite** — бандлер для сборки и минификации исходного кода
- **Bootstrap 5 (CDN)** — стилизация интерфейса
- **Express.js** (ЛР №4) — сервер, который раздаёт и bundle, и API

## Ключевое отличие от ЛР №5: замена XHR на fetch

### ЛР №5 — XMLHttpRequest с коллбеками

```javascript
// ajax.js (ЛР №5)
get(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const data = JSON.parse(xhr.responseText);
            callback(data, xhr.status);  // коллбек
        }
    };
}

// Использование — коллбек
ajax.get(stockUrls.getStocks(), (data) => {
    this.renderData(data);
});
```

### ЛР №6 — fetch с async/await

```javascript
// ajax.js (ЛР №6)
async get(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();  // возвращает промис
}

// Использование — async/await
async getData() {
    const data = await api.get(stockUrls.getStocks());
    this.renderData(data);
}
```

## Ключевые компоненты

### 1. fetch-обёртка — `modules/ajax.js`

Все методы возвращают промисы. Ошибки выбрасываются через `throw` и перехватываются через `try/catch`:

```javascript
export const api = {
    async get(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    async patch(url, data) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    async delete(url) {
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (response.status === 204) return null;  // No Content — тела нет
        return await response.json();
    }
};
```

### 2. URL-адреса API — `modules/stockUrls.js`

`baseUrl` пустой — запросы идут на тот же origin, что и страница. Это устраняет CORS без расширений:

```javascript
class StockUrls {
    constructor() {
        this.baseUrl = '';  // тот же домен — localhost:3000
    }

    getStocks()           { return `${this.baseUrl}/tickets`; }
    getStockById(id)      { return `${this.baseUrl}/tickets/${id}`; }
    createStock()         { return `${this.baseUrl}/tickets`; }
    updateStockById(id)   { return `${this.baseUrl}/tickets/${id}`; }
    removeStockById(id)   { return `${this.baseUrl}/tickets/${id}`; }
}
```

### 3. Главная страница — `pages/mainPage.js`

Методы стали `async`, получение данных через `await`:

```javascript
async render() {
    this.parent.innerHTML = `...`;
    await this.getData();
}

async getData() {
    try {
        const data = await api.get(stockUrls.getStocks());
        this.allData = data || [];
        this.filterCards();
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        container.innerHTML = '<p style="color:#e74c3c;">Ошибка загрузки данных</p>';
    }
}
```

### 4. Страница редактирования — `pages/editPage.js`

Реализовано создание (POST) и редактирование (PATCH) заявки:

```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = { /* поля формы */ };

    try {
        if (this.id) {
            // Редактирование — PATCH
            await api.patch(stockUrls.updateStockById(this.id), body);
            window.location.hash = `#card/${this.id}`;
        } else {
            // Создание — POST
            const created = await api.post(stockUrls.createStock(), body);
            window.location.hash = `#card/${created.id}`;
        }
    } catch (err) {
        this.showMessage('Ошибка при сохранении заявки', 'error');
    }
});
```

## Сборка через Vite

### Что такое Vite (бандлер)

Vite — инструмент сборки, который:
- Объединяет все JS-модули в один файл (`main-xxxx.js`)
- Минифицирует код (убирает пробелы, сокращает имена переменных)
- Хэширует имена файлов для кэширования браузером
- Обрабатывает статические assets (шрифты, картинки)

После сборки в `dist/` остаётся только bundle — исходный код недоступен.

### Конфигурация — `vite.config.js`

```javascript
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default {
    root: '.',
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: { main: resolve(__dirname, 'index.html') }
        }
    }
};
```

### Команда сборки

```bash
cd lab6-front
npm run build
```

После сборки копируем `dist` на сервер:

```bash
cp -r dist ../PSP_2026/dist
```

## Деплой на сервер и устранение CORS

В ЛР №5 фронтенд запускался через Live Server на отдельном порту — браузер блокировал запросы из-за CORS. В ЛР №6 bundle раздаётся тем же сервером на `localhost:3000`, поэтому домен запросов совпадает с доменом страницы и CORS не нужен.

В `src/index.js` сервера добавлена раздача статики:

```javascript
// Раздача собранного фронтенда
app.use(express.static(path.join(__dirname, '../dist')));

// API маршруты
app.use('/tickets', ticketsRouter);
```

## Демонстрация работы

### Главная страница — список заявок

![Главная страница](assets/main-page.png)

Запрос `GET /tickets` во вкладке Network:

![GET /tickets в Network](assets/get-tickets-network.png)

### Страница просмотра заявки

![Страница карточки](assets/card-page.png)

Запрос `GET /tickets/:id` во вкладке Network:

![GET /tickets/:id в Network](assets/get-ticket-by-id-network.png)

### Создание новой заявки

![Форма создания заявки](assets/create-form.png)

Запрос `POST /tickets` во вкладке Network:

![POST /tickets в Network](assets/post-ticket-network.png)

### Редактирование заявки

![Форма редактирования](assets/edit-form.png)

Запрос `PATCH /tickets/:id` во вкладке Network:

![PATCH /tickets/:id в Network](assets/patch-ticket-network.png)

### Вкладка Sources — только bundle, исходников нет

![Sources — только bundle](assets/sources-bundle.png)

## Инструкция по запуску

```bash
# 1. Собрать фронтенд
cd lab6-front
npm run build

# 2. Скопировать dist на сервер
cp -r dist ../PSP_2026/dist

# 3. Запустить сервер
cd ../PSP_2026
node src/index.js

# Приложение доступно по адресу:
# http://localhost:3000
```
