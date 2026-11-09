import { describe, expect, it } from "vitest";
import { FOOD_CATEGORIES, FOOD_SEED } from "../src/data/foodData";
import { categorySeedFoods, searchSeedFoods } from "../src/data/foodQueries";
import { categoryRoute, foodDetailRoute } from "../src/navigation/routes";

describe("offline food catalogue", () => {
  it("seeds the named traditional dishes with categories and recipe content", () => {
    const names = FOOD_SEED.map((food) => food.name);
    expect(names).toEqual(expect.arrayContaining(["Kiribath", "Kottu Roti", "String Hoppers", "Pittu", "Kokis"]));
    expect(FOOD_CATEGORIES).toEqual(["Breakfast", "Lunch", "Dinner", "Snacks", "Sweets"]);
    expect(FOOD_SEED.every((food) => food.ingredients.length > 0 && food.preparation.length > 0)).toBe(true);
  });

  it("finds a dish from a partial, case-insensitive offline query", () => {
    expect(searchSeedFoods("kiri").map((food) => food.id)).toContain("kiribath");
    expect(searchSeedFoods("KOTTU").map((food) => food.id)).toContain("kottu-roti");
  });

  it("filters the locally bundled data by category", () => {
    expect(categorySeedFoods("Breakfast").map((food) => food.id)).toEqual(expect.arrayContaining(["kiribath", "string-hoppers", "pittu"]));
    expect(categorySeedFoods("Snacks").every((food) => food.category === "Snacks")).toBe(true);
  });
});

describe("screen navigation destinations", () => {
  it("builds stable stack routes for dish details and category lists", () => {
    expect(foodDetailRoute("kiribath")).toEqual({ pathname: "/foods/[foodId]", params: { foodId: "kiribath" } });
    expect(categoryRoute("Breakfast")).toEqual({ pathname: "/categories/[category]", params: { category: "breakfast" } });
  });
});
