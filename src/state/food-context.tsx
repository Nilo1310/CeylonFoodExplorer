import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { initializeFoodStorage, queryLocalFoods, updateFavoriteStorage } from "@/src/data/foodStorage";
import type { Food, FoodCategory } from "@/src/data/foodData";

type FoodContextValue = {
  foods: Food[];
  favoriteIds: string[];
  favoriteSet: Set<string>;
  loading: boolean;
  error: string | null;
  searchFoods: (query: string) => Promise<Food[]>;
  foodsInCategory: (category: FoodCategory) => Promise<Food[]>;
  toggleFavorite: (foodId: string) => Promise<void>;
};

const FoodContext = createContext<FoodContextValue | null>(null);

export function FoodProvider({ children }: PropsWithChildren) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    initializeFoodStorage()
      .then((result) => {
        if (!active) return;
        setFoods(result.foods);
        setFavoriteIds(result.favoriteIds);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setFoods([]);
        setError(reason instanceof Error ? reason.message : "The local food library could not be opened.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const searchFoods = useCallback((query: string) => queryLocalFoods({ search: query }), []);
  const foodsInCategory = useCallback((category: FoodCategory) => queryLocalFoods({ category }), []);
  const toggleFavorite = useCallback(async (foodId: string) => {
    const willBeFavorite = !favoriteIds.includes(foodId);
    const next = await updateFavoriteStorage(foodId, willBeFavorite);
    setFavoriteIds(next);
  }, [favoriteIds]);
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const value = useMemo<FoodContextValue>(
    () => ({ foods, favoriteIds, favoriteSet, loading, error, searchFoods, foodsInCategory, toggleFavorite }),
    [foods, favoriteIds, favoriteSet, loading, error, searchFoods, foodsInCategory, toggleFavorite],
  );

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export function useFoodLibrary(): FoodContextValue {
  const context = useContext(FoodContext);
  if (!context) throw new Error("useFoodLibrary must be used inside FoodProvider");
  return context;
}
