import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id"),
  name: text("name"),
});

export const deals = sqliteTable("deal", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  isActive: integer("isActive", { mode: "boolean" }),
});

export const glamps = sqliteTable("glamp", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  type: text("type"),
  price: real("price"),
  availableFrom: text("available_from"),
  availableTo: text("available_to"),
  adultCapacity: integer("adult_capacity"),
  childCapacity: integer("child_capacity"),
  isLuxury: integer("isLuxury", { mode: "boolean" }),
});
