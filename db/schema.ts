import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gifts = sqliteTable("gifts", {
  id: text("id").primaryKey(),
  house: text("house", { enum: ["YASMIN", "PEDRO"] }).notNull(),
  owner: text("owner", { enum: ["ME", "HER"] }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  productUrl: text("product_url").notNull(),
  price: integer("price"),
  priority: integer("priority").notNull(),
  timeframe: text("timeframe", { enum: ["SHORT", "MEDIUM", "LONG"] }).notNull(),
  status: text("status", { enum: ["WANTED", "RECEIVED"] })
    .notNull()
    .default("WANTED"),
  createdBy: text("created_by").notNull(),
  receivedAt: text("received_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
