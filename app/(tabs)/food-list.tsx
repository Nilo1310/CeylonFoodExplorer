import { Redirect } from "expo-router";

/**
 * Visible entry point for the sixth-screen navigation requirement.
 * The existing category route remains the source of truth for food lists.
 */
export default function FoodListTab() {
  return <Redirect href={{ pathname: "/categories/[category]", params: { category: "breakfast" } }} />;
}
