import { beforeEach, describe, expect, it, vi } from "vitest";
import { FOOD_SEED } from "../src/data/foodData";

const mocks = vi.hoisted(() => ({
  platform: { OS: "android" },
  favoriteIds: [] as string[],
  db: {
    execAsync: vi.fn(),
    getFirstAsync: vi.fn(),
    getAllAsync: vi.fn(),
    runAsync: vi.fn(),
  },
}));

vi.mock("react-native", () => ({ Platform: mocks.platform }));
vi.mock("expo-sqlite", () => ({ openDatabaseAsync: vi.fn(async () => mocks.db) }));
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: { getItem: vi.fn(), setItem: vi.fn() },
}));

describe("SQLite food storage", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.favoriteIds = [];
    mocks.db.execAsync.mockReset();
    mocks.db.getFirstAsync.mockReset().mockResolvedValue({ count: 0 });
    mocks.db.getAllAsync.mockReset().mockImplementation(async (sql: string) => {
      if (sql.includes("FROM foods")) {
        return FOOD_SEED.map((food) => ({
          id: food.id,
          name: food.name,
          category: food.category,
          short_description: food.shortDescription,
          description: food.description,
          ingredients_json: JSON.stringify(food.ingredients),
          preparation_json: JSON.stringify(food.preparation),
          image_key: food.imageKey,
          accent: food.accent,
          time_minutes: food.timeMinutes,
          popularity: food.popularity,
        }));
      }
      return mocks.favoriteIds.map((food_id) => ({ food_id }));
    });
    mocks.db.runAsync.mockReset().mockImplementation(async (sql: string, ...params: unknown[]) => {
      const foodId = params[0] as string;
      if (sql.includes("INSERT OR IGNORE INTO favorites") && !mocks.favoriteIds.includes(foodId)) mocks.favoriteIds.push(foodId);
      if (sql.includes("DELETE FROM favorites")) mocks.favoriteIds = mocks.favoriteIds.filter((id) => id !== foodId);
      return {};
    });
  });

  it("creates local tables, seeds the catalogue and persists favourite changes in SQLite", async () => {
    const storage = await import("../src/data/foodStorage.native");
    const initialized = await storage.initializeFoodStorage();

    expect(mocks.db.execAsync).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS foods"));
    expect(mocks.db.execAsync).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS favorites"));
    expect(mocks.db.runAsync).toHaveBeenCalledTimes(FOOD_SEED.length);
    expect(initialized.foods.map((food) => food.id)).toContain("kiribath");

    await expect(storage.updateFavoriteStorage("kiribath", true)).resolves.toEqual(["kiribath"]);
    expect(mocks.db.runAsync).toHaveBeenCalledWith("INSERT OR IGNORE INTO favorites (food_id) VALUES (?)", "kiribath");
    await expect(storage.updateFavoriteStorage("kiribath", false)).resolves.toEqual([]);
    expect(mocks.db.runAsync).toHaveBeenCalledWith("DELETE FROM favorites WHERE food_id = ?", "kiribath");
  });
});
