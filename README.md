# Ceylon Food Explorer

An offline-first Sri Lankan traditional food guide built with the managed Expo / React Native / TypeScript starter.

## Run the project

The managed project uses Expo Metro/Web on port 8081 and the starter API on port 3000. Start the project from its root with `pnpm dev`. The mobile screens and on-device food database do not require an online food API.

## App structure

- `app/(tabs)/index.tsx` — home, search entry point, meal shortcuts and popular dishes.
- `app/(tabs)/categories.tsx` — Breakfast, Lunch, Dinner, Snacks and Sweets.
- `app/(tabs)/search.tsx` — local name, ingredient and category search with meal filters.
- `app/(tabs)/favorites.tsx` — dishes saved on the device.
- `app/categories/[category].tsx` — database-backed list for a selected meal.
- `app/foods/[foodId].tsx` — dish description, ingredients, preparation steps and favourite control.
- `src/data/foodData.ts` — bundled Sri Lankan dish seed content.
- `src/data/foodStorage.native.ts` — transactional SQLite catalogue and favourites on iOS/Android.
- `src/data/foodStorage.ts` — bundled catalogue and AsyncStorage favourites for Expo Web preview.
- `src/state/food-context.tsx` — shared app data and favourites.
- `components/` — reusable food cards and screen controls.
- `assets/images/foods/` — seven bundled local food images used by the dish cards and details screens.

## Six required screens

The app has six distinct screens connected with Expo Router: Home, Categories, Food List, Food Details, Search and Favourites. Home, Categories, Search and Favourites are bottom tabs. Category selection opens the Food List screen, and every food card opens Food Details. The Search screen combines a local text search with visible meal-category filter chips.

## Offline data

On iOS and Android, the app creates `ceylon-food-explorer.db` with `foods` and `favorites` tables, seeds the local catalogue on first launch, queries names, ingredients and categories locally and stores saved dish IDs in SQLite. The data seed and image assets are bundled with the project, so browsing does not call an external API. Expo Web preview uses the bundled catalogue and browser-local storage for favourites because native SQLite is not the browser persistence surface.

## Included dishes

Kiribath, String Hoppers, Pittu, Rice & Curry, Kottu Roti, Isso Wade and Kokis are included with categories, descriptions, ingredient lists and preparation steps.
