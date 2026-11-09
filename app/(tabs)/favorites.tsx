import { StyleSheet, Text, View } from "react-native";
import { FoodCard } from "@/components/food-card";
import { EmptyState, ScreenFrame } from "@/components/ceylon-ui";
import { useFoodLibrary } from "@/src/state/food-context";
import { font, palette } from "@/src/theme";

export default function FavoritesScreen() {
  const { foods, favoriteIds, favoriteSet, toggleFavorite, loading } = useFoodLibrary();
  const favourites = foods.filter((food) => favoriteSet.has(food.id));
  return (
    <ScreenFrame>
      <View style={styles.heading}>
        <Text style={styles.kicker}>YOUR LITTLE COLLECTION</Text>
        <Text style={styles.title}>Saved dishes</Text>
        <Text style={styles.subtitle}>A personal list that stays with you on this device.</Text>
      </View>
      {loading ? (
        <View style={styles.loading}><Text style={styles.loadingText}>Opening your local food library…</Text></View>
      ) : favourites.length ? (
        <>
          <Text style={styles.count}>{favoriteIds.length} {favoriteIds.length === 1 ? "favourite" : "favourites"}</Text>
          <View style={styles.results}>
            {favourites.map((food) => <FoodCard key={food.id} food={food} isFavorite onToggleFavorite={() => void toggleFavorite(food.id)} />)}
          </View>
        </>
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState title="Your table is waiting" body="Tap the heart on any dish to keep it here. Your saved favourites remain available offline." icon="heart-outline" />
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
  count: { color: palette.ocean, fontFamily: font.bold, fontSize: 13 },
  results: { flexDirection: "row", flexWrap: "wrap", gap: 13 },
  loading: { padding: 18, borderRadius: 18, backgroundColor: palette.white },
  loadingText: { color: palette.muted, fontFamily: font.regular },
  emptyWrap: { marginTop: 6 },
});
