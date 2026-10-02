import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  name: text().notNull().primaryKey(),
  hash: text().notNull(),
  role: text({ enum: ["ADMIN", "USER"] }).notNull()
})
