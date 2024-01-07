import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id"),
  name: text("name"),
});

export const deals = sqliteTable("deal", {
  id: text("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  isActive: integer("isActive", { mode: "boolean" }),
});
