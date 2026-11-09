import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenFrame } from "@/components/ceylon-ui";
import { FOOD_CATEGORIES, type FoodCategory } from "@/src/data/foodData";
import { useFoodLibrary } from "@/src/state/food-context";
import { font, palette } from "@/src/theme";

const CATEGORY_INFO: Record<FoodCategory, { description: string; icon: keyof typeof Ionicons.glyphMap; tint: string }> = {
  Breakfast: { description: "Gentle starts, coconut milk and warm rice", icon: "sunny-outline", tint: "#E7EFE4" },
  Lunch: { description: "Rice, curries and market-fresh vegetables", icon: "leaf-outline", tint: "#E5F0EC" },
  Dinner: { description: "Comforting plates and wok-side favourites", icon: "moon-outline", tint: "#E4EDF1" },
  Snacks: { description: "Little bites from the coast and street stalls", icon: "cafe-outline", tint: "#F3E8DB" },
  Sweets: { description: "Festive treats and coconut-kissed sweets", icon: "sparkles-outline", tint: "#F4EBCF" },
};

export default function CategoriesScreen() {
  const router = useRouter();
  const { foods } = useFoodLibrary();
  return (
    <ScreenFrame>
      <View style={styles.headingBlock}>
        <Text style={styles.kicker}>THE ISLAND TABLE</Text>
        <Text style={styles.title}>Browse by meal</Text>
        <Text style={styles.subtitle}>Follow the day from a slow breakfast to something sweet.</Text>
      </View>
      <View style={styles.list}>
        {FOOD_CATEGORIES.map((category) => {
          const info = CATEGORY_INFO[category];
          const count = foods.filter((food) => food.category === category).length;
          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: "/categories/[category]", params: { category: category.toLowerCase() } })}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={[styles.iconBox, { backgroundColor: info.tint }]}><Ionicons name={info.icon} size={22} color={palette.ocean} /></View>
              <View style={styles.copy}>
                <Text style={styles.name}>{category}</Text>
                <Text style={styles.description}>{info.description}</Text>
                <Text style={styles.count}>{count} {count === 1 ? "dish" : "dishes"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.footer}><Ionicons name="cloud-offline-outline" size={17} color={palette.ocean} /><Text style={styles.footerText}>Every dish is saved on this device — no connection needed.</Text></View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  headingBlock: { gap: 5, paddingTop: 6 },
  kicker: { color: palette.coconut, fontFamily: font.extraBold, fontSize: 10, letterSpacing: 1.8 },
  title: { color: palette.ink, fontFamily: font.extraBold, fontSize: 29, letterSpacing: -0.6 },
  subtitle: { color: palette.muted, fontFamily: font.regular, fontSize: 14, lineHeight: 21 },
  list: { gap: 11 },
  card: { flexDirection: "row", alignItems: "center", gap: 13, minHeight: 102, padding: 14, borderRadius: 20, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  iconBox: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 2 },
  name: { color: palette.ink, fontFamily: font.bold, fontSize: 17 },
  description: { color: palette.muted, fontFamily: font.regular, fontSize: 12, lineHeight: 17 },
  count: { marginTop: 2, color: palette.ocean, fontFamily: font.bold, fontSize: 11 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 16, backgroundColor: palette.coconutPale },
  footerText: { color: palette.oceanDeep, fontFamily: font.medium, fontSize: 12, flexShrink: 1 },
  pressed: { opacity: 0.82 },
});
