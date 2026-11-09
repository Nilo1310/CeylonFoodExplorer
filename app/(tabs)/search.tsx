import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FoodCard } from "@/components/food-card";
import { EmptyState, ScreenFrame, SearchBox } from "@/components/ceylon-ui";
import { FOOD_CATEGORIES, type Food, type FoodCategory } from "@/src/data/foodData";
import { useFoodLibrary } from "@/src/state/food-context";
import { font, palette } from "@/src/theme";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(() => typeof params.q === "string" ? params.q : "");
  const [category, setCategory] = useState<FoodCategory | undefined>();
  const [results, setResults] = useState<Food[]>([]);
  const { searchFoods, foodsInCategory, favoriteSet, toggleFavorite } = useFoodLibrary();

  useEffect(() => {
    let active = true;
    const loadResults = category
      ? foodsInCategory(category).then((found) => query.trim() ? found.filter((food) => [food.name, food.shortDescription, food.description, food.category, ...food.ingredients].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) : found)
      : searchFoods(query);
    loadResults.then((found) => { if (active) setResults(found); }).catch(() => { if (active) setResults([]); });
    return () => { active = false; };
  }, [category, query, searchFoods, foodsInCategory]);

  return (
    <ScreenFrame>
      <View style={styles.heading}>
        <Text style={styles.kicker}>FIND A FAVOURITE</Text>
        <Text style={styles.title}>Search the table</Text>
        <Text style={styles.subtitle}>Look up a dish by name — even a few letters will do.</Text>
      </View>
      <SearchBox value={query} onChangeText={setQuery} autoFocus={false} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <Pressable onPress={() => setCategory(undefined)} style={[styles.filterChip, !category && styles.filterChipActive]}>
          <Ionicons name="sparkles-outline" size={14} color={!category ? palette.white : palette.ocean} />
          <Text style={[styles.filterText, !category && styles.filterTextActive]}>All dishes</Text>
        </Pressable>
        {FOOD_CATEGORIES.map((item) => (
          <Pressable key={item} onPress={() => setCategory(item)} style={[styles.filterChip, category === item && styles.filterChipActive]}>
            <Text style={[styles.filterText, category === item && styles.filterTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {query.trim() ? (
        <Text style={styles.resultLabel}>{results.length} {results.length === 1 ? "dish" : "dishes"} for “{query.trim()}”{category ? ` in ${category}` : ""}</Text>
      ) : (
        <View style={styles.tip}><Text style={styles.tipTitle}>{category ? `${category} dishes, ready to browse` : "Try a name like “Kiri”"}</Text><Text style={styles.tipBody}>Search and filters read the on-device food library, so your guide works offline.</Text></View>
      )}
      {results.length ? (
        <View style={styles.results}>
          {results.map((food) => <FoodCard key={food.id} food={food} isFavorite={favoriteSet.has(food.id)} onToggleFavorite={() => void toggleFavorite(food.id)} />)}
        </View>
      ) : query.trim() ? (
        <EmptyState title="No dishes found" body="Try another name, or browse the meal categories for inspiration." icon="search-outline" />
      ) : (
        <View style={styles.results}>
          {results.slice(0, 4).map((food) => <FoodCard key={food.id} food={food} isFavorite={favoriteSet.has(food.id)} onToggleFavorite={() => void toggleFavorite(food.id)} />)}
        </View>
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 5, paddingTop: 6 },
  kicker: { color: palette.coconut, fontFamily: font.extraBold, fontSize: 10, letterSpacing: 1.8 },
  title: { color: palette.ink, fontFamily: font.extraBold, fontSize: 29, letterSpacing: -0.6 },
  subtitle: { color: palette.muted, fontFamily: font.regular, fontSize: 14, lineHeight: 21 },
  resultLabel: { color: palette.muted, fontFamily: font.medium, fontSize: 13, marginTop: -5 },
  filters: { gap: 8, paddingRight: 20 },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  filterChipActive: { backgroundColor: palette.ocean, borderColor: palette.ocean },
  filterText: { color: palette.oceanDeep, fontFamily: font.bold, fontSize: 12 },
  filterTextActive: { color: palette.white },
  tip: { padding: 16, borderRadius: 18, backgroundColor: palette.coconutPale, gap: 3 },
  tipTitle: { color: palette.oceanDeep, fontFamily: font.bold, fontSize: 14 },
  tipBody: { color: palette.muted, fontFamily: font.regular, fontSize: 12, lineHeight: 18 },
  results: { flexDirection: "row", flexWrap: "wrap", gap: 13, justifyContent: "flex-start" },
});
