# Первоначальная установка:

1. Скопировать репозиторий к себе
   ```bash
   git clone https://github.com/kit52/simple-table.git
   ```
2. Перейти в директорию проекта бекенда и установить зависимости npm
   ```bash
   cd simple-table/server
   npm i
   ```
3. Собрать и запустить бекенда
   ```bash
   npx tsc
   node dist/server.js
   ```
4. Перейти в директорию проекта фронтенда и установить зависимости npm
   ```bash
   cd simple-table/front
   npm i
   ```
5. Запустить фронтенд
   ```bash
    npm run start
   ```

## Список используемых библиотек:

### фронтенд:

1. React
2. antd
3. dayjs
4. axios

### Бекенд:

1. express
2. cors
