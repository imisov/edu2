# ToDo List

Современное приложение для управления задачами с поддержкой фильтрации, поиска, сортировки, массовых действий и синхронизации с сервером.

---

## Структура проекта

```text
frontend/
  app-todo-list/
    index.html
    package.json
    webpack.config.js
    README.md
    src/
      css/
        normalize.css
        styles.css
      img/
        favicon.png
      js/
        api.js
        index.js
        state.js
        ui.js
```

---

## Быстрый старт

1. Установите зависимости:

   ```sh
   npm install
   ```

2. Запустите проект в режиме разработки:

   ```sh
   npm start
   ```

   Приложение будет доступно по адресу <http://localhost:8080>

3. Для сборки production-версии:

   ```sh
   npm run build
   ```

   Сборка появится в папке `dist/`.

---

## Описание функционала

- Добавление, удаление, отметка задач как выполненных
- Фильтрация и сортировка задач
- Поиск по задачам
- Массовые действия (отметить/удалить выбранные)
- Сохранение задач на сервере (JSONPlaceholder API)
- Спиннер загрузки и обработка ошибок
- Современный дизайн, адаптивная верстка, БЭМ-структура CSS

---

## Основные команды npm

- `npm start` — запуск dev-сервера (webpack-dev-server)
- `npm run build` — production-сборка (webpack, минификация CSS/JS)

---

## Используемые технологии

- Webpack 5, Babel
- Toastify для уведомлений
- CSS по методологии БЭМ
- Адаптивная верстка, доступность (aria-атрибуты)

---

## API

Используется JSONPlaceholder (<https://jsonplaceholder.typicode.com/todos>) для хранения задач.

---

## Контакты

Автор: vsimisov
GitHub: <https://github.com/imisov/edu2>
