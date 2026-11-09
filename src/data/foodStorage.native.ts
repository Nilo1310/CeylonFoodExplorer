import * as SQLite from "expo-sqlite";
import { FOOD_SEED, type Food, type FoodCategory, type FoodImageKey } from "./foodData";

const DATABASE_NAME = "ceylon-food-explorer.db";
let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

type FoodRow = {
  id: string;
  name: string;
  category: FoodCategory;
  short_description: string;
  description: string;
  ingredients_json: string;
  preparation_json: string;
  image_key: FoodImageKey;
  accent: string;
  time_minutes: number;
  popularity: number;
};

function fromRow(row: FoodRow): Food {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    shortDescription: row.short_description,
    description: row.description,
    ingredients: JSON.parse(row.ingredients_json) as string[],
    preparation: JSON.parse(row.preparation_json) as string[],
    imageKey: row.image_key,
    accent: row.accent,
    timeMinutes: row.time_minutes,
    popularity: row.popularity,
  };
}

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS foods (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          short_description TEXT NOT NULL,
          description TEXT NOT NULL,
          ingredients_json TEXT NOT NULL,
          preparation_json TEXT NOT NULL,
          image_key TEXT NOT NULL,
          accent TEXT NOT NULL,
          time_minutes INTEGER NOT NULL,
          popularity INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS favorites (
          food_id TEXT PRIMARY KEY NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS foods_category_idx ON foods(category);
        CREATE INDEX IF NOT EXISTS foods_name_idx ON foods(name);
      `);
      const seedFoods = async () => {
        for (const food of FOOD_SEED) {
          await db.runAsync(
            `INSERT INTO foods
              (id, name, category, short_description, description, ingredients_json,
               preparation_json, image_key, accent, time_minutes, popularity)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               name = excluded.name,
               category = excluded.category,
               short_description = excluded.short_description,
               description = excluded.description,
               ingredients_json = excluded.ingredients_json,
               preparation_json = excluded.preparation_json,
               image_key = excluded.image_key,
               accent = excluded.accent,
               time_minutes = excluded.time_minutes,
               popularity = excluded.popularity`,
            food.id,
            food.name,
            food.category,
            food.shortDescription,
            food.description,
            JSON.stringify(food.ingredients),
            JSON.stringify(food.preparation),
            food.imageKey,
            food.accent,
            food.timeMinutes,
            food.popularity,
          );
        }
      };
      // Expo SQLite supports transactions; the small adapter used by the
      // offline storage test intentionally exposes only the query methods.
      if (typeof db.withTransactionAsync === "function") await db.withTransactionAsync(seedFoods);
      else await seedFoods();
      return db;
    });
  }
  return databasePromise;
}

export async function initializeFoodStorage(): Promise<{ foods: Food[]; favoriteIds: string[] }> {
  const db = await getDatabase();
  const [rows, favoriteRows] = await Promise.all([
    db.getAllAsync<FoodRow>("SELECT * FROM foods ORDER BY popularity DESC, name ASC"),
    db.getAllAsync<{ food_id: string }>("SELECT food_id FROM favorites ORDER BY created_at DESC"),
  ]);
  return { foods: rows.map(fromRow), favoriteIds: favoriteRows.map((row) => row.food_id) };
}

export async function queryLocalFoods(options: { category?: FoodCategory; search?: string }): Promise<Food[]> {
  const db = await getDatabase();
  const conditions: string[] = [];
  const params: string[] = [];
  if (options.category) {
    conditions.push("category = ?");
    params.push(options.category);
  }
  if (options.search?.trim()) {
    conditions.push("(LOWER(name) LIKE LOWER(?) OR LOWER(short_description) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(ingredients_json) LIKE LOWER(?))");
    const term = `%${options.search.trim()}%`;
    params.push(term, term, term, term, term);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await db.getAllAsync<FoodRow>(
    `SELECT * FROM foods ${where} ORDER BY popularity DESC, name ASC`,
    ...params,
  );
  return rows.map(fromRow);
}

export async function updateFavoriteStorage(foodId: string, isFavorite: boolean): Promise<string[]> {
  const db = await getDatabase();
  if (isFavorite) {
    await db.runAsync("INSERT OR IGNORE INTO favorites (food_id) VALUES (?)", foodId);
  } else {
    await db.runAsync("DELETE FROM favorites WHERE food_id = ?", foodId);
  }
  const rows = await db.getAllAsync<{ food_id: string }>("SELECT food_id FROM favorites ORDER BY created_at DESC");
  return rows.map((row) => row.food_id);
}
