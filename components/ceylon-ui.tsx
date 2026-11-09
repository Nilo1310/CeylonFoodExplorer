import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ScrollViewProps, type TextInputProps, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font, palette } from "@/src/theme";

export function ScreenFrame({ children, contentStyle, ...scrollProps }: ScrollViewProps & { contentStyle?: ViewStyle }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        {...scrollProps}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, contentStyle]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function BackButton({ title = "Back" }: { title?: string }) {
  const router = useRouter();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={() => router.back()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={19} color={palette.ink} />
    </Pressable>
  );
}

export function SearchBox({ value, onChangeText, placeholder = "Search foods, ingredients…", onSubmitEditing, autoFocus = false }: Pick<TextInputProps, "value" | "onChangeText" | "onSubmitEditing" | "autoFocus"> & { placeholder?: string }) {
  return (
    <View style={styles.searchBox}>
      <Ionicons name="search-outline" size={20} color={palette.muted} />
      <TextInput
        accessibilityLabel="Search foods"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor="#8B9B97"
        autoFocus={autoFocus}
        returnKeyType="search"
        style={styles.searchInput}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChangeText?.("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="#94A39F" />
        </Pressable>
      ) : null}
    </View>
  );
}

export function SectionHeading({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.actionRow}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={15} color={palette.ocean} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({ title, body, icon = "leaf-outline" }: { title: string; body: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={25} color={palette.ocean} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

export function useSearchValue(initial = "") {
  const [value, setValue] = useState(initial);
  return [value, setValue] as const;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 34, gap: 20, width: "100%", maxWidth: 760, alignSelf: "center" },
  backButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  searchBox: { minHeight: 54, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 17, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  searchInput: { flex: 1, paddingVertical: 12, color: palette.ink, fontFamily: font.regular, fontSize: 15, outlineStyle: "none" as never },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  sectionTitle: { color: palette.ink, fontFamily: font.bold, fontSize: 20, letterSpacing: -0.3 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 3, paddingVertical: 5 },
  actionText: { color: palette.ocean, fontFamily: font.medium, fontSize: 13 },
  emptyState: { alignItems: "center", justifyContent: "center", padding: 32, backgroundColor: palette.white, borderColor: palette.line, borderWidth: 1, borderRadius: 22, gap: 10 },
  emptyIcon: { width: 58, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: palette.coconutPale },
  emptyTitle: { color: palette.ink, fontFamily: font.bold, fontSize: 18, textAlign: "center" },
  emptyBody: { color: palette.muted, fontFamily: font.regular, fontSize: 14, lineHeight: 21, textAlign: "center", maxWidth: 300 },
});
