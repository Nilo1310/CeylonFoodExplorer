import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Food } from "@/src/data/foodData";
import { FOOD_IMAGES } from "@/src/data/foodImages";
import { foodDetailRoute } from "@/src/navigation/routes";
import { font, palette } from "@/src/theme";

export function FoodCard({ food, isFavorite, onToggleFavorite }: { food: Food; isFavorite?: boolean; onToggleFavorite?: () => void }) {
  const router = useRouter();
  const image = FOOD_IMAGES[food.imageKey];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${food.name} details`}
      onPress={() => router.push(foodDetailRoute(food.id))}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.imageWrap, { backgroundColor: food.accent }]}>
        {image ? <Image source={image} style={styles.image} resizeMode="cover" /> : (
          <View style={styles.imageFallback}>
            <View style={styles.fallbackHalo} />
            <Ionicons name="restaurant-outline" size={34} color={palette.ocean} />
            <Text style={styles.fallbackLabel}>CEYLON TABLE</Text>
          </View>
        )}
        <View style={styles.categoryPill}><Text style={styles.categoryText}>{food.category}</Text></View>
        {onToggleFavorite ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? `Remove ${food.name} from favourites` : `Save ${food.name} to favourites`}
            onPress={(event) => { event.stopPropagation(); onToggleFavorite(); }}
            hitSlop={5}
            style={styles.favoriteButton}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={18} color={isFavorite ? palette.coral : palette.ink} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.copy}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>{food.name}</Text>
          <View style={styles.time}><Ionicons name="time-outline" size={13} color={palette.muted} /><Text style={styles.timeText}>{food.timeMinutes}m</Text></View>
        </View>
        <Text numberOfLines={2} style={styles.description}>{food.shortDescription}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 228, overflow: "hidden", borderRadius: 22, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  imageWrap: { height: 144, overflow: "hidden", position: "relative" },
  image: { width: "100%", height: "100%" },
  imageFallback: { flex: 1, justifyContent: "center", alignItems: "center", gap: 6 },
  fallbackHalo: { position: "absolute", width: 98, height: 98, borderRadius: 49, backgroundColor: "rgba(255,255,255,0.48)" },
  fallbackLabel: { color: palette.ocean, fontFamily: font.bold, fontSize: 9, letterSpacing: 1.5 },
  categoryPill: { position: "absolute", left: 10, bottom: 10, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 9, paddingHorizontal: 9, paddingVertical: 5 },
  categoryText: { color: palette.oceanDeep, fontFamily: font.bold, fontSize: 10 },
  favoriteButton: { position: "absolute", top: 10, right: 10, width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.94)" },
  copy: { padding: 13, gap: 5 },
  nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  name: { flex: 1, color: palette.ink, fontFamily: font.bold, fontSize: 16 },
  time: { flexDirection: "row", alignItems: "center", gap: 3 },
  timeText: { color: palette.muted, fontFamily: font.medium, fontSize: 11 },
  description: { color: palette.muted, fontFamily: font.regular, fontSize: 12, lineHeight: 17 },
});
