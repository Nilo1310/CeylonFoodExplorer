import AsyncStorage from "@react-native-async-storage/async-storage";
import { categorySeedFoods, filterFoods, searchSeedFoods } from "./foodQueries";
import { FOOD_SEED, type Food, type FoodCategory } from "./foodData";

const WEB_FAVORITES_KEY = "ceylon-food-explorer:favorites:v1";

async function readFavorites(): Promise<string[]> {
  try {
    const saved = await AsyncStorage.getItem(WEB_FAVORITES_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export async function initializeFoodStorage(): Promise<{ foods: Food[]; favoriteIds: string[] }> {
  return { foods: FOOD_SEED, favoriteIds: await readFavorites() };
}

export async function queryLocalFoods(options: { category?: FoodCategory; search?: string }): Promise<Food[]> {
  if (options.category && options.search) return filterFoods(FOOD_SEED, options);
  if (options.category) return categorySeedFoods(options.category);
  if (options.search) return searchSeedFoods(options.search);
  return FOOD_SEED;
}

export async function updateFavoriteStorage(foodId: string, isFavorite: boolean): Promise<string[]> {
  const current = await readFavorites();
  const next = isFavorite
    ? Array.from(new Set([...current, foodId]))
    : current.filter((id) => id !== foodId);
  await AsyncStorage.setItem(WEB_FAVORITES_KEY, JSON.stringify(next));
  return next;
}
