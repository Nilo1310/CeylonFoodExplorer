import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BackButton, EmptyState, ScreenFrame } from "@/components/ceylon-ui";
import { FOOD_IMAGES } from "@/src/data/foodImages";
import { useFoodLibrary } from "@/src/state/food-context";
import { font, palette } from "@/src/theme";

export default function FoodDetailsScreen() {
  const router = useRouter();
  const { foodId } = useLocalSearchParams<{ foodId?: string }>();
  const { foods, favoriteSet, toggleFavorite, loading } = useFoodLibrary();
  const food = foods.find((item) => item.id === foodId);
  if (!food) {
    return (
      <ScreenFrame>
        <View style={styles.topRow}><BackButton /><Text style={styles.eyebrow}>DISH NOTES</Text></View>
        <EmptyState title={loading ? "Opening the food library" : "Dish not found"} body={loading ? "Your local recipes are on their way." : "This dish is not in the on-device collection."} icon="restaurant-outline" />
      </ScreenFrame>
    );
  }

  const image = FOOD_IMAGES[food.imageKey];
  const saved = favoriteSet.has(food.id);
  return (
    <ScreenFrame contentStyle={styles.content}>
      <View style={styles.topRow}><BackButton /><Text style={styles.eyebrow}>DISH NOTES</Text><View style={{ flex: 1 }} /><Text style={styles.offline}>SAVED OFFLINE</Text></View>
      <View style={[styles.hero, { backgroundColor: food.accent }]}>
        {image ? <Image source={image} style={styles.heroImage} resizeMode="cover" /> : (
          <View style={styles.heroFallback}><View style={styles.heroHalo} /><Ionicons name="restaurant-outline" size={46} color={palette.ocean} /><Text style={styles.heroFallbackText}>FROM THE CEYLON TABLE</Text></View>
        )}
      </View>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.category}>{food.category.toUpperCase()} · {food.timeMinutes} MIN</Text>
          <Text style={styles.title}>{food.name}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={saved ? "Remove from favourites" : "Save to favourites"} onPress={() => void toggleFavorite(food.id)} style={styles.favoriteButton}>
          <Ionicons name={saved ? "heart" : "heart-outline"} size={21} color={saved ? palette.coral : palette.ocean} />
        </Pressable>
      </View>
      <Text style={styles.description}>{food.description}</Text>
      <View style={styles.infoCard}>
        <View style={styles.sectionTitleRow}><View style={styles.sectionIcon}><Ionicons name="basket-outline" size={17} color={palette.ocean} /></View><Text style={styles.sectionTitle}>What you’ll need</Text></View>
        <View style={styles.ingredients}>{food.ingredients.map((ingredient) => (
          <View key={ingredient} style={styles.ingredientRow}><View style={styles.bullet} /><Text style={styles.ingredientText}>{ingredient}</Text></View>
        ))}</View>
      </View>
      <View style={styles.infoCard}>
        <View style={styles.sectionTitleRow}><View style={[styles.sectionIcon, styles.stepIcon]}><Ionicons name="flame-outline" size={17} color={palette.ocean} /></View><Text style={styles.sectionTitle}>A little preparation</Text></View>
        <View style={styles.steps}>{food.preparation.map((step, index) => (
          <View key={`${index}-${step}`} style={styles.stepRow}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View><Text style={styles.stepText}>{step}</Text></View>
        ))}</View>
      </View>
      <View style={styles.offlineNote}><Ionicons name="cloud-offline-outline" size={18} color={palette.ocean} /><Text style={styles.offlineNoteText}>This recipe and its image are part of your on-device guide.</Text></View>
      <Pressable onPress={() => router.push("/(tabs)/categories")} style={styles.moreButton}><Text style={styles.moreButtonText}>Explore another meal</Text><Ionicons name="arrow-forward" size={16} color={palette.ocean} /></Pressable>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 9, gap: 17 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  eyebrow: { color: palette.ocean, fontFamily: font.bold, fontSize: 10, letterSpacing: 1.5 },
  offline: { color: palette.coconut, fontFamily: font.bold, fontSize: 9, letterSpacing: 0.7 },
  hero: { height: 235, borderRadius: 24, overflow: "hidden", position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroFallback: { flex: 1, alignItems: "center", justifyContent: "center", gap: 9 },
  heroHalo: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(255,255,255,0.45)" },
  heroFallbackText: { color: palette.ocean, fontFamily: font.bold, fontSize: 10, letterSpacing: 1.7 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  titleCopy: { flex: 1, gap: 2 },
  category: { color: palette.coconut, fontFamily: font.extraBold, fontSize: 10, letterSpacing: 1.4 },
  title: { color: palette.ink, fontFamily: font.extraBold, fontSize: 30, letterSpacing: -0.5 },
  favoriteButton: { width: 48, height: 48, borderRadius: 17, backgroundColor: palette.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: palette.line },
  description: { color: palette.muted, fontFamily: font.regular, fontSize: 15, lineHeight: 23 },
  infoCard: { padding: 17, borderRadius: 21, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, gap: 15 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  sectionIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: palette.coconutPale, alignItems: "center", justifyContent: "center" },
  stepIcon: { backgroundColor: "#F4EBD6" },
  sectionTitle: { color: palette.ink, fontFamily: font.bold, fontSize: 17 },
  ingredients: { gap: 11 },
  ingredientRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bullet: { width: 7, height: 7, marginTop: 6, borderRadius: 4, backgroundColor: palette.coconut },
  ingredientText: { flex: 1, color: palette.ink, fontFamily: font.regular, fontSize: 14, lineHeight: 20 },
  steps: { gap: 14 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  stepNumber: { width: 25, height: 25, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: palette.ocean },
  stepNumberText: { color: palette.white, fontFamily: font.bold, fontSize: 12 },
  stepText: { flex: 1, color: palette.ink, fontFamily: font.regular, fontSize: 14, lineHeight: 21, paddingTop: 1 },
  offlineNote: { flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: palette.coconutPale, borderRadius: 15 },
  offlineNoteText: { flex: 1, color: palette.oceanDeep, fontFamily: font.medium, fontSize: 12, lineHeight: 18 },
  moreButton: { alignSelf: "center", flexDirection: "row", gap: 7, alignItems: "center", padding: 12 },
  moreButtonText: { color: palette.ocean, fontFamily: font.bold, fontSize: 13 },
});
