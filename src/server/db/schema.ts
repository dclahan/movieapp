// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `movieapp_${name}`);

export const movie_tables = createTable(
  "movie_table",
  (d) => ({
    hkey: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    listTitle: d.varchar({ length: 256 }),
    listId: d.integer(),
    listDescription: d.text(),
    movieId: d.integer(),
    movieTitle: d.varchar({ length: 256 }),
    movieOverview: d.text(),
    moviePosterPath: d.varchar({ length: 512 }),
    movieReleaseDate: d.varchar({ length: 64 }),
    userNm: d.varchar({ length: 128 }),
    watched: d.boolean().default(false).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx1").on(t.hkey)],
);
