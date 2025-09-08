import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const pricing = sqliteTable("pricing", {
  id: integer("id").primaryKey(),
  prices: text("prices").notNull(),
  nonMemberPrice: text("non_member_price").notNull(),
  vipMemberPrice: text("vip_member_price").notNull(),
});

export const polls = sqliteTable("polls", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
});

export const pollOptions = sqliteTable("poll_options", {
  id: integer("id").primaryKey(),
  pollId: integer("poll_id")
    .notNull()
    .references(() => polls.id),
  text: text("text").notNull(),
  image: text("image"),
});

export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey(),
  pollId: integer("poll_id")
    .notNull()
    .references(() => polls.id),
  optionId: integer("option_id")
    .notNull()
    .references(() => pollOptions.id),
  userId: text("user_id").notNull(),
  timestamp: integer("timestamp").notNull(),
});

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  image: text("image"),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
});

const sqlite = new Database("claw.db");
export const db = drizzle(sqlite, {
  schema: { pricing, polls, pollOptions, votes, inventory },
});

const runMigrations = async () => {
  sqlite.exec("PRAGMA foreign_keys = ON;");
  migrate(db, { migrationsFolder: "./drizzle" });
};

export { runMigrations };
