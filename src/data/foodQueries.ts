import { FOOD_SEED, type Food, type FoodCategory } from "./foodData";

export function filterFoods(
  foods: readonly Food[],
  options: { category?: FoodCategory; search?: string } = {},
): Food[] {
  const normalizedQuery = options.search?.trim().toLocaleLowerCase() ?? "";
  return foods.filter((food) => {
    if (options.category && food.category !== options.category) return false;
    if (!normalizedQuery) return true;
    return [food.name, food.shortDescription, food.description, food.category, ...food.ingredients]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  });
}

export function searchSeedFoods(query: string): Food[] {
  return filterFoods(FOOD_SEED, { search: query });
}

export function categorySeedFoods(category: FoodCategory): Food[] {
  return filterFoods(FOOD_SEED, { category });
}
