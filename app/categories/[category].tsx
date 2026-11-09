import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FoodCard } from "@/components/food-card";
import { BackButton, EmptyState, ScreenFrame } from "@/components/ceylon-ui";
import { FOOD_CATEGORIES, type Food, type FoodCategory } from "@/src/data/foodData";
import { useFoodLibrary } from "@/src/state/food-context";
import { font, palette } from "@/src/theme";

function parseCategory(value: string | string[] | undefined): FoodCategory | undefined {
  const slug = (Array.isArray(value) ? value[0] : value)?.toLowerCase().replaceAll("-", " ");
  return FOOD_CATEGORIES.find((category) => category.toLowerCase() === slug);
}

export default function CategoryFoodsScreen() {
  const { category: rawCategory } = useLocalSearchParams<{ category?: string | string[] }>();
  const category = parseCategory(rawCategory);
  const { foodsInCategory, favoriteSet, toggleFavorite } = useFoodLibrary();
  const [foods, setFoods] = useState<Food[]>([]);
  useEffect(() => {
    let active = true;
    if (category) foodsInCategory(category).then((items) => { if (active) setFoods(items); }).catch(() => { if (active) setFoods([]); });
    return () => { active = false; };
  }, [category, foodsInCategory]);

  return (
    <ScreenFrame>
      <View style={styles.topRow}><BackButton /><Text style={styles.eyebrow}>CEYLON FOOD GUIDE</Text></View>
      <View style={styles.heading}>
        <Text style={styles.kicker}>A PLACE AT THE TABLE</Text>
        <Text style={styles.title}>{category ?? "Category"}</Text>
        <Text style={styles.subtitle}>{category ? `Recipes and food stories from the ${category.toLowerCase()} table.` : "This food category could not be found."}</Text>
      </View>
      {foods.length ? (
        <>
          <Text style={styles.count}>{foods.length} {foods.length === 1 ? "dish" : "dishes"}</Text>
          <View style={styles.results}>{foods.map((food) => <FoodCard key={food.id} food={food} isFavorite={favoriteSet.has(food.id)} onToggleFavorite={() => void toggleFavorite(food.id)} />)}</View>
        </>
      ) : (
        <EmptyState title={category ? "A quiet corner of the menu" : "Category not found"} body={category ? "There are no dishes in this section yet." : "Return to categories and choose a meal to explore."} icon="restaurant-outline" />
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  eyebrow: { color: palette.ocean, fontFamily: font.bold, fontSize: 10, letterSpacing: 1.5 },
  heading: { gap: 5, paddingTop: 4 },
  kicker: { color: palette.coconut, fontFamily: font.extraBold, fontSize: 10, letterSpacing: 1.8 },
  title: { color: palette.ink, fontFamily: font.extraBold, fontSize: 30, letterSpacing: -0.6 },
  subtitle: { color: palette.muted, fontFamily: font.regular, fontSize: 14, lineHeight: 21 },
  count: { color: palette.ocean, fontFamily: font.bold, fontSize: 13 },
  results: { flexDirection: "row", flexWrap: "wrap", gap: 13 },
});
