import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FoodCard } from "@/components/food-card";
import { ScreenFrame, SearchBox, SectionHeading } from "@/components/ceylon-ui";
import { FOOD_CATEGORIES, type FoodCategory } from "@/src/data/foodData";
import { useFoodLibrary } from "@/src/state/food-context";
import { font, palette } from "@/src/theme";

const CATEGORY_ICONS: Record<FoodCategory, keyof typeof Ionicons.glyphMap> = {
  Breakfast: "sunny-outline", Lunch: "leaf-outline", Dinner: "moon-outline", Snacks: "cafe-outline", Sweets: "sparkles-outline",
};

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { foods, favoriteSet, toggleFavorite } = useFoodLibrary();
  const popular = useMemo(() => [...foods].sort((a, b) => b.popularity - a.popularity).slice(0, 5), [foods]);
  const openCategory = (category: FoodCategory) => router.push({ pathname: "/categories/[category]", params: { category: category.toLowerCase() } });

  return (
    <ScreenFrame>
      <View style={styles.topLine}>
        <View style={styles.brandMark}><Ionicons name="leaf" size={17} color={palette.white} /></View>
        <Text style={styles.brand}>CEYLON FOOD EXPLORER</Text>
        <View style={styles.offlineBadge}><View style={styles.offlineDot} /><Text style={styles.offlineText}>OFFLINE GUIDE</Text></View>
      </View>
      <View style={styles.heroText}>
        <Text style={styles.kicker}>A TASTE OF THE ISLAND</Text>
        <Text style={styles.title}>Flavours of <Text style={styles.titleAccent}>Sri Lanka</Text></Text>
        <Text style={styles.subtitle}>Find a favourite, learn its story, and bring a little Ceylon to your table.</Text>
      </View>
      <SearchBox value={query} onChangeText={setQuery} placeholder="Search dishes, ingredients…" onSubmitEditing={() => router.push({ pathname: "/(tabs)/search", params: query.trim() ? { q: query.trim() } : {} })} />
      <View style={styles.section}>
        <SectionHeading title="Explore by meal" actionLabel="All categories" onAction={() => router.push("/(tabs)/categories")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
          {FOOD_CATEGORIES.map((category) => (
            <Pressable key={category} onPress={() => openCategory(category)} style={({ pressed }) => [styles.categoryShortcut, pressed && styles.pressed]}>
              <View style={[styles.categoryIcon, { backgroundColor: category === "Sweets" ? "#F4E8C9" : palette.coconutPale }]}><Ionicons name={CATEGORY_ICONS[category]} size={20} color={palette.ocean} /></View>
              <Text style={styles.categoryLabel}>{category}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <SectionHeading title="Beloved island classics" actionLabel="Browse all" onAction={() => router.push("/(tabs)/categories")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodRail}>
          {popular.map((food) => <FoodCard key={food.id} food={food} isFavorite={favoriteSet.has(food.id)} onToggleFavorite={() => void toggleFavorite(food.id)} />)}
        </ScrollView>
      </View>
      <Pressable onPress={() => router.push("/(tabs)/favorites")} style={({ pressed }) => [styles.noteCard, pressed && styles.pressed]}>
        <View style={styles.noteIcon}><Ionicons name="heart" size={19} color={palette.coral} /></View>
        <View style={styles.noteCopy}><Text style={styles.noteTitle}>Keep your table favourites close</Text><Text style={styles.noteBody}>Saved dishes stay on this device, ready whenever you are.</Text></View>
        <Ionicons name="chevron-forward" size={18} color={palette.ocean} />
      </Pressable>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  topLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandMark: { width: 29, height: 29, borderRadius: 10, backgroundColor: palette.ocean, alignItems: "center", justifyContent: "center" },
  brand: { flex: 1, color: palette.ocean, fontFamily: font.extraBold, fontSize: 11, letterSpacing: 1.5 },
  offlineBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: palette.coconutPale, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10 },
  offlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.coconut },
  offlineText: { color: palette.oceanDeep, fontFamily: font.bold, fontSize: 9, letterSpacing: 0.6 },
  heroText: { gap: 6, paddingTop: 4 },
  kicker: { color: palette.coconut, fontFamily: font.extraBold, fontSize: 10, letterSpacing: 2 },
  title: { color: palette.ink, fontFamily: font.extraBold, fontSize: 32, lineHeight: 38, letterSpacing: -1 },
  titleAccent: { color: palette.ocean },
  subtitle: { color: palette.muted, fontFamily: font.regular, fontSize: 15, lineHeight: 22, maxWidth: 520 },
  section: { gap: 13 },
  categoryRail: { gap: 10, paddingRight: 20 },
  categoryShortcut: { width: 94, alignItems: "center", gap: 7, paddingVertical: 2 },
  categoryIcon: { width: 58, height: 58, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  categoryLabel: { color: palette.ink, fontFamily: font.medium, fontSize: 12 },
  foodRail: { gap: 12, paddingRight: 22 },
  noteCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 15, borderRadius: 19, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  noteIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#F8EBE5", alignItems: "center", justifyContent: "center" },
  noteCopy: { flex: 1, gap: 2 },
  noteTitle: { color: palette.ink, fontFamily: font.bold, fontSize: 14 },
  noteBody: { color: palette.muted, fontFamily: font.regular, fontSize: 12, lineHeight: 17 },
  pressed: { opacity: 0.85 },
});
