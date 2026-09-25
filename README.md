# CRWN Clothing

An online clothing store built with **Next.js (App Router)**, a **GraphQL** API, and **Prisma**.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16, React 19 |
| API | GraphQL Yoga at `/api/graphql` (GraphiQL in development) |
| Data | Prisma 7 + SQLite (`prisma/schema.prisma`) |
| Client data | Apollo Client 4 — Server Components query the schema in-process; client components call `/api/graphql` |
| Auth | Firebase Authentication (email/password and Google) |
| Payments | Stripe Payment Element, via the `createPaymentIntent` mutation |
| Styling | styled-components 6 |
| Cart state | React context, persisted to `localStorage` |

## Getting started

```bash
cp .env.example .env    # then fill in your Stripe test keys
npm install             # also generates the Prisma client
npm run db:migrate      # creates prisma/dev.db and applies migrations
npm run db:seed         # loads the catalogue from prisma/data
npm run dev             # http://localhost:3000
```

Open http://localhost:3000/api/graphql to try queries in GraphiQL, for example:

```graphql
{
  collection(routeName: "hats") {
    title
    items { id name price }
  }
}
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint (Next.js core web vitals rules) |
| `npm test` | Vitest unit tests |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Reset and seed the catalogue |
| `npm run db:studio` | Browse the database in Prisma Studio |

## Project layout

```
prisma/            schema, migrations, seed script and seed data
src/app/           routes (App Router) and the GraphQL route handler
src/graphql/       GraphQL schema, resolvers and client operations
src/components/    UI components
src/contexts/      cart and user React contexts
src/lib/           Prisma, Apollo, Firebase and styled-components setup
```

## Using PostgreSQL instead of SQLite

1. Set `provider = "postgresql"` in `prisma/schema.prisma`.
2. `npm install @prisma/adapter-pg` and swap `PrismaBetterSqlite3` for `PrismaPg` in `src/lib/prisma.js`.
3. Point `DATABASE_URL` at your database, delete `prisma/migrations`, and run `npm run db:migrate && npm run db:seed`.
