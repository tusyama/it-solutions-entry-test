# Цифровая визитка специалиста

GraphQL API, только на чтение.

При локальной работе посмотреть её можно в Apollo Sandbox:
[http://localhost:3000/graphql](http://localhost:3000/graphql)

Активный продакшн находится здесь: https://it-solutions-entry-test.onrender.com/graphql

## Запуск

С пустого тома:

```bash
docker compose down -v
docker compose up --build
```

Образ сам накатывает миграции и заполняет базу. `GET /health` проверяет соединение запросом `SELECT 1`.

Для разработки Postgres остаётся в Compose, приложение запускается на хосте. Скопируйте `.env.example` в `.env`.

```bash
docker compose up -d postgres
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

## Запрос

```graphql
query ProfileCard {
  profile {
    name
    description
    links {
      url
    }
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}
```

## Решения

Резолвер только собирает ответ. Запросы к базе живут в `ProfileService`, подключение — в `PrismaService`. Отдельный Repository или модуль на каждую сущность ничего не разделяет: API одно, реализация одна.

Корень запроса читает строку профиля. Данные с типом "массив" подгружаются своими field resolver-ами, только если поле есть в запросе. Полный запрос выше — это пять SQL запросов: профиль и по одному `findMany` на каждый массив. Достижения приходят внутри опыта. Общий `include` прочитал бы и те ветки, которые клиент не просил, поэтому тут без него.

Таблицы описывает миграция. Текст визитки лежит в `prisma/card.data.ts` и записывается seed-ом в одной транзакции. Повторный запуск приводит данные в базе в соответствие контенту заранее подготовленного файла, а не добавляет строки. Поэтому правка биографии не требует новой миграции.

Sandbox оставлен включённым и при `NODE_ENV=production`: для этой визитки он и есть интерфейс. Apollo в production сам выключает интроспекцию, поэтому плагин посадочной страницы задан явно.
